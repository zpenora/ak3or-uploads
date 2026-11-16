import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, LogOut, Menu, X, Shield, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { LogoMark } from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) { nav('/admin/login'); return; }
        const r = await fetch('/api/admin-check', { headers: { Authorization: `Bearer ${token}` } });
        const j = await r.json();
        if (!j.isAdmin) { nav('/admin/login'); return; }
        setIsAdmin(true);
      } finally {
        setChecking(false);
      }
    })();
  }, [nav]);

  const logout = async () => {
    await signOut();
    nav('/admin/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-[var(--color-primary-glow)]" />
      </div>
    );
  }
  if (!isAdmin) return null;

  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive ? 'bg-[var(--hover-bg-strong)] text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--hover-bg)]'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 flex-col glass-strong border-r border-[var(--glass-border)] p-4">
        <SidebarContent link={link} onLogout={logout} />
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 glass-strong border-r border-[var(--glass-border)] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold">Admin</span>
              <button onClick={() => setOpen(false)} className="h-10 w-10 grid place-items-center rounded-lg hover:bg-[var(--hover-bg)]"><X size={18} /></button>
            </div>
            <SidebarContent link={link} onLogout={logout} onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden glass-strong border-b border-[var(--glass-border)] p-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="h-10 w-10 grid place-items-center rounded-lg hover:bg-[var(--hover-bg)]"><Menu size={18} /></button>
          <div className="flex items-center gap-2">
            <LogoMark size={26} glow={false} />
            <span className="font-display font-semibold text-sm">Admin</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ link, onLogout, onNav }: { link: (p: { isActive: boolean }) => string; onLogout: () => void; onNav?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2 px-2 py-2">
        <LogoMark size={36} />
        <div>
          <div className="font-display font-bold leading-tight">Ak3or</div>
          <div className="text-[10px] text-[var(--color-text-muted)] inline-flex items-center gap-1">
            <Shield size={10} /> Admin
          </div>
        </div>
      </div>
      <nav className="mt-4 space-y-1">
        <NavLink to="/admin" end className={link} onClick={onNav}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/admin/apps" className={link} onClick={onNav}>
          <Package size={16} /> Applications
        </NavLink>
        <NavLink to="/settings" className={link} onClick={onNav}>
          <SettingsIcon size={16} /> Site settings
        </NavLink>
      </nav>
      <div className="mt-auto pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </>
  );
}
