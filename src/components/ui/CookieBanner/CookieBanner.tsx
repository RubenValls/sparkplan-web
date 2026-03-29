"use client";

import CookieConsent from "react-cookie-consent";
import { useTranslations } from "next-intl";
import styles from "./CookieBanner.module.scss";

export default function CookieBanner() {
  const t = useTranslations("COOKIE_BANNER");

  return (
    <CookieConsent
      location="bottom"
      cookieName="sparkplan_cookie_consent"
      expires={365}
      containerClasses={styles.banner}
      contentClasses={styles.banner__content}
      buttonClasses={styles.banner__button}
      buttonWrapperClasses={styles.banner__actions}
      disableStyles
    >
      <p className={styles.banner__text}>
        {t("MESSAGE")}{" "}
        <a href="/cookies" className={styles.banner__link}>
          {t("LEARN_MORE")}
        </a>
      </p>
    </CookieConsent>
  );
}
