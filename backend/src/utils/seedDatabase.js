const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

const jobsSeed = [
  {
    title: "Full Stack MERN Engineer",
    location: "Bengaluru",
    type: "full-time",
    experienceLevel: "mid",
    salaryMin: 1200000,
    salaryMax: 1800000,
    skills: ["React", "Node.js", "MongoDB", "Express"],
    description:
      "Build product features across React and Express. You will own REST APIs, JWT auth, and MongoDB data models for our hiring marketplace.",
  },
  {
    title: "Frontend React Developer",
    location: "Remote",
    type: "remote",
    experienceLevel: "junior",
    salaryMin: 800000,
    salaryMax: 1200000,
    skills: ["React", "JavaScript", "CSS", "Vite"],
    description:
      "Ship responsive UI, reusable components, and accessible forms. Experience with React Router and Axios is a plus.",
  },
  {
    title: "Backend Node.js Intern",
    location: "Hyderabad",
    type: "internship",
    experienceLevel: "intern",
    salaryMin: 20000,
    salaryMax: 35000,
    skills: ["Node.js", "Express", "MongoDB"],
    description:
      "Learn production API design: middleware, validation, file uploads, and pagination while pairing with senior engineers.",
  },
  {
    title: "Senior Recruiter Operations",
    location: "Mumbai",
    type: "full-time",
    experienceLevel: "senior",
    salaryMin: 1400000,
    salaryMax: 2000000,
    skills: ["Hiring", "Communication", "ATS"],
    description:
      "Own the recruiter workflow: job intake, candidate pipeline, and status updates for high-volume tech roles.",
  },
  {
    title: "Contract UI Engineer",
    location: "Pune",
    type: "contract",
    experienceLevel: "mid",
    salaryMin: 80000,
    salaryMax: 120000,
    skills: ["React", "Figma", "Accessibility"],
    description:
      "Six-month contract to redesign dashboard screens, improve mobile nav, and tighten design tokens.",
  },
  {
    title: "Lead Platform Engineer",
    location: "Gurugram",
    type: "full-time",
    experienceLevel: "lead",
    salaryMin: 2800000,
    salaryMax: 4000000,
    skills: ["Node.js", "System Design", "MongoDB", "Redis"],
    description:
      "Set API standards, review architecture, and mentor the backend team. Strong MongoDB indexing and aggregation skills required.",
  },
];

async function seedDatabase({ reset = false } = {}) {
  if (reset) {
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      SavedJob.deleteMany({}),
    ]);
  } else if ((await User.countDocuments()) > 0) {
    return false;
  }

  const recruiter = await User.create({
    name: "Rahul Recruiter",
    email: "recruiter@hireflow.dev",
    password: "Recruiter@123",
    role: "recruiter",
    headline: "Talent partner at Nimbus Labs",
    location: "Bengaluru",
  });

  await User.create({
    name: "Asha Admin",
    email: "admin@hireflow.dev",
    password: "Admin@123",
    role: "admin",
    headline: "Platform administrator",
  });

  const uploadsDir = path.join(__dirname, "../../uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  const resumeName = "demo-priya-resume.pdf";
  const resumePath = path.join(uploadsDir, resumeName);
  if (!fs.existsSync(resumePath)) {
    fs.writeFileSync(
      resumePath,
      "%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n0\n%%EOF\n"
    );
  }

  const seeker = await User.create({
    name: "Priya Patel",
    email: "seeker@hireflow.dev",
    password: "Seeker@123",
    role: "seeker",
    headline: "MERN stack developer",
    bio: "I build REST APIs and React UIs. Looking for a mid-level full stack role.",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    location: "Pune",
    resumeUrl: `/uploads/${resumeName}`,
  });

  const company = await Company.create({
    name: "Nimbus Labs",
    description: "Product studio building hiring tools for growing teams.",
    website: "https://nimbus.example",
    location: "Bengaluru",
    size: "51-200",
    owner: recruiter._id,
  });

  const jobs = await Job.insertMany(
    jobsSeed.map((j) => ({ ...j, company: company._id, recruiter: recruiter._id }))
  );

  await Application.create({
    job: jobs[0]._id,
    seeker: seeker._id,
    coverLetter: "I have shipped MERN apps with JWT auth and pagination.",
    resumeUrl: `/uploads/${resumeName}`,
    status: "reviewing",
  });

  console.log("Demo users: seeker@hireflow.dev / Seeker@123 | recruiter@hireflow.dev / Recruiter@123 | admin@hireflow.dev / Admin@123");
  return true;
}

module.exports = { seedDatabase };
