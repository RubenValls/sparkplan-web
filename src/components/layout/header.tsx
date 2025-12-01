"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import styles from "./Header.module.scss";

export default function Header() {
  const session = false; //@TODO(): Implement session logic

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link href="/" className={styles.header__brand}>
          <Logo className={styles.header__logo} />
          <span className={styles.header__title}>SparkPlan</span>
        </Link>

        <nav className={styles.header__nav}>
          <div className={styles.header__controls}>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {}
          {
            <div className={styles.header__actions}>
              {session ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={styles.header__link}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className={`${styles.header__link} ${styles['header__link--primary']}`}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <Link
                  href="/api/auth/signin"
                  className={`${styles.header__link} ${styles['header__link--primary']}`}
                >
                  Sign In
                </Link>
              )}
            </div>
          }
        </nav>
      </div>
    </header>
  );
}