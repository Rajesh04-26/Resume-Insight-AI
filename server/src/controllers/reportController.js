import { ResumeAnalysis } from "../models/ResumeAnalysis.js";

export async function getReport(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await ResumeAnalysis.findById(id).lean();
    if (!doc) return res.status(404).json({ error: "Report not found" });
    res.json({
      id: doc._id,
      provider: doc.aiProvider,
      createdAt: doc.createdAt,
      job: doc.job,
      data: {
        ATS_score: doc.atsScore,
        Job_match_score: doc.jobMatchScore,
        Overall_score: doc.overallScore,
        strengths: doc.strengths,
        weaknesses: doc.weaknesses,
        improvements: doc.improvements,
        ats_tips: doc.atsTips,
        job_matching_insights: doc.jobMatchingInsights
      }
    });
  } catch (err) {
    next(err);
  }
}

