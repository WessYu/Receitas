"use client";

import Link from "next/link";
import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { registerAction } from "@/lib/actions";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {});

  return (
    <form action={action} className="space-y-4">
      {state.message ? (
        <p className="rounded-md border border-tomato/20 bg-tomato/10 px-4 py-3 text-sm text-tomato">{state.message}</p>
      ) : null}
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="name">
          Nome
        </label>
        <input className="field" id="name" name="name" autoComplete="name" />
        {state.errors?.name ? <p className="mt-2 text-xs text-tomato">{state.errors.name[0]}</p> : null}
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="email">
          Email
        </label>
        <input className="field" id="email" name="email" type="email" autoComplete="email" />
        {state.errors?.email ? <p className="mt-2 text-xs text-tomato">{state.errors.email[0]}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="password">
            Senha
          </label>
          <input className="field" id="password" name="password" type="password" autoComplete="new-password" />
          {state.errors?.password ? <p className="mt-2 text-xs text-tomato">{state.errors.password[0]}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="confirmPassword">
            Confirmar senha
          </label>
          <input className="field" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" />
          {state.errors?.confirmPassword ? <p className="mt-2 text-xs text-tomato">{state.errors.confirmPassword[0]}</p> : null}
        </div>
      </div>
      <button className="button-primary w-full" disabled={pending} type="submit">
        <UserPlus className="h-4 w-4" />
        Criar conta
      </button>
      <p className="text-center text-sm text-ink/60">
        Ja tem conta?{" "}
        <Link href="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
