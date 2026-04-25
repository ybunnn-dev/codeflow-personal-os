// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

// --- THEME CONTEXT TYPE ---
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1. Check local storage and system preference on initial load
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme === "dark") {
      setIsDarkMode(true);
    } else if (storedTheme === "light") {
      setIsDarkMode(false);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);

  // 2. Apply class to HTML and save preference
  useEffect(() => {
    if (!mounted) return;

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <SessionProvider>
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        {/* Render children normally, but hide visually until mounted to prevent hydration flicker */}
        <div className={!mounted ? "invisible" : ""}>
          {children}
        </div>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}

// Custom hook to use the theme anywhere in your app
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a Providers wrapper");
  }
  return context;
};