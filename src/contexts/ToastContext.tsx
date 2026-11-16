import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string };

const ToastContext = createContext<{
  push: (type: Toast['type'], message: string) => void;
}>({ push: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className="glass-strong rounded-xl px-4 py-3 flex items-start gap-3 shadow-2xl"
            >
              {t.type === 'success' && <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />}
              {t.type === 'error' && <AlertCircle className="text-rose-400 shrink-0 mt-0.5" size={18} />}
              {t.type === 'info' && <AlertCircle className="text-sky-400 shrink-0 mt-0.5" size={18} />}
              <p className="text-sm flex-1">{t.message}</p>
              <button
                onClick={() => setToasts((s) => s.filter((x) => x.id !== t.id))}
                className="text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
