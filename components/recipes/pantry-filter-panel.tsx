"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChefHat, Loader2, PackageCheck, Search, SlidersHorizontal, X } from "lucide-react";
import { formatPantryParam, getIngredientDisplayName, normalizeIngredientName, pantryGroups, parsePantryParam } from "@/lib/pantry";

type PantryFilterPanelProps = {
  selectedValue?: string;
  completeOnly?: boolean;
};

export function PantryFilterPanel({ selectedValue, completeOnly = false }: PantryFilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(() => parsePantryParam(selectedValue));
  const [onlyComplete, setOnlyComplete] = useState(completeOnly);
  const [pending, startTransition] = useTransition();
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const normalizedQuery = normalizeIngredientName(query);

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return pantryGroups;

    return pantryGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.value.includes(normalizedQuery))
      }))
      .filter((group) => group.items.length);
  }, [normalizedQuery, query]);

  const customIngredientAvailable = normalizedQuery && !pantryGroups.some((group) => group.items.some((item) => item.value === normalizedQuery));

  const toggleIngredient = (value: string) => {
    setSelected((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  const updateUrl = (nextSelected: string[], nextComplete: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const pantry = formatPantryParam(nextSelected);

    if (pantry) {
      params.set("pantry", pantry);
    } else {
      params.delete("pantry");
    }

    if (nextComplete) {
      params.set("complete", "1");
    } else {
      params.delete("complete");
    }

    params.delete("page");
    const queryString = params.toString();

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
      setOpen(false);
    });
  };

  const clearSelection = () => {
    setSelected([]);
    setOnlyComplete(false);
    updateUrl([], false);
  };

  return (
    <>
      <button
        type="button"
        className={`button-secondary w-full justify-center px-4 ${selected.length ? "border-olive/40 bg-olive/10 text-olive" : ""}`}
        onClick={() => setOpen(true)}
      >
        <PackageCheck className="h-4 w-4" />
        O que tenho em casa
        {selected.length ? <span className="rounded-full bg-olive px-2 py-0.5 text-xs text-background">{selected.length}</span> : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" role="presentation" onClick={() => setOpen(false)}>
          <aside
            className="ml-auto flex h-full w-[min(94vw,520px)] flex-col overflow-hidden border-l border-border bg-background shadow-2xl sm:my-4 sm:h-[calc(100dvh-32px)] sm:rounded-l-[28px]"
            role="dialog"
            aria-modal="true"
            aria-label="Cozinhe com o que você tem"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-border p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-gold">Cozinhe com o que você tem</p>
                  <h2 className="mt-2 font-serif text-3xl leading-none text-ink">Monte sua despensa.</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Selecione ingredientes disponíveis e encontre receitas por compatibilidade.
                  </p>
                </div>
                <button type="button" className="button-secondary h-10 w-10 px-0" aria-label="Fechar painel" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <label className="relative mt-5 block">
                <span className="sr-only">Buscar ingrediente</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  className="field field-with-icon"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar ovos, leite, farinha..."
                />
              </label>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-full border border-border bg-surface px-3 py-1.5">
                  {selected.length} {selected.length === 1 ? "ingrediente selecionado" : "ingredientes selecionados"}
                </span>
                {selected.slice(0, 5).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-olive/25 bg-olive/10 px-3 py-1.5 text-olive transition hover:border-olive/60"
                    onClick={() => toggleIngredient(item)}
                  >
                    {getIngredientDisplayName(item)}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              <label className="mb-6 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-white/20 hover:bg-elevated">
                <span>
                  <span className="block text-sm font-semibold text-ink">Mostrar receitas quase prontas</span>
                  <span className="mt-1 block text-xs leading-5 text-muted">Exibe pratos para os quais faltam no máximo 2 ingredientes.</span>
                </span>
                <input
                  className="h-5 w-5 accent-olive"
                  type="checkbox"
                  checked={onlyComplete}
                  onChange={(event) => setOnlyComplete(event.target.checked)}
                />
              </label>

              {filteredGroups.length ? (
                <div className="space-y-6">
                  {filteredGroups.map((group) => (
                    <section key={group.title} className="content-visibility-auto">
                      <div className="mb-3 flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-olive" />
                        <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => {
                          const active = selectedSet.has(item.value);

                          return (
                            <button
                              key={item.value}
                              type="button"
                              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${
                                active
                                  ? "border-olive bg-olive text-background"
                                  : "border-border bg-surface text-muted hover:border-white/20 hover:bg-elevated hover:text-ink"
                              }`}
                              onClick={() => toggleIngredient(item.value)}
                            >
                              {active ? <Check className="h-4 w-4" /> : null}
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface/70 p-8 text-center">
                  <ChefHat className="mx-auto mb-3 h-8 w-8 text-olive" />
                  <h3 className="font-serif text-2xl text-ink">Ingrediente não catalogado</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">Adicione o termo digitado para combinar com ingredientes normalizados.</p>
                </div>
              )}

              {customIngredientAvailable ? (
                <button
                  type="button"
                  className="button-secondary mt-5 w-full"
                  onClick={() => {
                    toggleIngredient(normalizedQuery);
                    setQuery("");
                  }}
                >
                  Adicionar &quot;{query.trim()}&quot;
                </button>
              ) : null}
            </div>

            <div className="border-t border-border bg-background/95 p-4 backdrop-blur sm:p-5">
              <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                <button type="button" className="button-secondary" onClick={clearSelection}>
                  Limpar seleção
                </button>
                <button type="button" className="button-primary" disabled={pending || selected.length === 0} onClick={() => updateUrl(selected, onlyComplete)}>
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChefHat className="h-4 w-4" />}
                  Encontrar receitas
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
