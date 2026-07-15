"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, TimerReset, X } from "lucide-react";

type KitchenStep = {
  order: number;
  content: string;
};

type WakeLockSentinelLike = {
  release: () => Promise<void>;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: "screen") => Promise<WakeLockSentinelLike>;
  };
};

export function KitchenMode({ title, steps }: { title: string; steps: KitchenStep[] }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);

  const step = steps[current];
  const progress = useMemo(() => `${current + 1}/${steps.length}`, [current, steps.length]);
  const time = useMemo(() => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const rest = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${rest}`;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!open) {
      setRunning(false);
      wakeLockRef.current?.release().catch(() => undefined);
      wakeLockRef.current = null;
      return;
    }

    const nav = navigator as NavigatorWithWakeLock;
    nav.wakeLock
      ?.request("screen")
      .then((result) => {
        wakeLockRef.current = result;
      })
      .catch(() => undefined);

    return () => {
      wakeLockRef.current?.release().catch(() => undefined);
      wakeLockRef.current = null;
    };
  }, [open]);

  return (
    <>
      <button className="button-primary" type="button" onClick={() => setOpen(true)}>
        <Maximize2 className="h-4 w-4" />
        Começar a cozinhar
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-background text-ink" role="dialog" aria-modal="true">
          <div className="container-page flex min-h-screen flex-col py-6">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Modo cozinha</p>
                <h2 className="mt-2 max-w-3xl font-serif text-3xl leading-none md:text-5xl">{title}</h2>
              </div>
              <button className="button-secondary px-3 py-2" type="button" onClick={() => setOpen(false)} aria-label="Fechar modo cozinha">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid flex-1 place-items-center py-10">
              <div className="w-full max-w-5xl">
                <div className="mb-8 flex items-center justify-between text-sm text-muted">
                  <span>Passo {progress}</span>
                  <span>{time}</span>
                </div>
                <p className="font-serif text-5xl leading-[1.05] text-ink md:text-7xl">{step.content}</p>
              </div>
            </div>

            <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-[auto_1fr_auto_auto]">
              <button className="button-secondary" type="button" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))}>
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <button className="button-secondary" type="button" onClick={() => setRunning((value) => !value)}>
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "Pausar timer" : "Iniciar timer"}
              </button>
              <button className="button-secondary" type="button" onClick={() => setSeconds(0)}>
                <TimerReset className="h-4 w-4" />
                Zerar
              </button>
              <button
                className="button-primary"
                type="button"
                onClick={() => {
                  if (current < steps.length - 1) {
                    setCurrent((value) => value + 1);
                    setSeconds(0);
                  } else {
                    setOpen(false);
                  }
                }}
              >
                {current < steps.length - 1 ? "Próximo passo" : "Finalizar"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
