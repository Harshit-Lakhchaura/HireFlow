const { asyncHandler, ApiError } = require("../utils/errors");
const Application = require("../models/Application");
const Job = require("../models/Job");

const apply = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.body.jobId);
  if (!job || job.status !== "open") throw new ApiError(400, "Job is not open for applications");

  const already = await Application.findOne({ job: job._id, seeker: req.user._id });
  if (already) throw new ApiError(409, "You already applied to this job");

  const resumeUrl = req.file ? `/uploads/${req.file.filename}` : req.user.resumeUrl;
  if (!resumeUrl) throw new ApiError(400, "Upload a resume before applying");

  const application = await Application.create({
    job: job._id,
    seeker: req.user._id,
    coverLetter: req.body.coverLetter || "",
    resumeUrl,
  });
  res.status(201).json({ application });
});

const myApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ seeker: req.user._id })
    .populate({
      path: "job",
      populate: { path: "company", select: "name location" },
    })
    .sort({ createdAt: -1 });
  res.json({ applications });
});

const jobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) throw new ApiError(404, "Job not found");
  if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not allowed to view these applications");
  }
  const applications = await Application.find({ job: job._id })
    .populate("seeker", "name email headline skills location")
    .sort({ createdAt: -1 });
  res.json({ applications, job });
});

const updateStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate("job");
  if (!application) throw new ApiError(404, "Application not found");
  if (
    application.job.recruiter.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not allowed");
  }
  const allowed = ["applied", "reviewing", "shortlisted", "rejected", "hired"];
  if (!allowed.includes(req.body.status)) throw new ApiError(400, "Invalid status");
  application.status = req.body.status;
  await application.save();
  res.json({ application });
});

module.exports = { apply, myApplications, jobApplications, updateStatus };
