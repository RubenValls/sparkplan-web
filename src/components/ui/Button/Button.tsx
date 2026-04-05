"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "ghost" | "ghost-inverse" | "hero" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  icon,
  iconRight,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    fullWidth ? styles["btn--full"] : "",
    isLoading ? styles["btn--loading"] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <Loader2 className={styles.btn__spinner} aria-hidden="true" />
      ) : (
        icon && <span className={styles.btn__icon}>{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && iconRight && (
        <span className={styles.btn__iconRight}>{iconRight}</span>
      )}
    </button>
  );
}
