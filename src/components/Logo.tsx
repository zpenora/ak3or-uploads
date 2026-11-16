import { Link } from 'react-router-dom';

// Ak3or logo mark — shown with wordmark
export function LogoMark({ size = 36, glow = true }: { size?: number; glow?: boolean }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      className="shrink-0"
      aria-label="Ak3or"
      style={glow ? { filter: 'drop-shadow(0 6px 18px rgba(139,92,246,0.35))' } : undefined}
    >
      <defs>
        <linearGradient id="ak3-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="ak3-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.65" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#ak3-bg)" />
      {/* Stylized 'A' with notch + accent dot (the 'K' crossbar echo) */}
      <path
        d="M18 48 L32 14 L46 48 H40 L37.2 40 H26.8 L24 48 Z M28.9 34 H35.1 L32 25.5 Z"
        fill="url(#ak3-stroke)"
      />
      <circle cx="49" cy="18" r="3.2" fill="#ffffff" fillOpacity="0.95" />
    </svg>
  );
}

export default function Logo({ to = '/', size = 36 }: { to?: string; size?: number }) {
  return (
    <Link to={to} className="flex items-center gap-2 shrink-0">
      <LogoMark size={size} />
      <span className="font-display font-extrabold text-lg tracking-tight">
        <span className="text-gradient">Ak3or</span>
      </span>
    </Link>
  );
}
