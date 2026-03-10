import React from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, AlertTriangle, PencilLine, Target, Briefcase } from "lucide-react";
import type { AnalysisData } from "../lib/api";
import { Badge } from "./components";

function ScoreCard({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-[rgb(var(--muted))]">{label}</div>
        <Badge>{pct}/100</Badge>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full rounded-full bg-[rgb(var(--accent))] shadow-[0_10px_30px_rgba(var(--accent),0.15)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  icon
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))]">
          {icon}
        </span>
        <span>{title}</span>
      </div>
      <ul className="mt-3 space-y-1 text-sm leading-relaxed text-[rgb(var(--muted))]">
        {items.length ? (
          items.map((x, i) => (
            <li
              key={i}
              className="flex gap-3 border-b border-white/10 pb-2 last:border-b-0"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[rgb(var(--accent2))]" />
              <span className="flex-1">{x}</span>
            </li>
          ))
        ) : (
          <li className="italic text-[rgb(var(--muted))]">
            No observations were returned for this section.
          </li>
        )}
      </ul>
    </div>
  );
}

export function Results({
  id,
  provider,
  data
}: {
  id: string;
  provider: "gemini" | "ollama";
  data: AnalysisData;
}) {
  const chartData = React.useMemo(
    () => [
      { name: "ATS", score: data.ATS_score },
      { name: "Job Match", score: data.Job_match_score },
      { name: "Overall", score: data.Overall_score }
    ],
    [data]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-[rgb(var(--muted))]">
          Report ID: <span className="text-[rgb(var(--text))]">{id}</span>
        </div>
        <Badge>AI: {provider}</Badge>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ScoreCard label="ATS Score" value={data.ATS_score} />
        <ScoreCard label="Job Match Score" value={data.Job_match_score} />
        <ScoreCard label="Overall Score" value={data.Overall_score} />
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 text-sm font-semibold">Scores Overview</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10,12,18,0.85)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="rgb(var(--accent))" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <Section
          title="Strengths"
          items={data.strengths}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <Section
          title="Weaknesses / Areas to Refine"
          items={data.weaknesses}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <Section
          title="Suggested Improvements (Rewritten Bullets)"
          items={data.improvements}
          icon={<PencilLine className="h-4 w-4" />}
        />
        <Section
          title="ATS Optimisation Recommendations"
          items={data.ats_tips}
          icon={<Target className="h-4 w-4" />}
        />
        <Section
          title="Job Matching Insights"
          items={data.job_matching_insights}
          icon={<Briefcase className="h-4 w-4" />}
        />
      </div>
    </motion.div>
  );
}

