import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Smartphone, Apple } from 'lucide-react';
import { apiGet } from '../lib/api';
import type { AppRecord } from '../lib/types';
import AppCard from '../components/AppCard';
import AppCardSkeleton from '../components/AppCardSkeleton';
import EmptyState from '../components/EmptyState';

export default function PlatformPage() {
  const { platform } = useParams<{ platform: 'android' | 'ios' }>();
  const [apps, setApps] = useState<AppRecord[] | null>(null);
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    if (!platform) return;
    document.title = `${platform === 'android' ? 'Android' : 'iOS'} apps — Ak3or`;
    setApps(null);
    apiGet<AppRecord[]>(`/api/apps?platform=${platform}&sort=${sort}&limit=100`).then(setApps).catch(() => setApps([]));
  }, [platform, sort]);

  const isAndroid = platform === 'android';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12 pb-24 md:pb-10">
      <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10 mb-8">
        <div className={`absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl ${isAndroid ? 'bg-emerald-500/30' : 'bg-sky-500/30'}`} />
        <div className="relative flex items-center gap-4">
          <div className={`h-14 w-14 rounded-2xl grid place-items-center text-white ${isAndroid ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-sky-500 to-sky-700'}`}>
            {isAndroid ? <Smartphone size={26} /> : <Apple size={26} />}
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl">{isAndroid ? 'Android apps' : 'iOS apps'}</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Curated applications for {isAndroid ? 'Android devices' : 'iPhone and iPad'}.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">All apps</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]/50"
        >
          <option value="recent">Recently updated</option>
          <option value="popular">Most downloaded</option>
          <option value="rating">Highest rated</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {apps === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <AppCardSkeleton key={i} />)}
        </div>
      ) : apps.length === 0 ? (
        <EmptyState title="No apps yet" description="Admin can add apps from the dashboard." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {apps.map((a) => <AppCard key={a.id} app={a} />)}
        </div>
      )}
    </div>
  );
}
