"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type Toast = {
  id: number;
  message: string;
};

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex w-[calc(100%-40px)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="flex items-center gap-3 rounded-md border border-border bg-elevated px-4 py-3 text-sm font-medium text-ink shadow-soft" role="status">
            <CheckCircle2 className="h-5 w-5 text-olive" />
            <span className="flex-1">{toast.message}</span>
            <button
              className="rounded p-1 text-muted transition hover:bg-surface hover:text-ink"
              onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
              aria-label="Fechar aviso"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast precisa estar dentro de ToastProvider.");
  return context;
}
