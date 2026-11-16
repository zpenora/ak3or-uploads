import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Sun, Moon, Smartphone, Apple, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import TikTokIcon from './TikTokIcon';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { toggle, resolved } = useTheme();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'text-[var(--color-text)] bg-[var(--hover-bg)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
    }`;

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1 ml-2">
            <NavLink to="/" end className={linkCls}>Discover</NavLink>
            <NavLink to="/platform/android" className={linkCls}>Android</NavLink>
            <NavLink to="/platform/ios" className={linkCls}>iOS</NavLink>
            <NavLink to="/categories" className={linkCls}>Categories</NavLink>
          </nav>

          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md ml-auto">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search apps, games, developers…"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] focus:border-[var(--color-primary)]/60 focus:outline-none text-sm placeholder:text-[var(--color-text-dim)] text-[var(--color-text)]"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <a
              href="https://www.tiktok.com/@ak3or"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg bg-gradient-to-r from-fuchsia-500/15 via-rose-500/15 to-cyan-400/15 border border-[var(--glass-border)] hover:border-fuchsia-400/50 text-xs font-semibold text-[var(--color-text)] transition-colors"
              aria-label="Follow Ak3or on TikTok"
              title="Follow us on TikTok @ak3or"
            >
              <TikTokIcon size={14} />
              <span>@ak3or</span>
            </a>
            <a
              href="https://www.tiktok.com/@ak3or"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              aria-label="Follow Ak3or on TikTok"
            >
              <TikTokIcon size={18} />
            </a>
            <NavLink
              to="/settings"
              className="h-10 w-10 grid place-items-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              aria-label="Settings"
            >
              <SettingsIcon size={18} />
            </NavLink>
            <button
              onClick={toggle}
              className="h-10 w-10 grid place-items-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              aria-label="Toggle theme"
            >
              {resolved === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--color-text)]"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[82%] max-w-sm glass-strong border-l border-[var(--glass-border)] p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <Logo size={32} />
              <button onClick={() => setOpen(false)} className="h-10 w-10 grid place-items-center rounded-lg hover:bg-[var(--hover-bg)]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onSearch} className="mt-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search apps…"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] focus:border-[var(--color-primary)]/60 text-sm text-[var(--color-text)]"
                />
              </div>
            </form>
            <nav className="mt-5 space-y-1">
              <NavLink to="/" end onClick={() => setOpen(false)} className={linkCls}>Discover</NavLink>
              <NavLink to="/platform/android" onClick={() => setOpen(false)} className={linkCls}>
                <span className="inline-flex items-center gap-2"><Smartphone size={16} /> Android</span>
              </NavLink>
              <NavLink to="/platform/ios" onClick={() => setOpen(false)} className={linkCls}>
                <span className="inline-flex items-center gap-2"><Apple size={16} /> iOS</span>
              </NavLink>
              <NavLink to="/categories" onClick={() => setOpen(false)} className={linkCls}>Categories</NavLink>
              <NavLink to="/settings" onClick={() => setOpen(false)} className={linkCls}>
                <span className="inline-flex items-center gap-2"><SettingsIcon size={16} /> Settings</span>
              </NavLink>
              <div className="my-2 border-t border-[var(--glass-border)]" />
              <NavLink to="/privacy" onClick={() => setOpen(false)} className={linkCls}>Privacy</NavLink>
              <NavLink to="/terms" onClick={() => setOpen(false)} className={linkCls}>Terms</NavLink>
              <NavLink to="/contact" onClick={() => setOpen(false)} className={linkCls}>Contact</NavLink>
              <a
                href="https://www.tiktok.com/@ak3or"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-500/15 via-rose-500/15 to-cyan-400/15 border border-[var(--glass-border)] text-sm font-semibold text-[var(--color-text)]"
              >
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-fuchsia-500 via-rose-500 to-cyan-400 grid place-items-center text-white">
                  <TikTokIcon size={12} />
                </span>
                Follow on TikTok · @ak3or
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
