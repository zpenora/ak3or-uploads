import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-[var(--color-primary-glow)]" size={28} />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
