const { asyncHandler, ApiError } = require("../utils/errors");
const Job = require("../models/Job");
const Company = require("../models/Company");
const SavedJob = require("../models/SavedJob");
const Application = require("../models/Application");

const listJobs = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 9, 30);
  const { q, type, level, location, status } = req.query;

  const filter = {};
  if (status === "closed") filter.status = "closed";
  else filter.status = "open";
  if (type) filter.type = type;
  if (level) filter.experienceLevel = level;
  if (location) filter.location = new RegExp(escapeRegex(location), "i");
  if (q && String(q).trim()) {
    const rx = new RegExp(escapeRegex(String(q).trim()), "i");
    filter.$or = [{ title: rx }, { description: rx }, { location: rx }, { skills: rx }];
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("company", "name location size")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Job.countDocuments(filter),
  ]);

  res.json({
    jobs,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
});

const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("company")
    .populate("recruiter", "name email");
  if (!job) throw new ApiError(404, "Job not found");

  const applicants = await Application.countDocuments({ job: job._id });
  let saved = false;
  let applied = false;
  if (req.user) {
    saved = !!(await SavedJob.exists({ user: req.user._id, job: job._id }));
    applied = !!(await Application.exists({ seeker: req.user._id, job: job._id }));
  }
  res.json({ job, applicants, saved, applied });
});

const createJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) throw new ApiError(400, "Create your company profile before posting a job");

  const job = await Job.create({
    ...pickJob(req.body),
    company: company._id,
    recruiter: req.user._id,
  });
  res.status(201).json({ job });
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");
  if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You can only edit your own jobs");
  }
  Object.assign(job, pickJob(req.body));
  await job.save();
  res.json({ job });
});

const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");
  if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own jobs");
  }
  await job.deleteOne();
  await Application.deleteMany({ job: job._id });
  await SavedJob.deleteMany({ job: job._id });
  res.json({ message: "Job removed" });
});

const myJobs = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { recruiter: req.user._id };
  const jobs = await Job.find(filter)
    .populate("company", "name")
    .sort({ createdAt: -1 });
  res.json({ jobs });
});

const toggleSave = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");
  const existing = await SavedJob.findOne({ user: req.user._id, job: job._id });
  if (existing) {
    await existing.deleteOne();
    return res.json({ saved: false });
  }
  await SavedJob.create({ user: req.user._id, job: job._id });
  res.json({ saved: true });
});

const savedJobs = asyncHandler(async (req, res) => {
  const rows = await SavedJob.find({ user: req.user._id })
    .populate({
      path: "job",
      populate: { path: "company", select: "name location" },
    })
    .sort({ createdAt: -1 });
  res.json({ jobs: rows.map((r) => r.job).filter(Boolean) });
});

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pickJob(body) {
  return {
    title: body.title,
    description: body.description,
    location: body.location,
    type: body.type,
    experienceLevel: body.experienceLevel,
    salaryMin: body.salaryMin || 0,
    salaryMax: body.salaryMax || 0,
    skills: Array.isArray(body.skills)
      ? body.skills
      : String(body.skills || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    status: body.status === "closed" ? "closed" : "open",
  };
}

module.exports = {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  myJobs,
  toggleSave,
  savedJobs,
};
