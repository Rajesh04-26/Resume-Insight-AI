import React from "react";
import { motion } from "framer-motion";
import { BarChart3, FileText, Sparkles, Wand2 } from "lucide-react";

import { analyze, uploadResume, type AnalysisData, type JobInput } from "../lib/api";
import { Badge, Button, Container, Textarea } from "./components";
import { ThemeProvider, useTheme } from "./theme";
import { Results } from "./Results";

function TopNav() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[rgb(var(--bg))]/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgb(var(--accent))] text-black shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">AI Resume Analyzer</div>
            <div className="text-xs text-[rgb(var(--muted))]">ATS score • Job match • Improvements</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge>Gemini + Local Fallback</Badge>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="theme-select ring-accent rounded-xl border border-white/10 bg-[rgb(var(--accent))]/10 px-3 py-2 text-sm text-[rgb(var(--text))]"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </Container>
    </div>
  );
}

function Hero() {
  return (
    <Container className="pt-10 md:pt-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-8 md:p-10"
      >
        <div className="absolute -top-24 right-[-80px] h-64 w-64 rounded-full bg-[rgb(var(--accent))]/20 blur-3xl" />
        <div className="absolute -bottom-24 left-[-80px] h-64 w-64 rounded-full bg-[rgb(var(--accent2))]/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <span className="inline-flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" /> Premium dashboard
              </span>
            </Badge>
            <Badge>
              <span className="inline-flex items-center gap-1">
                <Wand2 className="h-3.5 w-3.5" /> Rewrite weak bullets
              </span>
            </Badge>
            <Badge>
              <span className="inline-flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> PDF parsing
              </span>
            </Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Make your resume <span className="text-[rgb(var(--accent2))]">ATS-friendly</span> and{" "}
            <span className="text-[rgb(var(--accent))]">job-matched</span> in minutes.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[rgb(var(--muted))] md:text-base">
            Upload your resume PDF, paste the job description, and get a structured report with scores, strengths,
            weaknesses, rewritten improvements, and concrete ATS optimization tips.
          </p>
        </div>
      </motion.div>
    </Container>
  );
}

type StepState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "done"; id: string; provider: "gemini" | "ollama"; data: AnalysisData; job: JobInput }
  | { status: "error"; message: string };

function Workspace() {
  const [file, setFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [job, setJob] = React.useState<JobInput>({
    description: "",
    skillsRequired: "",
    responsibilities: "",
    title: ""
  });
  const [state, setState] = React.useState<StepState>({ status: "idle" });

  function onClear() {
    setFile(null);
    setJob({
      description: "",
      skillsRequired: "",
      responsibilities: "",
      title: ""
    });
    setState({ status: "idle" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onAnalyze() {
    if (!file) {
      setState({ status: "error", message: "Please upload your resume PDF first." });
      return;
    }
    if (!job.description.trim()) {
      setState({ status: "error", message: "Please paste the job description." });
      return;
    }
    setState({ status: "analyzing" });
    try {
      const { resumeText } = await uploadResume(file);
      const result = await analyze(resumeText, job);
      setState({ status: "done", id: result.id, provider: result.provider, data: result.data, job });
    } catch (e: any) {
      setState({ status: "error", message: e?.response?.data?.error || e?.message || "Analysis failed" });
    }
  }

  const isBusy = state.status === "analyzing";

  return (
    <Container className="mt-8 grid gap-6 pb-16 md:grid-cols-2">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-base font-semibold">Upload + Job Description</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              PDF resume parsing on the server, then AI scoring with fallback.
            </div>
          </div>
          <Badge>{state.status === "done" ? `Provider: ${state.provider}` : "Ready"}</Badge>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <div className="mb-2 text-xs font-semibold text-[rgb(var(--muted))]">Resume PDF</div>
            <input
              type="file"
              accept="application/pdf,.pdf"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-[rgb(var(--muted))] file:mr-4 file:rounded-xl file:border-0 file:bg-[rgb(var(--accent))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:brightness-110"
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold text-[rgb(var(--muted))]">Job Description (required)</div>
            <Textarea
              value={job.description}
              onChange={(e) => setJob((j) => ({ ...j, description: e.target.value }))}
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <Button onClick={onAnalyze} disabled={isBusy}>
              {state.status === "analyzing" ? "Analyzing..." : "Analyze Resume"}
            </Button>
            <Button variant="ghost" type="button" onClick={onClear} disabled={isBusy}>
              Clear
            </Button>
          </div>

          {state.status === "error" && (
            <div className="mt-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {state.message}
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="text-base font-semibold">Results</div>
        <div className="mt-1 text-sm text-[rgb(var(--muted))]">Scores, charts, and your premium AI report.</div>

        <div className="mt-5">
          {state.status === "done" ? (
            <Results id={state.id} provider={state.provider} data={state.data} />
          ) : (
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
              <div className="text-sm text-[rgb(var(--muted))]">
                Upload a resume and run analysis to view charts and the detailed report.
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TopNav />
      <Hero />
      <Workspace />
      <div className="pb-10">
        <Container>
          <div className="text-center text-xs text-[rgb(var(--muted))]">
            Welcome to Resume-Insight-AI to make your resume better.
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
}

