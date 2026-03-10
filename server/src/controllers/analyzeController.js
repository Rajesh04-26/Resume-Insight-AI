import { z } from "zod";
import { generateAnalysis } from "../services/analysisService.js";
import { ResumeAnalysis } from "../models/ResumeAnalysis.js";

const schema = z.object({
  resumeText: z.string().min(1),
  job: z.object({
    title: z.string().optional().default(""),
    description: z.string().min(1),
    skillsRequired: z.string().optional().default(""),
    responsibilities: z.string().optional().default("")
  })
});

export async function analyzeResume(req, res, next) {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body", details: parsed.error.issues });
    }

    const { resumeText, job } = parsed.data;
    const result = await generateAnalysis({ resumeText, job });

    const doc = await ResumeAnalysis.create({
      resumeText,
      job,
      atsScore: result.data.ATS_score,
      jobMatchScore: result.data.Job_match_score,
      overallScore: result.data.Overall_score,
      strengths: result.data.strengths,
      weaknesses: result.data.weaknesses,
      improvements: result.data.improvements,
      atsTips: result.data.ats_tips,
      jobMatchingInsights: result.data.job_matching_insights,
      aiProvider: result.provider
    });

    res.json({
      id: doc._id,
      provider: result.provider,
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

