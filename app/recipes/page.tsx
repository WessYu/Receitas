import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/recipes/filter-bar";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { buildRecipeWhere, getCategories } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RecipesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = {
    q: asString(params.q),
    category: asString(params.category),
    difficulty: asString(params.difficulty),
    maxTime: asString(params.maxTime),
    ingredient: asString(params.ingredient)
  };

  const [recipes, categories] = await Promise.all([
    prisma.recipe.findMany({
      where: buildRecipeWhere(filters),
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    getCategories()
  ]);

  return (
    <section className="container-page py-12">
      <div className="mb-8">
        <p className="eyebrow mb-2">Biblioteca</p>
        <h1 className="font-serif text-5xl">Receitas</h1>
        <p className="mt-4 max-w-2xl text-ink/60">Busque por prato, categoria, tempo, dificuldade ou ingrediente disponível.</p>
      </div>
      <FilterBar categories={categories} params={filters} />
      <div className="mt-8">
        {recipes.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhuma receita encontrada" description="Ajuste os filtros ou tente um termo mais amplo para descobrir novas opções." />
        )}
      </div>
    </section>
  );
}
