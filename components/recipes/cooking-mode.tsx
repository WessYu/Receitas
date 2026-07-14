"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from "lucide-react";

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

export function CookingMode({ slug, title, servings, ingredients, steps }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [portionCount, setPortionCount] = useState(servings);

  useEffect(() => {
    const wakeLock = (navigator as WakeLockNavigator).wakeLock;
    if (!wakeLock) return;

    let lock: WakeLockHandle | null = null;
    wakeLock.request("screen").then((result) => {
      lock = result;
    }).catch(() => undefined);

    return () => {
      lock?.release().catch(() => undefined);
    };
  }, []);

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const isLastStep = currentStep === steps.length - 1;

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
              <button type="button" aria-label="Diminuir porções" onClick={() => setPortionCount((count) => Math.max(1, count - 1))} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-[#B8B8BE] hover:text-white">
                <Minus className="h-4 w-4" />
              </button>
              <strong className="min-w-6 text-center">{portionCount}</strong>
              <button type="button" aria-label="Aumentar porções" onClick={() => setPortionCount((count) => count + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-[#B8B8BE] hover:text-white">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-[#F5F5F3]">Confira os ingredientes</h2>
            <div className="mt-3 space-y-2">
              {ingredients.map((ingredient) => {
                const checked = checkedIngredients.includes(ingredient.id);
                return (
                  <button key={ingredient.id} type="button" onClick={() => toggleIngredient(ingredient.id)} className="flex w-full items-center gap-3 rounded-[12px] border border-white/10 bg-[#141417] px-4 py-3 text-left">
                    <span className={`grid h-5 w-5 place-items-center rounded border ${checked ? "border-[#7BAE7F] bg-[#7BAE7F] text-[#09090B]" : "border-white/20"}`}>
                      {checked ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span className={checked ? "text-[#77777E] line-through" : "text-[#C8C8CC]"}>
                      <strong className="mr-2 text-[#96C59A]">{ingredient.amount}</strong>
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
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Passo {currentStep + 1} de {steps.length}</span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-border sm:w-48">
                <div className="h-full rounded-full bg-[#7BAE7F] transition-all" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
              </div>
            </div>
            <p className="mt-12 max-w-3xl font-serif text-3xl leading-[1.25] text-[#F5F5F3] sm:text-5xl">{steps[currentStep]?.content}</p>
          </div>

          <div className="mt-12 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((step) => Math.max(0, step - 1))} className="button-secondary disabled:cursor-not-allowed disabled:opacity-40">
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </button>

            {isLastStep ? (
              <Link href={`/recipes/${slug}`} className="button-primary">
                <Check className="h-4 w-4" />
                Finalizar preparo
              </Link>
            ) : (
              <button type="button" onClick={() => setCurrentStep((step) => step + 1)} className="button-primary">
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
