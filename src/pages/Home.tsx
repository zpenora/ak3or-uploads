import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Sparkles, Flame, Clock, TrendingUp, ChevronRight, Smartphone, Apple,
  Gamepad2, Users, PlayCircle, Music2, Briefcase, GraduationCap, Camera, Wrench,
  MessageCircle, Heart, Star, Download, Shield, Zap, ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiGet } from '../lib/api';
import type { AppRecord, Category } from '../lib/types';
import AppCard from '../components/AppCard';
import AppCardSkeleton from '../components/AppCardSkeleton';
import { formatCount } from '../lib/format';

const CAT_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  games: Gamepad2, 'social-media': Users, entertainment: PlayCircle, 'music-audio': Music2,
  productivity: Briefcase, education: GraduationCap, photography: Camera, 'tools-utilities': Wrench,
  communication: MessageCircle, lifestyle: Heart,
};

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [featured, setFeatured] = useState<AppRecord[] | null>(null);
  const [trending, setTrending] = useState<AppRecord[] | null>(null);
  const [recent, setRecent] = useState<AppRecord[] | null>(null);
  const [popular, setPopular] = useState<AppRecord[] | null>(null);
  const [android, setAndroid] = useState<AppRecord[] | null>(null);
  const [ios, setIos] = useState<AppRecord[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    apiGet<AppRecord[]>('/api/apps?featured=true&limit=8').then(setFeatured).catch(() => setFeatured([]));
    apiGet<AppRecord[]>('/api/apps?trending=true&limit=8').then(setTrending).catch(() => setTrending([]));
    apiGet<AppRecord[]>('/api/apps?sort=recent&limit=8').then(setRecent).catch(() => setRecent([]));
    apiGet<AppRecord[]>('/api/apps?sort=popular&limit=8').then(setPopular).catch(() => setPopular([]));
    apiGet<AppRecord[]>('/api/apps?platform=android&limit=6').then(setAndroid).catch(() => setAndroid([]));
    apiGet<AppRecord[]>('/api/apps?platform=ios&limit=6').then(setIos).catch(() => setIos([]));
    apiGet<Category[]>('/api/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const heroApp = featured?.[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-60 pointer-events-none" />
        {/* Aurora blobs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--color-primary)]/25 blur-3xl aurora-blob" />
        <div className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)]/25 blur-3xl aurora-blob-slow" />
        <div className="pointer-events-none absolute top-60 left-1/2 h-[380px] w-[380px] rounded-full bg-cyan-400/15 blur-3xl aurora-blob" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-14 md:pt-20 pb-16 md:pb-24 relative grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-[var(--color-text-muted)] mb-5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Fresh drops weekly · Hand-picked by editors
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-[2.6rem] md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02]"
            >
              Discover apps that{' '}
              <span className="relative inline-block">
                <span className="text-gradient">feel like magic</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6 Q 50 1, 100 4 T 198 3" stroke="url(#underline)" strokeWidth="2.5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="underline" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#a78bfa" />
                      <stop offset="0.5" stopColor="#60a5fa" />
                      <stop offset="1" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              .
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[var(--color-text-muted)] text-base md:text-lg mt-6 max-w-xl leading-relaxed"
            >
              A curated marketplace of Android, iOS and cross-platform apps.
              Browse, explore, and install — no account required.
            </motion.p>
            <motion.form
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onSubmit={onSearch}
              className="mt-7 flex items-center glass-strong rounded-2xl p-1.5 max-w-xl shadow-2xl shadow-[var(--color-primary)]/15"
            >
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Try 'puzzle games', 'fitness', 'photo editor'…"
                  className="w-full pl-11 pr-3 py-3 bg-transparent focus:outline-none text-sm md:text-base placeholder:text-[var(--color-text-dim)] text-[var(--color-text)]"
                />
              </div>
              <button type="submit" className="btn-primary rounded-xl px-5 py-3 text-white text-sm font-semibold">
                Search
              </button>
            </motion.form>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-5 flex flex-wrap gap-2 text-xs"
            >
              {['Productivity', 'Games', 'Photo editors', 'Fitness', 'AI tools'].map((t) => (
                <button
                  key={t}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                  className="px-3 py-1.5 rounded-full glass hover:border-[var(--color-primary)]/40 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {t}
                </button>
              ))}
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-10 grid grid-cols-3 gap-4 max-w-xl"
            >
              <TrustStat icon={<Download size={14} />} value="5M+" label="Downloads" />
              <TrustStat icon={<Star size={14} className="fill-amber-400 text-amber-400" />} value="4.8" label="Avg rating" />
              <TrustStat icon={<Shield size={14} className="text-emerald-400" />} value="100%" label="Verified apps" />
            </motion.div>
          </div>

          {/* Hero visual — phone mockup featuring an app */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 60 }}
            className="hidden lg:flex lg:col-span-5 justify-center items-center relative"
          >
            <div className="relative tilt animate-float">
              {/* Floating badges around phone */}
              <FloatingBadge className="-top-2 -left-8" delay={0}>
                <Zap size={14} className="text-amber-300" />
                <span>Fast installs</span>
              </FloatingBadge>
              <FloatingBadge className="top-1/3 -right-10" delay={0.4}>
                <Shield size={14} className="text-emerald-300" />
                <span>Verified</span>
              </FloatingBadge>
              <FloatingBadge className="-bottom-2 -left-4" delay={0.8}>
                <Star size={14} className="text-amber-300 fill-amber-300" />
                <span>Editor's pick</span>
              </FloatingBadge>

              <div className="phone-frame w-[280px] h-[560px] p-3 relative noise">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 h-6 w-28 bg-black rounded-full z-20" />
                {/* Screen */}
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#121634] via-[#0d1024] to-[#070912]">
                  <div className="absolute inset-0 hero-grid opacity-40" />
                  <div className="relative p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between text-[10px] text-white/70 pt-5">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-4 bg-white/60 rounded-sm" />
                        <div className="h-1.5 w-1 bg-white/60 rounded-sm" />
                      </div>
                    </div>
                    <div className="mt-4 text-white text-sm font-display font-bold">Top apps</div>
                    <div className="mt-3 space-y-2">
                      {(featured || []).slice(0, 4).map((a, i) => (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.06] border border-white/[0.08]"
                        >
                          <div className="h-9 w-9 rounded-lg overflow-hidden bg-white/10 shrink-0">
                            {a.logo_url && <img src={a.logo_url} alt="" className="h-full w-full object-cover" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-semibold text-white truncate">{a.name}</div>
                            <div className="text-[9px] text-white/50 truncate">{a.category_name}</div>
                          </div>
                          <div className="h-6 px-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 grid place-items-center text-[9px] font-bold text-white">
                            GET
                          </div>
                        </motion.div>
                      ))}
                      {(!featured || featured.length === 0) && Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-12 skeleton rounded-xl" />
                      ))}
                    </div>
                    {heroApp && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-auto rounded-xl p-3 bg-gradient-to-br from-violet-500/30 to-blue-500/20 border border-white/10"
                      >
                        <div className="text-[9px] uppercase tracking-wider text-white/60">Trending</div>
                        <div className="text-[13px] font-display font-bold text-white mt-1 truncate">{heroApp.name}</div>
                        <div className="text-[10px] text-white/60 mt-0.5 line-clamp-2">{heroApp.tagline}</div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              {/* Shadow puddle */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-10 w-52 bg-black/50 blur-2xl rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Marquee logos strip */}
        {featured && featured.length > 0 && (
          <div className="relative border-y border-[var(--glass-border)] bg-[color-mix(in_srgb,black_15%,transparent)] overflow-hidden mt-4">
            <div className="flex marquee-track gap-10 py-4 w-max">
              {[...featured, ...featured, ...featured].map((a, i) => (
                <div key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                  <div className="h-7 w-7 rounded-lg overflow-hidden bg-white/10 shrink-0">
                    {a.logo_url && <img src={a.logo_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <span className="text-sm text-[var(--color-text-muted)] font-medium">{a.name}</span>
                  <span className="text-[var(--color-text-dim)]">·</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16 md:space-y-24 mt-12 md:mt-20">
        {/* Featured spotlight — large card + grid */}
        <section>
          <SectionHeader title="Featured spotlight" icon={<Sparkles size={18} className="text-amber-300" />} link="/search?featured=1" eyebrow="Editor picks" />
          <FeaturedShowcase apps={featured} />
        </section>

        {/* Categories strip */}
        <section>
          <SectionHeader title="Explore categories" eyebrow="Browse" link="/categories" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {(categories || Array.from({ length: 10 })).slice(0, 10).map((c, i) => {
              if (!c) return <div key={i} className="h-28 skeleton rounded-2xl" />;
              const cat = c as Category;
              const Icon = CAT_ICONS[cat.slug] || Sparkles;
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl p-4 glass app-card-hover shine"
                >
                  <div
                    className="absolute inset-0 opacity-30 group-hover:opacity-80 transition-opacity"
                    style={{ background: `radial-gradient(80% 80% at 0% 0%, ${cat.color}66, transparent 70%)` }}
                  />
                  <div
                    className="relative h-11 w-11 rounded-2xl grid place-items-center text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}aa)`, boxShadow: `0 10px 25px -10px ${cat.color}99` }}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="relative font-display font-semibold text-sm mt-3">{cat.name}</p>
                  <ChevronRight size={14} className="absolute bottom-3 right-3 text-[var(--color-text-dim)] group-hover:text-[var(--color-text)] group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Trending ranked */}
        <Section title="Trending now" icon={<Flame size={18} className="text-rose-400" />} link="/search?trending=1" eyebrow="This week">
          <RankedGrid apps={trending} />
        </Section>

        {/* Recent */}
        <Section title="Recently added" icon={<Clock size={18} className="text-sky-300" />} link="/search?sort=recent" eyebrow="Just dropped">
          <AppGrid apps={recent} />
        </Section>

        {/* Popular */}
        <Section title="Popular downloads" icon={<TrendingUp size={18} className="text-emerald-300" />} link="/search?sort=popular" eyebrow="Charts">
          <AppGrid apps={popular} />
        </Section>

        {/* Android & iOS */}
        <section className="grid md:grid-cols-2 gap-6">
          <PlatformBlock title="Android spotlight" icon={<Smartphone className="text-emerald-400" size={18} />} apps={android} link="/platform/android" accent="from-emerald-500/30 to-emerald-400/5" dot="bg-emerald-500" />
          <PlatformBlock title="iOS spotlight" icon={<Apple className="text-sky-300" size={18} />} apps={ios} link="/platform/ios" accent="from-sky-500/30 to-sky-400/5" dot="bg-sky-500" />
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-14 shimmer-border">
          <div className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-[var(--color-primary)]/30 blur-3xl aurora-blob" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[var(--color-accent)]/30 blur-3xl aurora-blob-slow" />
          <div className="relative text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-[var(--color-text-muted)] mb-5">
              <Zap size={12} className="text-amber-300" /> Submit your app
            </div>
            <h3 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              Build something people <span className="text-gradient">actually install</span>.
            </h3>
            <p className="text-[var(--color-text-muted)] mt-4 text-base md:text-lg">
              Developers — submit your Android or iOS app to Ak3or and reach a global audience of discerning users.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <Link to="/contact" className="btn-primary rounded-xl px-5 py-3 inline-flex items-center gap-2 text-white font-semibold text-sm">
                Submit your app <ArrowRight size={14} />
              </Link>
              <Link to="/categories" className="rounded-xl px-5 py-3 inline-flex items-center gap-2 glass border border-[var(--glass-border)] hover:border-[var(--color-primary)]/40 text-sm font-semibold">
                Browse categories
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon, link, eyebrow }: { title: string; icon?: React.ReactNode; link?: string; eyebrow?: string }) {
  return (
    <div className="flex items-end justify-between mb-5 gap-4">
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-dim)] font-semibold mb-1.5">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display font-bold text-xl md:text-3xl flex items-center gap-2 tracking-tight">
          {icon}
          {title}
        </h2>
      </div>
      {link && (
        <Link to={link} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] inline-flex items-center gap-0.5 shrink-0 glass rounded-full px-3 py-1.5 border border-[var(--glass-border)] hover:border-[var(--color-primary)]/40 transition-colors">
          View all <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

function Section({ title, icon, link, eyebrow, children }: { title: string; icon?: React.ReactNode; link?: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section>
      <SectionHeader title={title} icon={icon} link={link} eyebrow={eyebrow} />
      {children}
    </section>
  );
}

function AppGrid({ apps }: { apps: AppRecord[] | null }) {
  if (apps === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <AppCardSkeleton key={i} />)}
      </div>
    );
  }
  if (apps.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">No apps yet.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {apps.slice(0, 4).map((a) => <AppCard key={a.id} app={a} />)}
    </div>
  );
}

function RankedGrid({ apps }: { apps: AppRecord[] | null }) {
  if (apps === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <AppCardSkeleton key={i} />)}
      </div>
    );
  }
  if (apps.length === 0) return <p className="text-sm text-[var(--color-text-muted)]">No apps yet.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {apps.slice(0, 4).map((a, i) => <AppCard key={a.id} app={a} rank={i + 1} />)}
    </div>
  );
}

function PlatformBlock({ title, icon, apps, link, accent, dot }: { title: string; icon: React.ReactNode; apps: AppRecord[] | null; link: string; accent: string; dot: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong p-6 shimmer-border noise">
      <div className={`absolute -top-20 -right-10 h-72 w-72 bg-gradient-to-br ${accent} blur-3xl rounded-full opacity-80 pointer-events-none aurora-blob`} />
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className={`absolute inset-0 rounded-full ${dot} blur opacity-60`} />
            <div className="relative h-10 w-10 rounded-xl glass grid place-items-center">{icon}</div>
          </div>
          <h3 className="font-display font-bold text-lg">{title}</h3>
        </div>
        <Link to={link} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] inline-flex items-center gap-0.5">
          See more <ChevronRight size={12} />
        </Link>
      </div>
      <div className="relative space-y-2.5">
        {apps === null ? (
          Array.from({ length: 3 }).map((_, i) => <AppCardSkeleton key={i} />)
        ) : apps.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No apps yet.</p>
        ) : (
          apps.slice(0, 3).map((a) => <AppCard key={a.id} app={a} compact />)
        )}
      </div>
    </div>
  );
}

function FeaturedShowcase({ apps }: { apps: AppRecord[] | null }) {
  if (apps === null) {
    return (
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-80 skeleton rounded-3xl" />
        <div className="space-y-3">
          <AppCardSkeleton />
          <AppCardSkeleton />
          <AppCardSkeleton />
        </div>
      </div>
    );
  }
  if (apps.length === 0) {
    return (
      <div className="h-40 glass rounded-3xl grid place-items-center text-sm text-[var(--color-text-muted)]">
        No featured apps yet.
      </div>
    );
  }
  const main = apps[0];
  const side = apps.slice(1, 4);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Link
        to={`/app/${main.slug}`}
        className="group lg:col-span-2 relative overflow-hidden rounded-3xl glass-strong p-8 md:p-10 app-card-hover shimmer-border min-h-[320px] flex flex-col justify-end noise"
      >
        {/* Backdrop */}
        {main.screenshots?.[0] && (
          <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
            <img src={main.screenshots[0]} alt="" className="h-full w-full object-cover scale-110 blur-2xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[var(--color-primary)]/40 blur-3xl aurora-blob" />

        <div className="relative flex items-end gap-5 flex-wrap">
          <div className="relative shrink-0">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[var(--color-primary)]/50 to-[var(--color-accent)]/30 blur-xl" />
            <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-3xl overflow-hidden ring-2 ring-white/20 shadow-2xl">
              {main.logo_url && <img src={main.logo_url} alt={main.name} className="h-full w-full object-cover" />}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                ★ Editor's choice
              </span>
              {main.category_name && (
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/20">
                  {main.category_name}
                </span>
              )}
            </div>
            <h3 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
              {main.name}
            </h3>
            <p className="text-white/70 mt-1 text-sm md:text-base max-w-lg line-clamp-2">{main.tagline}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Star size={14} className="fill-amber-400 text-amber-400" /> {main.rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Download size={14} /> {formatCount(main.downloads_count)}
              </span>
              <span className="text-white/60">· {main.developer}</span>
            </div>
          </div>
          <div className="btn-primary rounded-xl px-5 py-3 text-white font-semibold text-sm inline-flex items-center gap-2 shrink-0">
            View details <ArrowRight size={14} />
          </div>
        </div>
      </Link>

      <div className="space-y-3">
        {side.map((a, i) => <AppCard key={a.id} app={a} compact rank={i + 2} />)}
        {side.length === 0 && (
          <div className="glass rounded-2xl p-6 text-sm text-[var(--color-text-muted)] text-center">
            More featured apps coming soon.
          </div>
        )}
      </div>
    </div>
  );
}

function TrustStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-lg bg-[var(--input-bg)] grid place-items-center">{icon}</div>
      <div>
        <div className="font-display font-bold text-base leading-tight">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</div>
      </div>
    </div>
  );
}

function FloatingBadge({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + delay, type: 'spring' }}
      className={`absolute z-30 glass-strong rounded-full px-3 py-1.5 text-[11px] font-semibold text-[var(--color-text)] flex items-center gap-1.5 shadow-2xl animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}
