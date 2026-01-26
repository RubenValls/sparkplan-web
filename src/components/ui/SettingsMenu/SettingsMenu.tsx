"use client";

import { useState, useRef, useEffect } from "react";
import { Settings } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import styles from "./SettingsMenu.module.scss";

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={styles.settingsMenu} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.settingsMenu__trigger}
        aria-label="Settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className={styles.settingsMenu__icon} />
      </button>

      {isOpen && (
        <div className={styles.settingsMenu__dropdown}>
          <ThemeToggle variant="menu" />
          <LanguageSwitcher variant="menu" />
        </div>
      )}
    </div>
  );
}