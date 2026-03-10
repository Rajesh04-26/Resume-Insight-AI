import React from "react";
import { cn } from "../lib/cn";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}>{children}</div>;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base =
    "ring-accent inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-[rgb(var(--accent))] text-black shadow-[0_10px_30px_rgba(var(--accent),0.15)] hover:brightness-110"
      : "bg-white/0 text-[rgb(var(--text))] hover:bg-white/5";
  return <button className={cn(base, styles, className)} {...props} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "ring-accent w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))]",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "ring-accent w-full min-h-28 resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))]",
        props.className
      )}
    />
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[rgb(var(--muted))]",
        className
      )}
    >
      {children}
    </span>
  );
}

