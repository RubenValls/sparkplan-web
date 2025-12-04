"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.scss";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  
  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  if (savedTheme) return savedTheme;
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    
    Promise.resolve().then(() => setIsClient(true));
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!isClient) {
    return (
      <div className={styles.themeToggle} aria-hidden="true" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className={styles.themeToggle__icon} />
      ) : (
        <Sun className={styles.themeToggle__icon} />
      )}
    </button>
  );
}