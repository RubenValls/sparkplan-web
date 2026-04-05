"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Logo from "@/components/ui/Logo/Logo";
import SettingsMenu from "@/components/ui/SettingsMenu/SettingsMenu";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/config";
import styles from "./Header.module.scss";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const t = useTranslations("AUTH");
  const tHeader = useTranslations("HEADER");
  const isLoading = status === "loading";

  const isOnPlansPage = pathname === ROUTES.PLANS;

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link href={ROUTES.HOME} className={styles.header__brand}>
          <Logo className={styles.header__logo} />
          <span className={styles.header__title}>SparkPlan</span>
        </Link>

        <nav className={styles.header__nav}>

          {isLoading ? (
            <div className={styles.header__skeleton}>
              <div className={`${styles["header__skeleton-item"]} ${styles["header__skeleton-item--icon"]}`} />
              <div className={`${styles["header__skeleton-item"]} ${styles["header__skeleton-item--btn"]}`} />
            </div>
          ) : (
            <div className={styles.header__actions}>
              {session ? (
                <>
                  <Link
                    href={isOnPlansPage ? ROUTES.DASHBOARD : ROUTES.PLANS}
                    className={styles.header__link}
                  >
                    {isOnPlansPage ? tHeader("DASHBOARD") : tHeader("PRICING")}
                  </Link>
                  <SettingsMenu />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: ROUTES.HOME })}
                  >
                    {t("LOGOUT")}
                  </Button>
                </>
              ) : (
                <>
                  <SettingsMenu />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => signIn("google", { callbackUrl: ROUTES.DASHBOARD })}
                  >
                    {t("LOGIN")}
                  </Button>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}