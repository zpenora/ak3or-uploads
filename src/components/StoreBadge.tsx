import { Apple } from 'lucide-react';

export function PlayBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 rounded-xl px-4 py-2.5 bg-black border border-[var(--glass-border)] hover:border-white/30 transition-colors shadow-lg"
    >
      <svg viewBox="0 0 48 48" className="h-8 w-8 shrink-0">
        <defs>
          <linearGradient id="pb1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00c3ff"/>
            <stop offset="1" stopColor="#0068ff"/>
          </linearGradient>
          <linearGradient id="pb2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd500"/>
            <stop offset="1" stopColor="#ff9000"/>
          </linearGradient>
          <linearGradient id="pb3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff3838"/>
            <stop offset="1" stopColor="#ff0066"/>
          </linearGradient>
          <linearGradient id="pb4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00ff88"/>
            <stop offset="1" stopColor="#00b374"/>
          </linearGradient>
        </defs>
        <g transform="translate(10 8)">
          <path d="M0 0 L0 32 L14 16 Z" fill="url(#pb1)"/>
          <path d="M0 0 L14 16 L22 8 Z" fill="url(#pb4)"/>
          <path d="M0 32 L14 16 L22 24 Z" fill="url(#pb3)"/>
          <path d="M22 8 L28 16 L22 24 L14 16 Z" fill="url(#pb2)"/>
        </g>
      </svg>
      <span className="flex flex-col leading-tight text-white">
        <span className="text-[10px] uppercase tracking-wider opacity-80">Get it on</span>
        <span className="font-display font-semibold text-sm">Google Play</span>
      </span>
    </a>
  );
}

export function AppStoreBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 rounded-xl px-4 py-2.5 bg-black border border-[var(--glass-border)] hover:border-white/30 transition-colors shadow-lg"
    >
      <Apple className="h-7 w-7 text-white shrink-0" />
      <span className="flex flex-col leading-tight text-white">
        <span className="text-[10px] uppercase tracking-wider opacity-80">Download on the</span>
        <span className="font-display font-semibold text-sm">App Store</span>
      </span>
    </a>
  );
}
