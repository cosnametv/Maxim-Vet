import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ toast, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const palette: Record<ToastType, { box: string; icon: string }> = {
    success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: 'text-emerald-600' },
    error: { box: 'border-rose-200 bg-rose-50 text-rose-900', icon: 'text-rose-600' },
    info: { box: 'border-slate-200 bg-white text-slate-800', icon: 'text-emerald-600' },
  };
  const Icon = toast.type === 'error' ? AlertCircle : toast.type === 'info' ? Info : CheckCircle2;
  const { box, icon } = palette[toast.type];

  return createPortal(
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-sm print:hidden">
      <div
        role="alert"
        className={`toast-in flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-slate-900/10 backdrop-blur ${box}`}
      >
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${icon}`} />
        <p className="text-xs font-semibold leading-relaxed flex-1">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="text-slate-400 hover:text-slate-600 transition cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}
