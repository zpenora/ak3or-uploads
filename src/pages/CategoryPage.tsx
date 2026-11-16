import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiGet } from '../lib/api';
import type { AppRecord, Category } from '../lib/types';
import AppCard from '../components/AppCard';
import AppCardSkeleton from '../components/AppCardSkeleton';
import EmptyState from '../components/EmptyState';

export default function CategoryPage() {
  const { slug } = useParams();
  const [apps, setApps] = useState<AppRecord[] | null>(null);
  const [cat, setCat] = useState<Category | null>(null);

  useEffect(() => {
    if (!slug) return;
    apiGet<Category[]>('/api/categories').then((cats) => {
      const c = cats.find((x) => x.slug === slug) || null;
      setCat(c);
      if (c) document.title = `${c.name} — Ak3or`;
    });
    apiGet<AppRecord[]>(`/api/apps?category=${slug}&limit=60`).then(setApps).catch(() => setApps([]));
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-10 pb-24 md:pb-10">
      <Link to="/categories" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-5">
        <ArrowLeft size={14} /> All categories
      </Link>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl">{cat?.name || 'Category'}</h1>
          {cat?.description && <p className="text-[var(--color-text-muted)] mt-2 max-w-xl">{cat.description}</p>}
        </div>
      </div>
      <div className="mt-8">
        {apps === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <AppCardSkeleton key={i} />)}
          </div>
        ) : apps.length === 0 ? (
          <EmptyState title="No apps in this category yet" description="Check back soon as new apps are added regularly." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {apps.map((a) => <AppCard key={a.id} app={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
