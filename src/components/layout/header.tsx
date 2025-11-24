"use client";

import Link from "next/link";
import Logo from "@/components/ui/logo";
import styles from "./header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Link href="/" className={styles.header__brand}>
          <Logo className={styles.header__logo} />
          <span className={styles.header__title}>SparkPlan</span>
        </Link>

        <nav className={styles.header__nav}>
          <Link href="/dashboard" className={styles.header__navItem}>
            Dashboard
          </Link>
          <Link href="/login" className={styles.header__navItem}>
            Acceder
          </Link>
        </nav>
      </div>
    </header>
  );
}
