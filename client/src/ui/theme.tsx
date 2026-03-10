import React from "react";

export type ThemeId = "dark-gold" | "neon-blue" | "forest" | "white" | "cyber-dark";

const THEMES: { id: ThemeId; label: string }[] = [
  { id: "dark-gold", label: "Dark Gold" },
  { id: "neon-blue", label: "Neon Blue" },
  { id: "forest", label: "Forest" },
  { id: "white", label: "White" },
  { id: "cyber-dark", label: "Cyber Dark" }
];

const ThemeCtx = React.createContext<{
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  themes: typeof THEMES;
} | null>(null);

const STORAGE_KEY = "aria_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return saved || "dark-gold";
  });

  const setTheme = React.useCallback((t: ThemeId) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, setTheme, themes: THEMES }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const v = React.useContext(ThemeCtx);
  if (!v) throw new Error("useTheme must be used within ThemeProvider");
  return v;
}

