import { analysisSchema, safeJsonParse } from "./aiSchemas.js";
import { buildAnalysisPrompt } from "./analysisPrompt.js";
import { runGemini } from "./geminiService.js";

function normalizeScores(parsed) {
  const ats = parsed.ATS_score;
  const jm = parsed.Job_match_score;
  const overall = Math.round(0.4 * ats + 0.6 * jm);
  return { ...parsed, Overall_score: overall };
}

function salvageIfTruncatedJson(raw) {
  // If the model output is truncated but contains the three scores,
  // salvage a minimal valid object so the UX doesn't hard-fail.
  const ats = raw.match(/"ATS_score"\s*:\s*(\d{1,3}(?:\.\d+)?)/)?.[1];
  const jm = raw.match(/"Job_match_score"\s*:\s*(\d{1,3}(?:\.\d+)?)/)?.[1];
  const ov = raw.match(/"Overall_score"\s*:\s*(\d{1,3}(?:\.\d+)?)/)?.[1];
  if (!ats || !jm || !ov) return null;
  return {
    ATS_score: Number(ats),
    Job_match_score: Number(jm),
    Overall_score: Number(ov),
    strengths: [],
    weaknesses: [],
    improvements: [],
    ats_tips: [],
    job_matching_insights: []
  };
}

async function runAndValidate(provider, fn, prompt) {
  const raw = await fn(prompt);
  const parsed = safeJsonParse(raw);
  if (!parsed.ok) {
    const salvaged = salvageIfTruncatedJson(raw);
    if (salvaged) {
      const validated = analysisSchema.safeParse(salvaged);
      if (validated.success) return normalizeScores(validated.data);
    }

    const err = new Error(`${provider} returned non-JSON output`);
    err.statusCode = 502;
    err.details = { provider, rawPreview: raw.slice(0, 500) };
    throw err;
  }
  const validated = analysisSchema.safeParse(parsed.value);
  if (!validated.success) {
    const err = new Error(`${provider} returned invalid JSON schema`);
    err.statusCode = 502;
    err.details = { provider, issues: validated.error.issues };
    throw err;
  }
  return normalizeScores(validated.data);
}

export async function generateAnalysis({ resumeText, job }) {
  const prompt = buildAnalysisPrompt({ resumeText, job });
  const data = await runAndValidate("gemini", runGemini, prompt);
  return { provider: "gemini", data };
}

