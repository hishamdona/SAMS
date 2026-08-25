import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = 'success', duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast = { id, message, type, duration };

    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 visible

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, duration) => addToast({ message: msg, type: 'success', duration }),
    error: (msg, duration) => addToast({ message: msg, type: 'error', duration }),
    warning: (msg, duration) => addToast({ message: msg, type: 'warning', duration }),
    info: (msg, duration) => addToast({ message: msg, type: 'info', duration })
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Portal / Container */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
                isSuccess
                  ? 'bg-slate-900/95 text-white border-emerald-500/40'
                  : isError
                  ? 'bg-rose-950/95 text-rose-50 border-rose-600/50'
                  : isWarning
                  ? 'bg-amber-950/95 text-amber-50 border-amber-600/50'
                  : 'bg-slate-900/95 text-white border-slate-700'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 size={18} className="text-emerald-400" />}
                {isError && <AlertOctagon size={18} className="text-rose-400" />}
                {isWarning && <AlertTriangle size={18} className="text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info size={18} className="text-sky-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-snug">{t.message}</p>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-slate-400 hover:text-white transition p-0.5 rounded cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback to console if used outside provider
    return {
      success: (msg) => console.log('Toast (success):', msg),
      error: (msg) => console.error('Toast (error):', msg),
      warning: (msg) => console.warn('Toast (warning):', msg),
      info: (msg) => console.info('Toast (info):', msg)
    };
  }
  return context;
}
