import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Star, Eye, EyeOff, Flame } from 'lucide-react';
import supabase from '../../lib/supabase';
import type { AppRecord } from '../../lib/types';
import { formatCount, timeAgo } from '../../lib/format';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';
import PlatformBadge from '../../components/PlatformBadge';

export default function AdminApps() {
  const [apps, setApps] = useState<AppRecord[] | null>(null);
  const [q, setQ] = useState('');
  const [platform, setPlatform] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [del, setDel] = useState<AppRecord | null>(null);
  const { push } = useToast();

  useEffect(() => { document.title = 'Applications — Admin'; load(); }, []);

  async function load() {
    setApps(null);
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const r = await fetch('/api/apps?includeDrafts=true&limit=200', { headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) setApps(await r.json());
    else setApps([]);
  }

  const filtered = useMemo(() => {
    if (!apps) return null;
    return apps.filter((a) => {
      if (platform && a.platform !== platform) return false;
      if (status && a.status !== status) return false;
      if (q) {
        const t = q.toLowerCase();
        if (!a.name.toLowerCase().includes(t) && !a.developer.toLowerCase().includes(t)) return false;
      }
      return true;
    });
  }, [apps, q, platform, status]);

  async function remove(a: AppRecord) {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const r = await fetch('/api/apps', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: a.id }),
    });
    if (r.ok) { push('success', `Deleted ${a.name}`); load(); }
    else push('error', 'Delete failed');
    setDel(null);
  }

  async function toggleField(a: AppRecord, field: 'featured' | 'trending' | 'status') {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const body: Record<string, unknown> = { id: a.id };
    if (field === 'status') body.status = a.status === 'published' ? 'draft' : 'published';
    else body[field] = !a[field];
    const r = await fetch('/api/apps', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      push('success', 'Updated');
      load();
    } else push('error', 'Update failed');
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Applications</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage every app in your catalogue.</p>
        </div>
        <Link to="/admin/apps/new" className="btn-primary rounded-xl px-4 py-2.5 inline-flex items-center gap-2 text-white text-sm font-semibold">
          <Plus size={16} /> New application
        </Link>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or developer…"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]/50"
          />
        </div>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="px-3 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm">
          <option value="">All platforms</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
          <option value="cross">Cross-platform</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm">
          <option value="">Any status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--color-text-muted)] text-xs uppercase tracking-wider border-b border-[var(--glass-border)]">
              <tr>
                <th className="p-4">App</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Downloads</th>
                <th className="p-4">Updated</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered === null && (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--glass-border)]">
                    <td className="p-4" colSpan={7}><div className="h-8 skeleton rounded" /></td>
                  </tr>
                ))
              )}
              {filtered && filtered.length === 0 && (
                <tr><td colSpan={7} className="p-10 text-center text-[var(--color-text-muted)]">No apps match your filters.</td></tr>
              )}
              {filtered && filtered.map((a) => (
                <tr key={a.id} className="border-b border-[var(--glass-border)] hover:bg-[var(--hover-bg)]">
                  <td className="p-3">
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <div className="h-10 w-10 rounded-xl overflow-hidden ring-1 ring-white/10 bg-[var(--input-bg)] shrink-0">
                        {a.logo_url && <img src={a.logo_url} className="h-full w-full object-cover" alt="" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate flex items-center gap-1.5">
                          {a.name}
                          {a.featured && <Star size={12} className="text-amber-400" />}
                          {a.trending && <Flame size={12} className="text-rose-400" />}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] truncate">{a.developer} · {a.category_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><PlatformBadge platform={a.platform} /></td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--input-bg)] border border-[var(--glass-border)] uppercase tracking-wider">
                      {a.download_type === 'play' ? 'Play Store' : a.download_type === 'appstore' ? 'App Store' : 'APK'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleField(a, 'status')}
                      className={`text-xs px-2 py-1 rounded-full border inline-flex items-center gap-1 ${
                        a.status === 'published' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {a.status === 'published' ? <Eye size={11} /> : <EyeOff size={11} />}
                      {a.status === 'published' ? 'Live' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-3 text-[var(--color-text-muted)]">{formatCount(a.downloads_count)}</td>
                  <td className="p-3 text-[var(--color-text-muted)]">{timeAgo(a.updated_at)}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleField(a, 'featured')}
                        title="Toggle featured"
                        className={`h-8 w-8 grid place-items-center rounded-lg hover:bg-[var(--hover-bg-strong)] ${a.featured ? 'text-amber-300' : 'text-[var(--color-text-dim)]'}`}
                      >
                        <Star size={14} />
                      </button>
                      <button
                        onClick={() => toggleField(a, 'trending')}
                        title="Toggle trending"
                        className={`h-8 w-8 grid place-items-center rounded-lg hover:bg-[var(--hover-bg-strong)] ${a.trending ? 'text-rose-300' : 'text-[var(--color-text-dim)]'}`}
                      >
                        <Flame size={14} />
                      </button>
                      <Link to={`/admin/apps/${a.id}`} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-[var(--hover-bg-strong)] text-[var(--color-primary-glow)]">
                        <Edit3 size={14} />
                      </Link>
                      <button onClick={() => setDel(a)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-rose-500/10 text-rose-300">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!del}
        title={`Delete ${del?.name}?`}
        message="This permanently removes the application and its files from the catalogue."
        confirmLabel="Delete"
        danger
        onCancel={() => setDel(null)}
        onConfirm={() => del && remove(del)}
      />
    </div>
  );
}
