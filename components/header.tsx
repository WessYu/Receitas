import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/lib/actions";

const nav = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" }
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="relative h-11 w-11 overflow-hidden rounded-2xl border border-border bg-surface">
            <Image src="/logo.svg" alt="Mise" fill priority sizes="44px" className="object-contain" />
          </span>
          <span className="text-lg font-semibold tracking-normal text-ink">Mise</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
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

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard/recipes" className="hidden text-sm font-semibold text-muted transition duration-300 hover:text-ink md:inline-flex">
                Minha cozinha
              </Link>
              <Link href="/dashboard" className="button-secondary hidden px-4 py-2.5 sm:inline-flex">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.name} className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
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
