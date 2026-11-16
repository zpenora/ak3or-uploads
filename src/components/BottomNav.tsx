import { NavLink } from 'react-router-dom';
import { Home, Smartphone, Apple, LayoutGrid, Settings as SettingsIcon } from 'lucide-react';

export default function BottomNav() {
  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[10px] font-medium transition-colors ${
      isActive ? 'text-[var(--color-primary-glow)]' : 'text-[var(--color-text-muted)]'
    }`;
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-[var(--glass-border)]">
      <div className="flex items-stretch px-1 pb-[max(env(safe-area-inset-bottom),0.25rem)]">
        <NavLink to="/" end className={cls}><Home size={20} />Home</NavLink>
        <NavLink to="/categories" className={cls}><LayoutGrid size={20} />Browse</NavLink>
        <NavLink to="/platform/android" className={cls}><Smartphone size={20} />Android</NavLink>
        <NavLink to="/platform/ios" className={cls}><Apple size={20} />iOS</NavLink>
        <NavLink to="/settings" className={cls}><SettingsIcon size={20} />Settings</NavLink>
      </div>
    </nav>
  );
}
