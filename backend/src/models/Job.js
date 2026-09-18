const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["intern", "junior", "mid", "senior", "lead"],
      default: "mid",
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    skills: [{ type: String, trim: true }],
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", location: "text" });
jobSchema.index({ type: 1, status: 1, createdAt: -1 });

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);
