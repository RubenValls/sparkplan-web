"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        className={styles.themeToggle}
        disabled
        aria-label="Toggle theme"
        style={{ opacity: 0.5, pointerEvents: "none" }}
      >
        <Sun className={styles.themeToggle__icon} />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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