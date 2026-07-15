import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[#0c0c0e]">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-base font-semibold text-ink">Savor</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Um lugar para descobrir, salvar e cozinhar receitas com mais prazer.
          </p>
        </div>
        <div className="flex gap-5 text-sm text-muted">
          <Link href="/recipes" className="transition duration-300 hover:text-ink">
            Receitas
          </Link>
          <Link href="/dashboard" className="transition duration-300 hover:text-ink">
            Minha cozinha
          </Link>
        </div>
      </div>
    </footer>
  );
}
