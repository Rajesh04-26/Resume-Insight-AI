import mongoose from "mongoose";

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    resumeText: { type: String, required: true },
    job: {
      title: { type: String, default: "" },
      description: { type: String, required: true },
      skillsRequired: { type: String, default: "" },
      responsibilities: { type: String, default: "" }
    },
    atsScore: { type: Number, required: true },
    jobMatchScore: { type: Number, required: true },
    overallScore: { type: Number, required: true },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    atsTips: { type: [String], default: [] },
    jobMatchingInsights: { type: [String], default: [] },
    aiProvider: { type: String, enum: ["gemini", "ollama"], required: true }
  },
  { timestamps: true }
);

export const ResumeAnalysis =
  mongoose.models.ResumeAnalysis ||
  mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);

