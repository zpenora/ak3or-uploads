import { Link } from 'react-router-dom';
import { Download, Star, ArrowUpRight } from 'lucide-react';
import type { AppRecord } from '../lib/types';
import { formatCount } from '../lib/format';
import PlatformBadge from './PlatformBadge';

export default function AppCard({
  app,
  compact = false,
  rank,
}: {
  app: AppRecord;
  compact?: boolean;
  rank?: number;
}) {
  return (
    <Link
      to={`/app/${app.slug}`}
      className="group relative block glass rounded-2xl p-4 app-card-hover shimmer-border shine overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-gradient-to-br from-[var(--color-primary)]/40 via-[var(--color-accent)]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {rank !== undefined && (
        <div className="absolute top-2.5 left-2.5 z-10 h-6 min-w-6 px-1.5 rounded-full rank-chip grid place-items-center text-[11px] font-bold text-white font-display">
          #{rank}
        </div>
      )}
      <div className="relative flex gap-3 items-start">
        <div className="shrink-0 relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/30 to-[var(--color-accent)]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative h-14 w-14 rounded-2xl overflow-hidden ring-1 ring-[var(--glass-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)]">
            {app.logo_url ? (
              <img src={app.logo_url} alt={app.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white font-display font-bold text-lg">
                {app.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-[var(--color-text)] truncate leading-tight">
              {app.name}
            </h3>
            <PlatformBadge platform={app.platform} />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
            {app.category_name || 'App'} · {app.developer}
          </p>
          {!compact && (
            <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2 leading-relaxed">
              {app.tagline}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2.5 text-xs text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" /> {app.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Download size={12} /> {formatCount(app.downloads_count)}
            </span>
            <span className="ml-auto inline-flex items-center gap-0.5 text-[var(--color-text-dim)] group-hover:text-[var(--color-primary-glow)] transition-colors">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
