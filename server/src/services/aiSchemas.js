import { z } from "zod";

export const analysisSchema = z.object({
  ATS_score: z.number().min(0).max(100),
  Job_match_score: z.number().min(0).max(100),
  Overall_score: z.number().min(0).max(100),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  ats_tips: z.array(z.string()).default([]),
  job_matching_insights: z.array(z.string()).default([])
});

export function safeJsonParse(text) {
  function tryParse(raw) {
    let s = raw.trim();
    // Strip fences if present
    const fenced = s.match(/```json\s*([\s\S]*?)```/i) || s.match(/```([\s\S]*?)```/i);
    if (fenced?.[1]) s = fenced[1].trim();
    // Remove JS-style comments
    s = s.replace(/\/\/.*$/gm, "");
    s = s.replace(/\/\*[\s\S]*?\*\//g, "");
    try {
      return JSON.parse(s);
    } catch {
      // Remove trailing commas before } or ]
      s = s.replace(/,\s*([}\]])/g, "$1");
      return JSON.parse(s);
    }
  }

  try {
    return { ok: true, value: tryParse(text) };
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const slice = text.slice(firstBrace, lastBrace + 1);
      try {
        return { ok: true, value: tryParse(slice) };
      } catch {
        return { ok: false };
      }
    }
    return { ok: false };
  }
}

