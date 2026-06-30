import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-porcelain/70">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-ink/60 md:flex-row md:items-center md:justify-between">
        <p>Receitas elegantes para cozinhar melhor no dia a dia.</p>
        <div className="flex gap-5">
          <Link href="/recipes" className="transition hover:text-ink">
            Explorar
          </Link>
          <Link href="/dashboard" className="transition hover:text-ink">
            Favoritas
          </Link>
          <Link href="/admin" className="transition hover:text-ink">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
