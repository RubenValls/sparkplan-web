"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Logo from "@/components/ui/Logo/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/config";
import styles from "./Header.module.scss";

export default function Header() {
  const { data: session, status } = useSession();
  const t = useTranslations("AUTH");
  const tHeader = useTranslations("HEADER");
  const isLoading = status === "loading";

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link href={ROUTES.HOME} className={styles.header__brand}>
          <Logo className={styles.header__logo} />
          <span className={styles.header__title}>SparkPlan</span>
        </Link>

        <nav className={styles.header__nav}>
          <div className={styles.header__controls}>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {!isLoading && (
            <div className={styles.header__actions}>
              {session ? (
                <>
                  <Link
                    href={ROUTES.PLANS}
                    className={styles.header__link}
                  >
                    {tHeader("PRICING")}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: ROUTES.HOME })}
                    className={`${styles.header__link} ${styles["header__link--primary"]}`}
                  >
                    {t("LOGOUT")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn("google", { callbackUrl: ROUTES.DASHBOARD })}
                  className={`${styles.header__link} ${styles["header__link--primary"]}`}
                >
                  {t("LOGIN")}
                </button>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}