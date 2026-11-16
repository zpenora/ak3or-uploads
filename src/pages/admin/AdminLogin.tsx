import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

export default function AdminLogin() {
  const nav = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('admin@ak3or.app');
  const [pw, setPw] = useState('Ak3or#2026');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Admin — Ak3or';
    if (user) checkAdmin();
  }, [user]);

  async function checkAdmin() {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const r = await fetch('/api/admin-check', { headers: { Authorization: `Bearer ${token}` } });
      const j = await r.json();
      if (j.isAdmin) nav('/admin', { replace: true });
    } catch { /* ignore */ }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const r = await signIn(email, pw);
    if (r.error) { setErr(r.error); setBusy(false); return; }
    // verify admin
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const check = await fetch('/api/admin-check', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const j = await check.json();
    setBusy(false);
    if (!j.isAdmin) {
      setErr('This account is not an administrator.');
      return;
    }
    nav('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/30 via-transparent to-[var(--color-accent)]/30" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] grid place-items-center text-white">
            <Shield size={24} />
          </div>
          <h2 className="font-display font-bold text-4xl mt-6 leading-tight">Ak3or<br/>Control Center</h2>
          <p className="text-[var(--color-text-muted)] mt-3 max-w-md">Private administrative access. Manage applications, publishing, and analytics for the Ak3or marketplace.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-bold text-2xl">Admin sign in</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Authorized personnel only.</p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <Field icon={<Mail size={16} />} label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] focus:border-[var(--color-primary)]/50 focus:outline-none text-sm text-[var(--color-text)]"
              />
            </Field>
            <Field icon={<Lock size={16} />} label="Password">
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] focus:border-[var(--color-primary)]/50 focus:outline-none text-sm text-[var(--color-text)]"
              />
            </Field>
            {err && <p className="text-sm text-rose-400">{err}</p>}
            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full rounded-xl py-3 text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              Sign in
            </button>
          </form>
          <p className="text-xs text-[var(--color-text-dim)] mt-6">
            Demo credentials pre-filled for review. In production, change immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]">{icon}</span>
        {children}
      </div>
    </label>
  );
}
