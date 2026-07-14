import { notFound } from "next/navigation";
import { Clock3, Flame, Layers3, MessageCircle, UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { recipeInclude } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { formatDifficulty } from "@/lib/utils";
import { SaveRecipeButton } from "@/components/recipes/save-recipe-button";
import { CommentForm } from "@/components/recipes/comment-form";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { KitchenMode } from "@/components/recipes/kitchen-mode";
import { RecipeCard } from "@/components/recipes/recipe-card";

export const dynamic = "force-dynamic";

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [recipe, user] = await Promise.all([
    prisma.recipe.findFirst({
      where: { slug, published: true },
      include: recipeInclude
    }),
    getCurrentUser()
  ]);

  if (!recipe) notFound();

  const [relatedRecipes] = await Promise.all([
    prisma.recipe.findMany({
      where: {
        published: true,
        id: { not: recipe.id },
        categoryId: recipe.categoryId
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3
    })
  ]);

  const isSaved = user ? recipe.favorites.some((favorite) => favorite.userId === user.id) : false;
  const estimatedCalories = Math.max(260, recipe.ingredients.length * 70 + recipe.prepTime * 3);
  const estimatedProtein = Math.max(8, Math.round(recipe.ingredients.length * 2.4));
  const estimatedCarbs = Math.max(18, Math.round(recipe.ingredients.length * 5.2));
  const estimatedFat = Math.max(6, Math.round(recipe.ingredients.length * 1.8));

  return (
    <article>
      <section className="container-page py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{recipe.category.name}</p>
          <h1 className="mt-5 font-serif text-6xl leading-[0.92] text-ink md:text-8xl">{recipe.title}</h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted">{recipe.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink">
              <Clock3 className="h-4 w-4 text-olive" />
              {recipe.prepTime} min
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink">
              <UsersRound className="h-4 w-4 text-olive" />
              {recipe.servings} porcoes
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink">
              <Layers3 className="h-4 w-4 text-olive" />
              {formatDifficulty(recipe.difficulty)}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SaveRecipeButton recipeId={recipe.id} isSaved={isSaved} isLoggedIn={Boolean(user)} />
            <KitchenMode title={recipe.title} steps={recipe.steps.map((step) => ({ order: step.order, content: step.content }))} />
          </div>
        </div>

        <div className="relative mt-14 aspect-[16/10] min-h-[460px] overflow-hidden rounded-[28px] bg-surface shadow-soft">
          <RecipeImage src={recipe.imageUrl} alt={recipe.title} priority sizes="100vw" />
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[0.76fr_1.24fr]">
        <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
          <section className="rounded-[28px] bg-surface p-6">
            <h2 className="font-serif text-3xl text-ink">Ingredientes</h2>
            <ul className="mt-6 grid gap-4">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="grid grid-cols-[96px_1fr] gap-4 border-b border-border pb-4 text-sm last:border-b-0 last:pb-0">
                  <strong className="text-olive">{ingredient.amount}</strong>
                  <span className="text-ink">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] bg-surface p-6">
            <h2 className="font-serif text-3xl text-ink">Nutricao</h2>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">Estimativa por porcao</p>
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border">
              {[
                ["Calorias", `${estimatedCalories} kcal`],
                ["Proteina", `${estimatedProtein} g`],
                ["Carbo", `${estimatedCarbs} g`],
                ["Gordura", `${estimatedFat} g`]
              ].map(([label, value]) => (
                <div key={label} className="bg-elevated p-4">
                  <span className="text-xs text-muted">{label}</span>
                  <strong className="mt-1 block text-lg text-ink">{value}</strong>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <div>
          <section className="rounded-[28px] bg-surface p-6 md:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="font-serif text-4xl text-ink">Modo de preparo</h2>
              <Flame className="h-5 w-5 text-olive" />
            </div>
            <ol className="space-y-8">
              {recipe.steps.map((step) => (
                <li key={step.id} className="grid gap-5 border-b border-border pb-8 last:border-b-0 last:pb-0 md:grid-cols-[72px_1fr]">
                  <span className="font-serif text-5xl leading-none text-muted">{String(step.order).padStart(2, "0")}</span>
                  <p className="text-xl leading-9 text-ink">{step.content}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-serif text-4xl text-ink">Comentarios</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
                <MessageCircle className="h-4 w-4 text-olive" />
                {recipe.comments.length}
              </span>
            </div>
            <CommentForm recipeId={recipe.id} isLoggedIn={Boolean(user)} />
            <div className="mt-5 grid gap-3">
              {recipe.comments.map((comment) => (
                <div key={comment.id} className="rounded-[24px] bg-surface p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-elevated text-sm font-semibold text-olive">
                      {comment.user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={comment.user.avatarUrl} alt={comment.user.name} className="h-full w-full object-cover" />
                      ) : (
                        comment.user.name.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <strong className="block text-sm text-ink">{comment.user.name}</strong>
                      <span className="text-xs text-disabled">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="leading-7 text-muted">{comment.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {relatedRecipes.length ? (
        <section className="container-page py-12">
          <div className="mb-8">
            <p className="eyebrow mb-2">Continue cozinhando</p>
            <h2 className="font-serif text-4xl text-ink">Receitas parecidas</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {relatedRecipes.map((item) => (
              <RecipeCard key={item.id} recipe={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
