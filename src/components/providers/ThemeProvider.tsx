"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ThemePreference } from "@/types";

interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  resolvedTheme: "dark-neon" | "light-edu" | "nature-cinematic";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "algo-flow-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("dark-neon");
  const [mounted, setMounted] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    if (saved && ["dark-neon", "light-edu", "nature-cinematic", "system"].includes(saved)) {
      setThemeState(saved);
    }
  }, []);

  // Resolve system theme
  const resolveTheme = useCallback(
    (t: ThemePreference): "dark-neon" | "light-edu" | "nature-cinematic" => {
      if (t === "system") {
        if (typeof window !== "undefined") {
          return window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light-edu"
            : "dark-neon";
        }
        return "dark-neon";
      }
      return t;
    },
    []
  );

  const resolvedTheme = resolveTheme(theme);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
      document.documentElement.setAttribute(
        "data-theme",
        mql.matches ? "light-edu" : "dark-neon"
      );
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemePreference) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
