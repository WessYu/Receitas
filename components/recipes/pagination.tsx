import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  params: Record<string, string | undefined>;
};

function buildHref(params: Record<string, string | undefined>, page: number) {
  const nextParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) nextParams.set(key, value);
  });

  if (page > 1) {
    nextParams.set("page", String(page));
  } else {
    nextParams.delete("page");
  }

  const query = nextParams.toString();
  return query ? `/recipes?${query}` : "/recipes";
}

function getVisiblePages(page: number, totalPages: number) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
}

export function Pagination({ page, totalPages, totalItems, perPage, params }: PaginationProps) {
  const firstItem = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const lastItem = Math.min(page * perPage, totalItems);
  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted">
        Mostrando <strong className="text-ink">{firstItem}-{lastItem}</strong> de <strong className="text-ink">{totalItems}</strong> receitas
      </p>

      {totalPages > 1 ? (
        <nav className="flex flex-wrap items-center gap-2" aria-label="Paginação de receitas">
          <Link
            href={buildHref(params, Math.max(1, page - 1))}
            aria-disabled={page === 1}
            className="button-secondary px-4 py-2 aria-disabled:pointer-events-none aria-disabled:opacity-45"
          >
            Anterior
          </Link>
          {pages.map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              {index > 0 && item - pages[index - 1] > 1 ? <span className="px-1 text-muted">...</span> : null}
              <Link
                href={buildHref(params, item)}
                aria-current={item === page ? "page" : undefined}
                className="grid h-10 min-w-10 place-items-center rounded-full border border-border bg-surface px-3 text-sm font-semibold text-muted transition hover:text-ink aria-current:border-olive aria-current:bg-olive aria-current:text-background"
              >
                {item}
              </Link>
            </span>
          ))}
          <Link
            href={buildHref(params, Math.min(totalPages, page + 1))}
            aria-disabled={page === totalPages}
            className="button-secondary px-4 py-2 aria-disabled:pointer-events-none aria-disabled:opacity-45"
          >
            Próxima
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
