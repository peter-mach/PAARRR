type IconProps = { size?: number; className?: string };

export const GithubIcon = ({ size = 20, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.69-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.22 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export const SearchIcon = ({ size = 20, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const ArrowIcon = ({ size = 20, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const CheckIcon = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const SparkIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2z" />
  </svg>
);

export const CompassIcon = ({ size = 28, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    <path
      d="M16 4v3M16 25v3M4 16h3M25 16h3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M16 8 19 16 16 24 13 16Z" fill="currentColor" />
    <circle cx="16" cy="16" r="1.5" fill="white" />
  </svg>
);

export const AnchorIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <circle cx="12" cy="5" r="2.5" />
    <path d="M12 7.5v14" />
    <path d="M5 12h14" />
    <path d="M5 16a7 7 0 0 0 14 0" />
  </svg>
);

export const MapIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" />
    <path d="M9 4v14" />
    <path d="M15 6v14" />
  </svg>
);

export const BoltIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>
);

export const ShieldIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M12 2 4 5v6c0 5 3.4 9.5 8 11 4.6-1.5 8-6 8-11V5z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const RobotIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <rect x="4" y="7" width="16" height="13" rx="3" />
    <path d="M12 3v4" />
    <circle cx="9" cy="13" r="1.2" fill="currentColor" />
    <circle cx="15" cy="13" r="1.2" fill="currentColor" />
    <path d="M9 17h6" />
    <path d="M2 13v3M22 13v3" />
  </svg>
);

export const TrendIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M3 17 9 11l4 4 8-8" />
    <path d="M14 4h7v7" />
  </svg>
);

export const FilterIcon = ({ size = 18, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M3 5h18l-7 9v6l-4-2v-4z" />
  </svg>
);

export const SortIcon = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M7 4v16M3 8l4-4 4 4" />
    <path d="M17 20V4M21 16l-4 4-4-4" />
  </svg>
);

export const StarIcon = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l6.9-1z" />
  </svg>
);

export const SkullIcon = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M12 2C7 2 4 5.5 4 10v3l2 2v3h3v-2h2v2h2v-2h2v2h3v-3l2-2v-3c0-4.5-3-8-8-8z" />
    <circle cx="9" cy="11" r="1.5" fill="currentColor" />
    <circle cx="15" cy="11" r="1.5" fill="currentColor" />
    <path d="m11 14 1 2 1-2" />
  </svg>
);

export const WheelIcon = ({ size = 28, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    className={className}
    aria-hidden
  >
    <circle cx="16" cy="16" r="6" />
    <circle cx="16" cy="16" r="2" fill="currentColor" />
    <path d="M16 2v8M16 22v8M2 16h8M22 16h8" />
    <path d="M6 6l5.5 5.5M20.5 20.5L26 26M6 26l5.5-5.5M20.5 11.5L26 6" />
  </svg>
);

export const TelescopeIcon = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="m3 12 5-8 4 2-3 8z" />
    <path d="m9 14 6-2 3 5-7 2z" />
    <path d="M11 21h6" />
    <path d="M14 17v4" />
  </svg>
);
