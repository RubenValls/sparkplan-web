"use client";

import { Coffee, HandCoins } from "lucide-react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import styles from "./DonationCard.module.scss";

interface DonationCardProps {
  email?: string;
}

export default function DonationCard({ 
  email = "r.vallsaparici@gmail.com" 
}: DonationCardProps) {
  const t = useTranslations("DONATION");

  return (
    <div className={styles.donationCard}>
      <div className={styles.donationCard__content}>
        <Coffee className={styles.donationCard__icon} />
        <div className={styles.donationCard__text}>
          <h3 className={styles.donationCard__title}>{t("TITLE")}</h3>
          <p className={styles.donationCard__description}>{t("DESCRIPTION")}</p>
        </div>
      </div>

      <form
        action="https://www.paypal.com/donate"
        method="post"
        target="_blank"
        className={styles.donationCard__form}
      >
        <input type="hidden" name="business" value={email} />
        <input type="hidden" name="no_recurring" value="0" />
        <input type="hidden" name="currency_code" value="EUR" />
        <input
          type="hidden"
          name="item_name"
          value="Support SparkPlan Development"
        />
        
        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<HandCoins size={18} />}
          aria-label={t("BUTTON")}
        >
          {t("BUTTON")}
        </Button>
      </form>
    </div>
  );
}