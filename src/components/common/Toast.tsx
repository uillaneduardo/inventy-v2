import React from 'react';
import { useInventy } from '../../context/InventyContext';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useInventy();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg shadow-lg border flex items-start gap-3 bg-white text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              isSuccess
                ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                : isError
                ? 'border-red-200 bg-red-50/40 text-red-950'
                : isWarning
                ? 'border-amber-200 bg-amber-50/40 text-amber-950'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isError && <ShieldAlert className="w-4 h-4 text-red-600" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-600" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight">{toast.title}</p>
              {toast.message && <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
