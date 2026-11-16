import { Smartphone, Apple } from 'lucide-react';
import type { Platform } from '../lib/types';

export default function PlatformBadge({ platform, size = 'sm' }: { platform: Platform; size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 14 : 11;
  const base =
    'inline-flex items-center gap-1 rounded-full font-medium border ' +
    (size === 'md' ? 'text-xs px-2.5 py-1' : 'text-[10px] px-2 py-0.5');
  if (platform === 'android') {
    return (
      <span className={base + ' bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}>
        <Smartphone size={sz} /> Android
      </span>
    );
  }
  if (platform === 'ios') {
    return (
      <span className={base + ' bg-sky-500/10 text-sky-300 border-sky-500/20'}>
        <Apple size={sz} /> iOS
      </span>
    );
  }
  return (
    <span className={base + ' bg-violet-500/10 text-violet-300 border-violet-500/20'}>
      <Smartphone size={sz} /> Cross-platform
    </span>
  );
}
