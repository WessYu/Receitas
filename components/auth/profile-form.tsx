"use client";

import { useActionState, useEffect } from "react";
import { Save } from "lucide-react";
import { updateProfileAction } from "@/lib/actions";
import { useToast } from "@/components/toast";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, {});
  const { showToast } = useToast();

  useEffect(() => {
    if (state.ok && state.message) showToast(state.message);
  }, [showToast, state.ok, state.message]);

  return (
    <form action={action} className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-sm">
      <h2 className="font-serif text-3xl">Perfil</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="name">
            Nome
          </label>
          <input className="field" id="name" name="name" defaultValue={name} />
          {state.errors?.name ? <p className="mt-2 text-xs text-tomato">{state.errors.name[0]}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input className="field" id="email" name="email" type="email" defaultValue={email} />
          {state.errors?.email ? <p className="mt-2 text-xs text-tomato">{state.errors.email[0]}</p> : null}
        </div>
      </div>
      {state.message && !state.ok ? <p className="mt-4 text-sm text-tomato">{state.message}</p> : null}
      <button className="button-primary mt-5" disabled={pending} type="submit">
        <Save className="h-4 w-4" />
        Salvar perfil
      </button>
    </form>
  );
}
