export function buildAnalysisPrompt({ resumeText, job }) {
  const jobBlock = [
    `Job Title: ${job?.title || ""}`.trim(),
    `Job Description: ${job?.description || ""}`.trim(),
    `Skills Required: ${job?.skillsRequired || ""}`.trim(),
    `Responsibilities: ${job?.responsibilities || ""}`.trim()
  ]
    .filter(Boolean)
    .join("\n");

  return `
You are an expert ATS resume reviewer and hiring manager.

Analyze the FULL resume from start to end against the job description. Be precise and practical.

Return STRICT JSON ONLY (no markdown, no code fences, no explanations).

JSON schema (keys must match exactly):
{
  "ATS_score": 85,
  "Job_match_score": 92,
  "Overall_score": 89,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvements": ["..."],
  "ats_tips": ["..."],
  "job_matching_insights": ["..."]
}

Do NOT include comments, trailing commas, or any extra fields.
Keep each array concise (max 6 items per array) so the JSON is never truncated.

Scoring guidance:
- ATS_score: keywords, structure, section headings, consistency, clarity, measurable impact, formatting that ATS can parse.
- Job_match_score: skills alignment, role fit, seniority match, domain fit, recency, specificity.

Resume:
"""
${resumeText}
"""

Job description:
"""
${jobBlock}
"""
`.trim();
}

