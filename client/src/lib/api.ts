import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000
});

export type JobInput = {
  title?: string;
  description: string;
  skillsRequired?: string;
  responsibilities?: string;
};

export type AnalysisData = {
  ATS_score: number;
  Job_match_score: number;
  Overall_score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  ats_tips: string[];
  job_matching_insights: string[];
};

export async function uploadResume(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/api/resume/upload", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data as { resumeText: string };
}

export async function analyze(resumeText: string, job: JobInput) {
  const res = await api.post("/api/analyze", { resumeText, job });
  return res.data as { id: string; provider: "gemini" | "ollama"; data: AnalysisData };
}

export async function getReport(id: string) {
  const res = await api.get(`/api/report/${id}`);
  return res.data as {
    id: string;
    provider: "gemini" | "ollama";
    createdAt: string;
    job: JobInput;
    data: AnalysisData;
  };
}

