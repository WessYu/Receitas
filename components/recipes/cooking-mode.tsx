"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, Pause, Play, Plus, TimerReset } from "lucide-react";

type CookingModeProps = {
  slug: string;
  title: string;
  servings: number;
  ingredients: Array<{ id: string; amount: string; name: string }>;
  steps: Array<{ id: string; order: number; content: string }>;
};

type WakeLockHandle = { release: () => Promise<void> };
type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockHandle> };
};

function parseQuantity(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (/^\d+\s+\d+\/\d+$/.test(normalized)) {
    const [whole, fraction] = normalized.split(/\s+/);
    const [numerator, denominator] = fraction.split("/").map(Number);
    return Number(whole) + numerator / denominator;
  }

  if (/^\d+\/\d+$/.test(normalized)) {
    const [numerator, denominator] = normalized.split("/").map(Number);
    return numerator / denominator;
  }

  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

function formatQuantity(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: value < 1 ? 2 : 1
  }).format(value);
}

function scaleAmount(amount: string, baseServings: number, portionCount: number) {
  if (baseServings <= 0 || portionCount === baseServings) return amount;

  const match = amount.trim().match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[,.]\d+)?)(.*)$/);
  if (!match) return amount;

  const parsed = parseQuantity(match[1]);
  if (parsed === null) return amount;

  return `${formatQuantity(parsed * (portionCount / baseServings))}${match[2]}`;
}

export function CookingMode({ slug, title, servings, ingredients, steps }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [portionCount, setPortionCount] = useState(Math.max(1, servings));
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [keepAwake, setKeepAwake] = useState(false);
  const wakeLockRef = useRef<WakeLockHandle | null>(null);

  const totalSteps = Math.max(steps.length, 1);
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;
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
    if (!keepAwake) {
      wakeLockRef.current?.release().catch(() => undefined);
      wakeLockRef.current = null;
      return;
    }

    const nav = navigator as WakeLockNavigator;
    let cancelled = false;

    nav.wakeLock
      ?.request("screen")
      .then((result) => {
        if (cancelled) {
          result.release().catch(() => undefined);
          return;
        }
        wakeLockRef.current = result;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      wakeLockRef.current?.release().catch(() => undefined);
      wakeLockRef.current = null;
    };
  }, [keepAwake]);

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setSeconds(0);
    setRunning(false);
  };

  return (
    <main className="min-h-screen bg-[#09090B] text-[#F5F5F3]">
      <header className="border-b border-white/10">
        <div className="container-page flex min-h-16 items-center justify-between gap-4">
          <Link href={`/recipes/${slug}`} className="inline-flex items-center gap-2 text-sm text-[#B8B8BE] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar à receita
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Modo cozinha</span>
        </div>
      </header>

      <div className="container-page grid gap-10 py-8 lg:grid-cols-[0.7fr_1.3fr] lg:py-12">
        <aside>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Preparação</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">{title}</h1>

          <div className="mt-6 flex items-center justify-between rounded-[14px] border border-white/10 bg-[#141417] p-4">
            <span className="text-sm text-[#A8A8AE]">Porções</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Diminuir porções"
                onClick={() => setPortionCount((count) => Math.max(1, count - 1))}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-[#B8B8BE] hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <strong className="min-w-6 text-center">{portionCount}</strong>
              <button
                type="button"
                aria-label="Aumentar porções"
                onClick={() => setPortionCount((count) => count + 1)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-[#B8B8BE] hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-pressed={keepAwake}
            onClick={() => setKeepAwake((value) => !value)}
            className={`mt-3 flex w-full items-center justify-between rounded-[14px] border px-4 py-3 text-sm transition ${
              keepAwake ? "border-[#7BAE7F] bg-[#7BAE7F]/10 text-white" : "border-white/10 bg-[#141417] text-[#A8A8AE] hover:text-white"
            }`}
          >
            <span>Manter tela ligada</span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">{keepAwake ? "Ativo" : "Opcional"}</span>
          </button>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-[#F5F5F3]">Confira os ingredientes</h2>
            <div className="mt-3 space-y-2">
              {ingredients.map((ingredient) => {
                const checked = checkedIngredients.includes(ingredient.id);
                const amount = scaleAmount(ingredient.amount, servings, portionCount);

                return (
                  <button key={ingredient.id} type="button" onClick={() => toggleIngredient(ingredient.id)} className="flex w-full items-center gap-3 rounded-[12px] border border-white/10 bg-[#141417] px-4 py-3 text-left">
                    <span className={`grid h-5 w-5 place-items-center rounded border ${checked ? "border-[#7BAE7F] bg-[#7BAE7F] text-[#09090B]" : "border-white/20"}`}>
                      {checked ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span className={checked ? "text-[#77777E] line-through" : "text-[#C8C8CC]"}>
                      <strong className="mr-2 text-[#96C59A]">{amount}</strong>
                      {ingredient.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="flex min-h-[520px] flex-col justify-between rounded-[20px] border border-white/10 bg-[#141417] p-6 sm:p-10">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">
                Passo {currentStep + 1} de {steps.length}
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 sm:w-48">
                <div className="h-full rounded-full bg-[#7BAE7F] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 px-4 py-2 font-mono text-sm text-[#F5F5F3]">{time}</span>
              <button type="button" onClick={() => setRunning((value) => !value)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-[#C8C8CC] hover:text-white">
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "Pausar timer" : "Iniciar timer"}
              </button>
              <button type="button" onClick={() => setSeconds(0)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-[#C8C8CC] hover:text-white">
                <TimerReset className="h-4 w-4" />
                Zerar
              </button>
            </div>

            <p className="mt-10 max-w-3xl font-serif text-3xl leading-[1.25] text-[#F5F5F3] sm:text-5xl">{steps[currentStep]?.content}</p>
          </div>

          <div className="mt-12 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" disabled={currentStep === 0} onClick={() => goToStep(Math.max(0, currentStep - 1))} className="button-secondary disabled:cursor-not-allowed disabled:opacity-40">
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </button>

            {isLastStep ? (
              <Link href={`/recipes/${slug}`} className="button-primary">
                <Check className="h-4 w-4" />
                Finalizar preparo
              </Link>
            ) : (
              <button type="button" onClick={() => goToStep(currentStep + 1)} className="button-primary">
                Próximo passo
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
