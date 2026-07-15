"use client";

import Link from "next/link";
import { useState } from "react";
import { ChefHat, Home, LogIn, LogOut, Menu, Search, ShieldCheck, UserRound, X } from "lucide-react";
import { logoutAction } from "@/lib/actions";

type MobileNavigationProps = {
  user:
    | {
        name: string;
        avatarUrl: string | null;
        isAdmin: boolean;
      }
    | null;
};

const baseLinks = [
  { href: "/", label: "Início", icon: Home },
  { href: "/recipes", label: "Receitas", icon: ChefHat },
  { href: "/dashboard", label: "Minha cozinha", icon: UserRound },
  { href: "/admin", label: "Admin", icon: ShieldCheck }
];

export function MobileNavigation({ user }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="button-secondary h-11 w-11 px-0"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        title={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" role="presentation" onClick={() => setOpen(false)}>
          <aside
            id="mobile-menu"
            className="ml-auto flex h-full w-[min(88vw,380px)] flex-col border-l border-border bg-background p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Savor</p>
                <p className="mt-1 text-lg font-semibold text-ink">Navegação</p>
              </div>
              <button type="button" className="button-secondary h-10 w-10 px-0" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action="/recipes" className="relative mt-6">
              <label htmlFor="mobile-search" className="sr-only">
                Buscar receitas
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="mobile-search"
                name="q"
                className="h-12 w-full rounded-full border border-border bg-surface px-11 text-sm text-ink outline-none transition placeholder:text-disabled focus:border-olive"
                placeholder="Buscar receita..."
              />
            </form>

            <nav className="mt-6 grid gap-2 text-sm font-semibold text-muted">
              {baseLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition hover:border-white/20 hover:bg-elevated hover:text-ink"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-4 w-4 text-olive" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-border pt-5">
              {user ? (
                <div className="flex items-center justify-between gap-4">
                  <Link href="/dashboard" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-surface text-sm font-semibold text-olive">
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user.name.slice(0, 1).toUpperCase()
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
                      <span className="block text-xs text-muted">Minha cozinha</span>
                    </span>
                  </Link>
                  <form action={logoutAction}>
                    <button className="button-secondary h-10 w-10 px-0" type="submit" aria-label="Sair da conta" title="Sair">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link href="/login" className="button-secondary w-full" onClick={() => setOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Link>
                  <Link href="/register" className="button-primary w-full" onClick={() => setOpen(false)}>
                    Criar conta
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
