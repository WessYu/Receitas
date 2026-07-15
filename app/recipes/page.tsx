import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/recipes/filter-bar";
import { Pagination } from "@/components/recipes/pagination";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { buildRecipeOrderBy, buildRecipeWhere, getCategories } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function asPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function RecipesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = {
    q: asString(params.q),
    category: asString(params.category),
    gourmet: asString(params.gourmet),
    difficulty: asString(params.difficulty),
    maxTime: asString(params.maxTime),
    ingredient: asString(params.ingredient),
    sort: asString(params.sort),
    perPage: asString(params.perPage)
  };
  const page = asPositiveInt(asString(params.page), 1);
  const perPageOptions = [6, 9, 12, 24];
  const requestedPerPage = asPositiveInt(filters.perPage, 9);
  const perPage = perPageOptions.includes(requestedPerPage) ? requestedPerPage : 9;
  const where = buildRecipeWhere(filters);

  const [totalRecipes, categories] = await Promise.all([
    prisma.recipe.count({ where }),
    getCategories()
  ]);
  const totalPages = Math.max(1, Math.ceil(totalRecipes / perPage));
  const currentPage = Math.min(page, totalPages);
  const recipes = await prisma.recipe.findMany({
    where,
    include: { category: true },
    orderBy: buildRecipeOrderBy(filters.sort),
    skip: (currentPage - 1) * perPage,
    take: perPage
  });

  return (
    <section className="container-page py-16">
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow mb-3">Biblioteca</p>
        <h1 className="font-serif text-6xl leading-none text-ink md:text-7xl">Receitas para cozinhar com foco.</h1>
        <p className="mt-5 text-lg leading-8 text-muted">Busque por prato, categoria, tempo, dificuldade ou ingrediente disponível.</p>
      </div>
      <FilterBar categories={categories} params={filters} />
      <div className="mt-10">
        {recipes.length ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhuma receita encontrada" description="Ajuste os filtros ou tente um termo mais amplo para descobrir novas opções." />
        )}
        <Pagination page={currentPage} totalPages={totalPages} totalItems={totalRecipes} perPage={perPage} params={filters} />
      </div>
    </section>
  );
}
