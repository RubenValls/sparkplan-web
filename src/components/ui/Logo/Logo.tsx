interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="10" fill="#0B3D91" />
      <path 
        d="M32 10 L38 26 L52 30 L38 36 L32 52 L26 36 L12 30 L26 26 Z" 
        fill="#fff"
      />
    </svg>
  );
}