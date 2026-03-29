"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Cookie, Shield, Settings, Globe } from "lucide-react";
import styles from "./page.module.scss";

export default function CookiesPage() {
  const t = useTranslations("COOKIES_PAGE");

  const ownCookies = [
    {
      name: t("COOKIE_SESSION_NAME"),
      purpose: t("COOKIE_SESSION_PURPOSE"),
      duration: t("COOKIE_SESSION_DURATION"),
      type: t("COOKIE_SESSION_TYPE"),
    },
    {
      name: t("COOKIE_CONSENT_NAME"),
      purpose: t("COOKIE_CONSENT_PURPOSE"),
      duration: t("COOKIE_CONSENT_DURATION"),
      type: t("COOKIE_CONSENT_TYPE"),
    },
    {
      name: t("COOKIE_LANG_NAME"),
      purpose: t("COOKIE_LANG_PURPOSE"),
      duration: t("COOKIE_LANG_DURATION"),
      type: t("COOKIE_LANG_TYPE"),
    },
    {
      name: t("COOKIE_THEME_NAME"),
      purpose: t("COOKIE_THEME_PURPOSE"),
      duration: t("COOKIE_THEME_DURATION"),
      type: t("COOKIE_THEME_TYPE"),
    },
  ];

  const thirdPartyCookies = [
    {
      name: t("THIRD_PARTY_GOOGLE_NAME"),
      description: t("THIRD_PARTY_GOOGLE_DESC"),
    },
    {
      name: t("THIRD_PARTY_STRIPE_NAME"),
      description: t("THIRD_PARTY_STRIPE_DESC"),
    },
  ];

  const browsers = [
    { name: t("BROWSER_CHROME"), url: "https://support.google.com/chrome/answer/95647" },
    { name: t("BROWSER_FIREFOX"), url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" },
    { name: t("BROWSER_SAFARI"), url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
    { name: t("BROWSER_EDGE"), url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.page__container}>

        <Link href="/" className={styles.page__back}>
          <ArrowLeft size={16} />
          {t("BACK_HOME")}
        </Link>

        <header className={styles.page__header}>
          <div className={styles.page__icon}>
            <Cookie size={26} />
          </div>
          <h1 className={styles.page__title}>{t("TITLE")}</h1>
          <p className={styles.page__updated}>{t("LAST_UPDATED")}</p>
          <p className={styles.page__intro}>{t("INTRO")}</p>
        </header>

        <section className={styles.section}>
          <div className={styles.section__header}>
            <div className={styles.section__icon}><Shield size={18} /></div>
            <h2 className={styles.section__title}>{t("WHAT_ARE_COOKIES_TITLE")}</h2>
          </div>
          <p className={styles.section__text}>{t("WHAT_ARE_COOKIES_TEXT")}</p>
        </section>

        <section className={styles.section}>
          <div className={styles.section__header}>
            <div className={styles.section__icon}><Cookie size={18} /></div>
            <h2 className={styles.section__title}>{t("COOKIES_WE_USE_TITLE")}</h2>
          </div>
          <p className={styles.section__text}>{t("COOKIES_WE_USE_INTRO")}</p>
          <div className={styles.table__wrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("TABLE_NAME")}</th>
                  <th>{t("TABLE_PURPOSE")}</th>
                  <th>{t("TABLE_DURATION")}</th>
                  <th>{t("TABLE_TYPE")}</th>
                </tr>
              </thead>
              <tbody>
                {ownCookies.map((cookie) => (
                  <tr key={cookie.name}>
                    <td><code className={styles.code}>{cookie.name}</code></td>
                    <td>{cookie.purpose}</td>
                    <td>{cookie.duration}</td>
                    <td><span className={styles.badge}>{cookie.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.section__header}>
            <div className={styles.section__icon}><Globe size={18} /></div>
            <h2 className={styles.section__title}>{t("THIRD_PARTY_TITLE")}</h2>
          </div>
          <p className={styles.section__text}>{t("THIRD_PARTY_INTRO")}</p>
          <div className={styles.cards}>
            {thirdPartyCookies.map((item) => (
              <div key={item.name} className={styles.card}>
                <h3 className={styles.card__title}>{item.name}</h3>
                <p className={styles.card__text}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.section__header}>
            <div className={styles.section__icon}><Settings size={18} /></div>
            <h2 className={styles.section__title}>{t("MANAGE_TITLE")}</h2>
          </div>
          <p className={styles.section__text}>{t("MANAGE_TEXT")}</p>
          <p className={styles.section__subtitle}>{t("MANAGE_BROWSERS")}</p>
          <ul className={styles.list}>
            {browsers.map((browser) => (
              <li key={browser.name} className={styles.list__item}>
                <a href={browser.url} target="_blank" rel="noopener noreferrer" className={styles.list__link}>
                  {browser.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.section__title}>{t("CONTACT_TITLE")}</h2>
          <p className={styles.section__text}>{t("CONTACT_TEXT")}</p>
          <a href="mailto:r.vallsaparici@gmail.com" className={styles.contact__email}>
            r.vallsaparici@gmail.com
          </a>
        </section>

      </div>
    </main>
  );
}
