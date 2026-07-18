"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { ThemePreference } from "@/types";

interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  resolvedTheme: "dark-neon" | "light-edu" | "nature-cinematic";
}

const defaultThemeValue: ThemeContextValue = {
  theme: "light-edu",
  setTheme: () => {},
  resolvedTheme: "light-edu",
};

const ThemeContext = createContext<ThemeContextValue>(defaultThemeValue);
const STORAGE_KEY = "algo-flow-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "light-edu";
    const saved = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    return saved && ["dark-neon", "light-edu", "nature-cinematic", "system"].includes(saved)
      ? saved
      : "light-edu";
  });

  const resolveTheme = useCallback(
    (preference: ThemePreference): "dark-neon" | "light-edu" | "nature-cinematic" => {
      if (preference !== "system") return preference;
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light-edu" : "dark-neon";
    },
    []
  );

  const resolvedTheme = resolveTheme(theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => {
      document.documentElement.setAttribute(
        "data-theme",
        media.matches ? "light-edu" : "dark-neon"
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
