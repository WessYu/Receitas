"use client";

import { useActionState, useEffect } from "react";
import { Plus } from "lucide-react";
import { createCategoryAction } from "@/lib/actions";
import { useToast } from "@/components/toast";

export function CategoryForm() {
  const [state, action, pending] = useActionState(createCategoryAction, {});
  const { showToast } = useToast();

  useEffect(() => {
    if (state.ok && state.message) showToast(state.message);
  }, [showToast, state.ok, state.message]);

  return (
    <form action={action} className="rounded-lg border border-border bg-surface/85 p-5 shadow-sm">
      <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="name">
        Nova categoria
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input className="field" id="name" name="name" placeholder="Ex: Jantar rápido" />
        <button className="button-primary whitespace-nowrap" disabled={pending} type="submit">
          <Plus className="h-4 w-4" />
          Criar
        </button>
      </div>
      {state.message && !state.ok ? <p className="mt-3 text-sm text-tomato">{state.message}</p> : null}
    </form>
  );
}
