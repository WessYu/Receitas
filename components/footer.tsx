import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>Mise. Cook beautifully.</p>
        <div className="flex gap-5">
          <Link href="/recipes" className="transition duration-300 hover:text-ink">
            Explorar
          </Link>
          <Link href="/dashboard" className="transition duration-300 hover:text-ink">
            Minha cozinha
          </Link>
        </div>
      </div>
    </footer>
  );
}
