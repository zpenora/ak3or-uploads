import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Star, Calendar, Package, Code, ShieldAlert, ChevronLeft, ChevronRight, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGet, apiSend } from '../lib/api';
import type { AppRecord } from '../lib/types';
import PlatformBadge from '../components/PlatformBadge';
import AppCard from '../components/AppCard';
import { PlayBadge, AppStoreBadge } from '../components/StoreBadge';
import { formatBytes, formatCount, formatDate } from '../lib/format';

export default function AppDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [app, setApp] = useState<AppRecord | null>(null);
  const [related, setRelated] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setErr(null);
    apiGet<AppRecord>(`/api/apps?slug=${encodeURIComponent(slug)}`)
      .then((a) => {
        setApp(a);
        document.title = `${a.name} — Ak3or`;
        if (a.category_slug) {
          apiGet<AppRecord[]>(`/api/apps?category=${a.category_slug}&limit=10`).then((list) =>
            setRelated(list.filter((x) => x.id !== a.id).slice(0, 4))
          );
        }
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null || !app) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? null : (i + 1) % app.screenshots.length));
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? null : (i - 1 + app.screenshots.length) % app.screenshots.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, app]);

  const trackDownload = () => {
    if (app) apiSend('/api/download', 'POST', { id: app.id }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-6 pb-24 md:pb-10">
        <div className="h-7 w-32 skeleton rounded" />
        <div className="flex gap-5">
          <div className="h-24 w-24 skeleton rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 skeleton rounded" />
            <div className="h-4 w-32 skeleton rounded" />
            <div className="h-10 w-40 skeleton rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (err || !app) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 text-center">
        <h1 className="font-display font-bold text-2xl">App not found</h1>
        <p className="text-[var(--color-text-muted)] mt-2">{err || 'The app you are looking for is unavailable.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 mt-6 text-[var(--color-primary-glow)] hover:underline">
          <ArrowLeft size={16} /> Back to discover
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-10 pb-28 md:pb-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-6">
        <ArrowLeft size={14} /> Back
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative glass-strong rounded-3xl p-5 md:p-8 overflow-hidden shimmer-border noise">
        {/* Hero backdrop from first screenshot */}
        {app.screenshots?.[0] && (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img src={app.screenshots[0]} alt="" className="h-full w-full object-cover scale-110 blur-2xl" />
          </div>
        )}
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-[var(--color-primary)]/40 to-[var(--color-accent)]/15 blur-3xl pointer-events-none aurora-blob" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[var(--color-accent-2)]/15 blur-3xl pointer-events-none aurora-blob-slow" />
        <div className="relative flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="shrink-0 relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[var(--color-primary)]/40 to-[var(--color-accent)]/20 blur-xl" />
            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-3xl overflow-hidden ring-2 ring-white/15 shadow-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)]">
              {app.logo_url ? (
                <img src={app.logo_url} alt={app.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center font-display font-bold text-4xl">{app.name.charAt(0)}</div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <PlatformBadge platform={app.platform} size="md" />
              {app.category_name && (
                <Link
                  to={`/category/${app.category_slug}`}
                  className="text-xs px-2.5 py-1 rounded-full bg-[var(--input-bg)] border border-[var(--glass-border)] hover:border-[var(--glass-border)]"
                >
                  {app.category_name}
                </Link>
              )}
              {app.featured && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-2xl md:text-4xl">{app.name}</h1>
            <p className="text-[var(--color-text-muted)] mt-1 md:text-lg">{app.tagline}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--color-text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Star size={14} className="text-amber-400" /> {app.rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Download size={14} /> {formatCount(app.downloads_count)} downloads
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Code size={14} /> {app.developer}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {app.download_type === 'play' && app.store_url && <PlayBadge href={app.store_url} />}
              {app.download_type === 'appstore' && app.store_url && <AppStoreBadge href={app.store_url} />}
              {app.download_type === 'apk' && app.apk_url && (
                <a
                  href={app.apk_url}
                  onClick={trackDownload}
                  download
                  className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm"
                >
                  <Download size={18} />
                  Download APK
                  <span className="text-xs opacity-80 ml-1">{formatBytes(app.apk_size_bytes)} · v{app.version}</span>
                </a>
              )}
              {((app.download_type === 'play' && !app.store_url) ||
                (app.download_type === 'appstore' && !app.store_url) ||
                (app.download_type === 'apk' && !app.apk_url)) && (
                <div className="text-sm text-[var(--color-text-muted)]">Download currently unavailable.</div>
              )}
            </div>
            {app.download_type === 'apk' && (
              <div className="mt-4 flex items-start gap-2 text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong>Android only.</strong> This APK is provided directly. Enable installs from unknown sources on your device, and only install if you trust the source.
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Screenshots */}
      {app.screenshots.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-semibold text-lg mb-4">Screenshots</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2 snap-x snap-mandatory">
            {app.screenshots.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="shrink-0 snap-start rounded-2xl overflow-hidden ring-1 ring-white/10 w-[220px] md:w-[260px] aspect-[9/16] bg-[var(--color-surface)] hover:ring-[var(--color-primary)]/50 transition-colors"
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* About + Meta */}
      <section className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg mb-3">About this app</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line text-sm md:text-base">
            {app.description}
          </p>
        </div>
        <aside className="glass rounded-2xl p-6 h-fit">
          <h3 className="font-display font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Details</h3>
          <dl className="space-y-3 text-sm">
            <MetaRow icon={<Package size={14} />} label="Version" value={`v${app.version}`} />
            <MetaRow icon={<Package size={14} />} label="Size" value={app.size || formatBytes(app.apk_size_bytes)} />
            <MetaRow icon={<Calendar size={14} />} label="Last updated" value={formatDate(app.updated_at)} />
            <MetaRow icon={<Smartphone size={14} />} label="Platform" value={app.platform === 'cross' ? 'Android & iOS' : app.platform === 'android' ? 'Android' : 'iOS'} />
            <MetaRow icon={<Code size={14} />} label="Developer" value={app.developer} />
          </dl>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display font-semibold text-lg mb-4">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => <AppCard key={r.id} app={r} />)}
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-black/90 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? null : (i - 1 + app.screenshots.length) % app.screenshots.length)); }}
              className="absolute left-4 md:left-8 h-11 w-11 rounded-full glass grid place-items-center text-white hover:bg-[var(--hover-bg-strong)]"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? null : (i + 1) % app.screenshots.length)); }}
              className="absolute right-4 md:right-8 h-11 w-11 rounded-full glass grid place-items-center text-white hover:bg-[var(--hover-bg-strong)]"
            >
              <ChevronRight />
            </button>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 h-11 w-11 rounded-full glass grid place-items-center text-white hover:bg-[var(--hover-bg-strong)]"
            >
              <X />
            </button>
            <img
              src={app.screenshots[lightbox]}
              alt=""
              className="max-h-[85vh] max-w-full rounded-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-[var(--color-text-muted)] inline-flex items-center gap-1.5">
        {icon}
        {label}
      </dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
