"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { ThemePreference } from "@/types";

interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  resolvedTheme: "light" | "dark";
}

const defaultThemeValue: ThemeContextValue = {
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
};

const ThemeContext = createContext<ThemeContextValue>(defaultThemeValue);
const STORAGE_KEY = "algo-flow-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    return saved && ["light", "dark", "dark-neon", "light-edu", "nature-cinematic", "system"].includes(saved)
      ? saved
      : "light";
  });

  const resolveTheme = useCallback(
    (preference: ThemePreference): "light" | "dark" => {
      if (preference === "dark" || preference === "dark-neon" || preference === "nature-cinematic") return "dark";
      if (preference === "light" || preference === "light-edu") return "light";
      return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    []
  );

  const resolvedTheme = resolveTheme(theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      document.documentElement.setAttribute(
        "data-theme",
        media.matches ? "dark" : "light"
      );
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemePreference) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
