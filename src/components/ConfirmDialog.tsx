import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] grid place-items-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass-strong rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-start gap-3">
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${
                  danger ? 'bg-rose-500/15 text-rose-400' : 'bg-violet-500/15 text-violet-300'
                }`}
              >
                <AlertTriangle size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-semibold text-base">{title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{message}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--input-bg)] hover:bg-[var(--hover-bg-strong)] border border-[var(--glass-border)]"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  danger
                    ? 'bg-rose-500 hover:bg-rose-400 border-rose-400 text-white'
                    : 'btn-primary text-white border-transparent'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
