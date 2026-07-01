import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/lib/actions";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/recipes", label: "Receitas" }
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/85 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="relative h-11 w-11 overflow-hidden rounded-md shadow-sm">
            <Image src="/logo.svg" alt="Receitas" fill priority sizes="44px" className="object-contain" />
          </span>
          <span className="font-serif text-2xl">Receitas</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
          {user?.role === "ADMIN" ? (
            <Link href="/admin" className="inline-flex items-center gap-2 transition hover:text-ink">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="button-secondary hidden px-4 py-2.5 sm:inline-flex">
                <UserRound className="h-4 w-4" />
                {user.name.split(" ")[0]}
              </Link>
              <form action={logoutAction}>
                <button className="button-secondary px-3 py-2.5" type="submit" aria-label="Sair">
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="button-secondary px-4 py-2.5">
                Entrar
              </Link>
              <Link href="/register" className="button-primary hidden px-4 py-2.5 sm:inline-flex">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
