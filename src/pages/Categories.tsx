import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../lib/api';
import type { Category } from '../lib/types';
import { Gamepad2, Users, PlayCircle, Music2, Briefcase, GraduationCap, Camera, Wrench, MessageCircle, Heart, Sparkles } from 'lucide-react';

const CAT_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  games: Gamepad2, 'social-media': Users, entertainment: PlayCircle, 'music-audio': Music2,
  productivity: Briefcase, education: GraduationCap, photography: Camera, 'tools-utilities': Wrench,
  communication: MessageCircle, lifestyle: Heart,
};

export default function Categories() {
  const [cats, setCats] = useState<Category[] | null>(null);
  useEffect(() => {
    document.title = 'Categories — Ak3or';
    apiGet<Category[]>('/api/categories').then(setCats).catch(() => setCats([]));
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 pb-24 md:pb-10">
      <h1 className="font-display font-bold text-3xl md:text-4xl">All categories</h1>
      <p className="text-[var(--color-text-muted)] mt-2">Browse applications by category.</p>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(cats || Array.from({ length: 10 })).map((c, i) => {
          if (!c) return <div key={i} className="h-32 skeleton rounded-2xl" />;
          const Icon = CAT_ICONS[c.slug] || Sparkles;
          return (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className="group relative overflow-hidden rounded-2xl glass p-5 app-card-hover"
            >
              <div
                className="absolute inset-0 opacity-30 group-hover:opacity-70 transition-opacity"
                style={{ background: `radial-gradient(60% 60% at 0% 0%, ${c.color}55, transparent)` }}
              />
              <div
                className="relative h-12 w-12 rounded-2xl grid place-items-center text-white"
                style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}80)` }}
              >
                <Icon size={22} />
              </div>
              <h3 className="relative font-display font-semibold text-lg mt-4">{c.name}</h3>
              {c.description && (
                <p className="relative text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">{c.description}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
