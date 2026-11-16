import { ReactNode } from 'react';
import { PackageSearch } from 'lucide-react';

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6 glass rounded-2xl">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center mb-4">
        {icon || <PackageSearch className="text-[var(--color-primary-glow)]" size={24} />}
      </div>
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
