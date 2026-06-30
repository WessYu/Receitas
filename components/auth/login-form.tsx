"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <form action={action} className="space-y-4">
      {state.message ? (
        <p className="rounded-md border border-tomato/20 bg-tomato/10 px-4 py-3 text-sm text-tomato">{state.message}</p>
      ) : null}
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="email">
          Email
        </label>
        <input className="field" id="email" name="email" type="email" autoComplete="email" />
        {state.errors?.email ? <p className="mt-2 text-xs text-tomato">{state.errors.email[0]}</p> : null}
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="password">
          Senha
        </label>
        <input className="field" id="password" name="password" type="password" autoComplete="current-password" />
        {state.errors?.password ? <p className="mt-2 text-xs text-tomato">{state.errors.password[0]}</p> : null}
      </div>
      <button className="button-primary w-full" disabled={pending} type="submit">
        <LogIn className="h-4 w-4" />
        Entrar
      </button>
      <p className="text-center text-sm text-ink/60">
        Ainda nao tem conta?{" "}
        <Link href="/register" className="font-semibold text-ink underline-offset-4 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
