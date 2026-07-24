import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/recipes/filter-bar";
import { Pagination } from "@/components/recipes/pagination";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { buildRecipeOrderBy, buildRecipeWhere, getCategories } from "@/lib/queries";
import { calculateRecipeCompatibility, parsePantryParam } from "@/lib/pantry";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_MISSING_INGREDIENTS = 2;

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
    perPage: asString(params.perPage),
    pantry: asString(params.pantry),
    complete: asString(params.complete)
  };
  const pantryIngredients = parsePantryParam(filters.pantry);
  const onlyComplete = filters.complete === "1";
  const page = asPositiveInt(asString(params.page), 1);
  const perPageOptions = [6, 9, 12, 24];
  const requestedPerPage = asPositiveInt(filters.perPage, 9);
  const perPage = perPageOptions.includes(requestedPerPage) ? requestedPerPage : 9;
  const where = buildRecipeWhere(filters);
  const compatibilityWhere =
    pantryIngredients.length > 0
      ? {
          AND: [
            where,
            {
              ingredients: {
                some: {
                  normalizedName: { in: pantryIngredients }
                }
              }
            }
          ]
        }
      : where;

  const [totalRecipes, categories] = await Promise.all([
    pantryIngredients.length ? Promise.resolve(0) : prisma.recipe.count({ where }),
    getCategories()
  ]);
  const rankedRecipes = pantryIngredients.length
    ? (
        await prisma.recipe.findMany({
          where: compatibilityWhere,
          include: { category: true, ingredients: { orderBy: { order: "asc" } } },
          orderBy: buildRecipeOrderBy(filters.sort)
        })
      )
        .map((recipe) => ({
          recipe,
          compatibility: calculateRecipeCompatibility(recipe.ingredients, pantryIngredients)
        }))
        .filter(
          (item) =>
            item.compatibility &&
            (!onlyComplete || item.compatibility.missingIngredients.length <= MAX_MISSING_INGREDIENTS)
        )
        .sort(
          (a, b) =>
            (b.compatibility?.score ?? 0) - (a.compatibility?.score ?? 0) ||
            (a.compatibility?.missingIngredients.length ?? 0) - (b.compatibility?.missingIngredients.length ?? 0) ||
            b.recipe.createdAt.getTime() - a.recipe.createdAt.getTime()
        )
    : [];
  const effectiveTotalRecipes = pantryIngredients.length ? rankedRecipes.length : totalRecipes;
  const totalPages = Math.max(1, Math.ceil(effectiveTotalRecipes / perPage));
  const currentPage = Math.min(page, totalPages);
  const recipes = pantryIngredients.length
    ? rankedRecipes.slice((currentPage - 1) * perPage, currentPage * perPage)
    : (
        await prisma.recipe.findMany({
          where,
          include: { category: true },
          orderBy: buildRecipeOrderBy(filters.sort),
          skip: (currentPage - 1) * perPage,
          take: perPage
        })
      ).map((recipe) => ({ recipe, compatibility: null }));

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
            {recipes.map(({ recipe, compatibility }) => (
              <RecipeCard key={recipe.id} recipe={recipe} compatibility={compatibility} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={pantryIngredients.length ? "Não encontramos receitas com essa combinação." : "Nenhuma receita encontrada"}
            description={
              pantryIngredients.length
                ? onlyComplete
                  ? "Tente adicionar mais ingredientes ou veja também receitas que exigem alguns itens extras."
                  : "Tente remover um ingrediente ou ajustar os demais filtros."
                : "Ajuste os filtros ou tente um termo mais amplo para descobrir novas opções."
            }
            action={
              pantryIngredients.length
                ? {
                    href: "/recipes",
                    label: "Limpar seleção"
                  }
                : undefined
            }
          />
        )}
        <Pagination page={currentPage} totalPages={totalPages} totalItems={effectiveTotalRecipes} perPage={perPage} params={filters} />
      </div>
    </section>
  );
}
