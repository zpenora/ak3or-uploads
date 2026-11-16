import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Smartphone, Apple, Download, Plus, ArrowRight, Star, FileEdit, BarChart3, Flame } from 'lucide-react';
import supabase from '../../lib/supabase';
import type { AppRecord } from '../../lib/types';
import { formatCount, timeAgo } from '../../lib/format';

interface Stats {
  total: number;
  android: number;
  ios: number;
  downloads: number;
  apkDownloads: number;
  drafts: number;
  featured: number;
  recent: AppRecord[];
  categoryBreakdown: { name: string; count: number }[];
  topDownloads: AppRecord[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    document.title = 'Dashboard — Ak3or Admin';
    (async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const r = await fetch('/api/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) setStats(await r.json());
    })();
  }, []);

  const maxCat = Math.max(1, ...(stats?.categoryBreakdown.map((c) => c.count) || [1]));
  const maxDl = Math.max(1, ...(stats?.topDownloads.map((a) => a.downloads_count) || [1]));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Overview of your catalogue and activity.</p>
        </div>
        <Link to="/admin/apps/new" className="btn-primary rounded-xl px-4 py-2.5 inline-flex items-center gap-2 text-white text-sm font-semibold">
          <Plus size={16} /> Add application
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total apps" value={stats?.total} icon={<Package />} color="from-violet-500/30 to-violet-500/0" sub={stats && `${stats.drafts} draft${stats.drafts === 1 ? '' : 's'}`} />
        <Stat label="Android apps" value={stats?.android} icon={<Smartphone />} color="from-emerald-500/30 to-emerald-500/0" />
        <Stat label="iOS apps" value={stats?.ios} icon={<Apple />} color="from-sky-500/30 to-sky-500/0" />
        <Stat label="APK downloads" value={stats?.apkDownloads} icon={<Download />} color="from-amber-500/30 to-amber-500/0" sub={stats && `${formatCount(stats.downloads)} total`} />
      </div>

      {/* Analytics grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <BarChart3 size={18} className="text-[var(--color-primary-glow)]" />
              Apps by category
            </h2>
            <span className="text-xs text-[var(--color-text-muted)]">{stats?.categoryBreakdown.length || 0} categories</span>
          </div>
          {stats === null ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-7 skeleton rounded" />)}
            </div>
          ) : stats.categoryBreakdown.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No data yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.categoryBreakdown.map((c) => (
                <li key={c.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="truncate">{c.name}</span>
                    <span className="text-[var(--color-text-muted)] text-xs tabular-nums">{c.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--input-bg)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                      style={{ width: `${(c.count / maxCat) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Top downloads */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <Flame size={18} className="text-rose-400" />
              Top downloads
            </h2>
            <Link to="/admin/apps" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">All apps →</Link>
          </div>
          {stats === null ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 skeleton rounded" />)}
            </div>
          ) : stats.topDownloads.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No downloads tracked yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topDownloads.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl overflow-hidden ring-1 ring-white/10 bg-[var(--input-bg)] shrink-0">
                    {a.logo_url && <img src={a.logo_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link to={`/admin/apps/${a.id}`} className="text-sm font-medium truncate hover:text-[var(--color-primary-glow)]">{a.name}</Link>
                      <span className="text-xs text-[var(--color-text-muted)] tabular-nums shrink-0">{formatCount(a.downloads_count)}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-[var(--input-bg)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400"
                        style={{ width: `${((a.downloads_count || 0) / maxDl) * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick glance strip */}
      <div className="grid sm:grid-cols-3 gap-3">
        <MiniStat icon={<Star size={14} className="text-amber-300" />} label="Featured on homepage" value={stats?.featured} />
        <MiniStat icon={<FileEdit size={14} className="text-sky-300" />} label="Drafts in review" value={stats?.drafts} />
        <MiniStat icon={<Download size={14} className="text-emerald-300" />} label="Total downloads" value={stats?.downloads} />
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Recently uploaded</h2>
          <Link to="/admin/apps" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] inline-flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {stats === null ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}
          </div>
        ) : stats.recent.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No applications yet. Add your first one.</p>
        ) : (
          <ul className="divide-y divide-[var(--divider)]">
            {stats.recent.map((a) => (
              <li key={a.id} className="py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl overflow-hidden ring-1 ring-white/10 bg-[var(--input-bg)] shrink-0">
                  {a.logo_url && <img src={a.logo_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{a.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {a.category_name || 'App'} · {a.platform} · {timeAgo(a.created_at)}
                  </div>
                </div>
                <div className="text-xs text-[var(--color-text-muted)] inline-flex items-center gap-1">
                  <Download size={12} /> {formatCount(a.downloads_count)}
                </div>
                <Link to={`/admin/apps/${a.id}`} className="text-xs text-[var(--color-primary-glow)] hover:underline">Edit</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, icon, color, sub }: { label: string; value?: number; icon: React.ReactNode; color: string; sub?: string | false | null }) {
  return (
    <div className="relative overflow-hidden rounded-2xl glass p-5">
      <div className={`absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${color} blur-2xl`} />
      <div className="relative flex items-center justify-between">
        <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">{label}</div>
        <div className="text-[var(--color-primary-glow)]">{icon}</div>
      </div>
      <div className="relative font-display font-bold text-3xl mt-2">
        {value === undefined ? <span className="inline-block h-8 w-16 skeleton rounded" /> : formatCount(value)}
      </div>
      {sub && <div className="relative text-xs text-[var(--color-text-dim)] mt-1">{sub}</div>}
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value?: number }) {
  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-[var(--input-bg)] grid place-items-center">{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</div>
        <div className="font-display font-semibold text-base">
          {value === undefined ? <span className="inline-block h-5 w-10 skeleton rounded" /> : formatCount(value)}
        </div>
      </div>
    </div>
  );
}
