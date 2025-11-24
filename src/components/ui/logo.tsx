interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="48" stroke="#1E90FF" strokeWidth="6" />
      <path
        d="M30 55 L50 25 L70 55"
        stroke="#1E90FF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
