import Image from "next/image";
import Link from "next/link";
import { LogOut, Search, ShieldCheck, UserRound } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { MobileNavigation } from "@/components/mobile-navigation";
import { getCurrentUser } from "@/lib/session";

const nav = [
  { href: "/", label: "Início" },
  { href: "/recipes", label: "Receitas" }
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container-page flex min-h-24 items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="relative h-9 w-9 overflow-hidden rounded-[14px]">
            <Image src="/logo.svg" alt="Savor" fill priority sizes="36px" className="object-contain" />
          </span>
          <span className="text-base font-semibold tracking-[0.02em] text-ink">Savor</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition duration-300 hover:text-ink">
              {item.label}
            </Link>
          ))}
          {user?.role === "ADMIN" ? (
            <Link href="/admin" className="inline-flex items-center gap-2 transition duration-300 hover:text-ink">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
        </nav>

        <form action="/recipes" className="relative hidden flex-1 md:block md:max-w-sm">
          <label htmlFor="header-search" className="sr-only">
            Buscar receitas
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="header-search"
            name="q"
            className="h-11 w-full rounded-full border border-border bg-surface px-11 text-sm text-ink outline-none transition placeholder:text-disabled focus:border-olive"
            placeholder="Pesquisar receita..."
          />
        </form>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden items-center gap-2 text-sm font-medium text-muted transition hover:text-ink sm:inline-flex">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.name} className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
                {user.name.split(" ")[0]}
              </Link>
              <form action={logoutAction}>
                <button className="text-sm font-medium text-muted transition hover:text-ink" type="submit" aria-label="Sair da conta" title="Sair">
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted transition hover:text-ink">
                Entrar
              </Link>
              <Link href="/register" className="button-primary hidden px-4 py-2.5 sm:inline-flex">
                Criar conta
              </Link>
            </>
          )}
          <MobileNavigation
            user={
              user
                ? {
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                    isAdmin: user.role === "ADMIN"
                  }
                : null
            }
          />
        </div>
      </div>
    </header>
  );
}
