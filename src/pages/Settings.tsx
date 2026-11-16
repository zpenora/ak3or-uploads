import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, Palette, Bell, Shield, Trash2, Info, Smartphone, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

export default function Settings() {
  const { theme, setTheme, resolved } = useTheme();
  const { push } = useToast();
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('ak3or-reduce-motion') === '1');
  const [compact, setCompact] = useState(() => localStorage.getItem('ak3or-compact') === '1');
  const [notify, setNotify] = useState(() => localStorage.getItem('ak3or-notify') === '1');

  useEffect(() => {
    document.title = 'Settings — Ak3or';
  }, []);

  useEffect(() => {
    localStorage.setItem('ak3or-reduce-motion', reduceMotion ? '1' : '0');
    document.documentElement.style.setProperty('scroll-behavior', reduceMotion ? 'auto' : 'smooth');
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem('ak3or-compact', compact ? '1' : '0');
  }, [compact]);

  useEffect(() => {
    localStorage.setItem('ak3or-notify', notify ? '1' : '0');
  }, [notify]);

  const clearCache = () => {
    const keep = ['ak3or-theme', 'ak3or-reduce-motion', 'ak3or-compact', 'ak3or-notify'];
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && !keep.includes(k)) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
    push('success', 'Local cache cleared');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 md:py-10 pb-28 md:pb-10">
      <h1 className="font-display font-bold text-3xl md:text-4xl">Settings</h1>
      <p className="text-[var(--color-text-muted)] mt-2">Personalize Ak3or to match your style.</p>

      {/* Appearance */}
      <Card title="Appearance" icon={<Palette size={16} />}>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Theme</div>
          <div className="grid grid-cols-3 gap-2">
            <ThemeOption mode="light" current={theme} onClick={setTheme} icon={<Sun size={16} />} label="Light" />
            <ThemeOption mode="dark" current={theme} onClick={setTheme} icon={<Moon size={16} />} label="Dark" />
            <ThemeOption mode="system" current={theme} onClick={setTheme} icon={<Monitor size={16} />} label="System" />
          </div>
          <p className="text-xs text-[var(--color-text-dim)] mt-2">
            Currently applied: <span className="text-[var(--color-text)]">{resolved}</span>
          </p>
        </div>
        <Toggle label="Reduce motion" description="Minimize non-essential animations." checked={reduceMotion} onChange={setReduceMotion} />
        <Toggle label="Compact app cards" description="Tighter grid layout with smaller app previews." checked={compact} onChange={setCompact} />
      </Card>

      {/* Notifications */}
      <Card title="Notifications" icon={<Bell size={16} />}>
        <Toggle label="Show in-app toasts" description="Download confirmations and update banners." checked={notify} onChange={setNotify} />
      </Card>

      {/* Mobile */}
      <Card title="Mobile experience" icon={<Smartphone size={16} />}>
        <div className="text-sm text-[var(--color-text-muted)] space-y-2">
          <p>Ak3or is designed mobile-first with:</p>
          <ul className="grid gap-1.5 text-[var(--color-text)]">
            <li className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Bottom navigation bar on mobile</li>
            <li className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 44px minimum touch targets</li>
            <li className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-400" /> iOS safe-area insets honored</li>
            <li className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Offline-friendly browsing after first load</li>
          </ul>
        </div>
      </Card>

      {/* Privacy */}
      <Card title="Privacy" icon={<Shield size={16} />}>
        <div className="text-sm text-[var(--color-text-muted)]">
          Ak3or never requires an account. We only persist your theme preference and anonymized view counts.
        </div>
        <button
          onClick={clearCache}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm hover:bg-rose-500/15"
        >
          <Trash2 size={14} /> Clear local cache
        </button>
      </Card>

      {/* About */}
      <Card title="About" icon={<Info size={16} />}>
        <div className="text-sm text-[var(--color-text-muted)] space-y-1">
          <div><span className="text-[var(--color-text)]">Ak3or</span> · Premium mobile app marketplace</div>
          <div>Build 1.2.0 · 2026</div>
        </div>
      </Card>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5 md:p-6 mt-5">
      <h2 className="font-display font-semibold text-base flex items-center gap-2">
        <span className="h-7 w-7 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] text-[var(--color-primary-glow)] grid place-items-center">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function ThemeOption({ mode, current, onClick, icon, label }: { mode: ThemeMode; current: ThemeMode; onClick: (m: ThemeMode) => void; icon: React.ReactNode; label: string }) {
  const active = current === mode;
  return (
    <button
      onClick={() => onClick(mode)}
      className={`relative rounded-xl p-3 border text-sm font-medium flex flex-col items-center gap-1.5 min-h-[72px] transition-colors ${
        active
          ? 'bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] border-[var(--color-primary)]/40 text-[var(--color-text)]'
          : 'bg-[var(--input-bg)] border-[var(--glass-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
      }`}
    >
      {icon}
      {label}
      {active && <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-[var(--color-primary)] grid place-items-center"><Check size={10} className="text-white" /></span>}
    </button>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--hover-bg-strong)]'}`}
        aria-pressed={checked}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
