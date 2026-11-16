import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiGet } from '../lib/api';
import type { AppRecord, Category } from '../lib/types';
import AppCard from '../components/AppCard';
import AppCardSkeleton from '../components/AppCardSkeleton';
import EmptyState from '../components/EmptyState';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const platform = params.get('platform') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'recent';
  const featured = params.get('featured') === '1';
  const trending = params.get('trending') === '1';
  const [qLocal, setQLocal] = useState(q);
  const [apps, setApps] = useState<AppRecord[] | null>(null);
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => { apiGet<Category[]>('/api/categories').then(setCats).catch(() => {}); }, []);
  useEffect(() => { setQLocal(q); }, [q]);

  useEffect(() => {
    document.title = q ? `"${q}" — Ak3or` : 'Search — Ak3or';
    setApps(null);
    const u = new URLSearchParams();
    if (q) u.set('search', q);
    if (platform) u.set('platform', platform);
    if (category) u.set('category', category);
    if (featured) u.set('featured', 'true');
    if (trending) u.set('trending', 'true');
    u.set('sort', sort);
    u.set('limit', '60');
    apiGet<AppRecord[]>(`/api/apps?${u.toString()}`).then(setApps).catch(() => setApps([]));
  }, [q, platform, category, sort, featured, trending]);

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const k in patch) {
      if (patch[k]) next.set(k, patch[k]);
      else next.delete(k);
    }
    setParams(next);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    update({ q: qLocal });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-10 pb-24 md:pb-10">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Search apps</h1>
      <form onSubmit={onSearch} className="mt-4 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
        <input
          value={qLocal}
          onChange={(e) => setQLocal(e.target.value)}
          placeholder="Search by name, developer, or description…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--glass-border)] focus:border-[var(--color-primary)]/60 focus:outline-none text-sm md:text-base"
        />
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip active={!platform} onClick={() => update({ platform: '' })}>All platforms</Chip>
        <Chip active={platform === 'android'} onClick={() => update({ platform: 'android' })}>Android</Chip>
        <Chip active={platform === 'ios'} onClick={() => update({ platform: 'ios' })}>iOS</Chip>
        <select
          value={category}
          onChange={(e) => update({ category: e.target.value })}
          className="px-3 py-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
        >
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="px-3 py-1.5 rounded-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
        >
          <option value="recent">Recent</option>
          <option value="popular">Popular</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="mt-8">
        {apps === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <AppCardSkeleton key={i} />)}
          </div>
        ) : apps.length === 0 ? (
          <EmptyState title="No results found" description="Try a different search term or clear your filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {apps.map((a) => <AppCard key={a.id} app={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
        active
          ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/40 text-white'
          : 'bg-[var(--input-bg)] border-[var(--glass-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
      }`}
    >
      {children}
    </button>
  );
}
