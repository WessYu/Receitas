import { notFound } from "next/navigation";
import { Clock3, Layers3, MessageCircle, UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { recipeInclude } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { formatDifficulty } from "@/lib/utils";
import { SaveRecipeButton } from "@/components/recipes/save-recipe-button";
import { CommentForm } from "@/components/recipes/comment-form";
import { RecipeImage } from "@/components/recipes/recipe-image";

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

  const isSaved = user ? recipe.favorites.some((favorite) => favorite.userId === user.id) : false;

  return (
    <article className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-ink/10 bg-ink/5 shadow-soft lg:sticky lg:top-28">
          <RecipeImage src={recipe.imageUrl} alt={recipe.title} priority sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>
        <div>
          <p className="eyebrow mb-3">{recipe.category.name}</p>
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">{recipe.title}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">{recipe.description}</p>
          {recipe.author ? (
            <div className="mt-5 flex items-center gap-3 text-sm text-ink/60">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-olive/10 font-semibold text-olive">
                {recipe.author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={recipe.author.avatarUrl} alt={recipe.author.name} className="h-full w-full object-cover" />
                ) : (
                  recipe.author.name.slice(0, 1).toUpperCase()
                )}
              </div>
              <span>Receita de {recipe.author.name}</span>
            </div>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <Clock3 className="h-4 w-4 text-olive" />
              {recipe.prepTime} min
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <UsersRound className="h-4 w-4 text-olive" />
              {recipe.servings} porções
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <Layers3 className="h-4 w-4 text-olive" />
              {formatDifficulty(recipe.difficulty)}
            </span>
          </div>
          <div className="mt-8">
            <SaveRecipeButton recipeId={recipe.id} isSaved={isSaved} isLoggedIn={Boolean(user)} />
          </div>

          <section className="mt-10 rounded-lg border border-ink/10 bg-white/70 p-6 shadow-sm">
            <h2 className="font-serif text-3xl">Ingredientes</h2>
            <ul className="mt-5 grid gap-3">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex gap-3 rounded-md bg-porcelain/80 px-4 py-3 text-sm">
                  <strong className="min-w-24 text-olive">{ingredient.amount}</strong>
                  <span>{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 rounded-lg border border-ink/10 bg-white/70 p-6 shadow-sm">
            <h2 className="font-serif text-3xl">Preparo</h2>
            <ol className="mt-5 space-y-4">
              {recipe.steps.map((step) => (
                <li key={step.id} className="grid grid-cols-[40px_1fr] gap-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-olive text-sm font-bold text-white">{step.order}</span>
                  <p className="pt-2 leading-7 text-ink/70">{step.content}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-serif text-3xl">Comentários</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/55 shadow-sm">
                <MessageCircle className="h-4 w-4 text-olive" />
                {recipe.comments.length}
              </span>
            </div>
            <CommentForm recipeId={recipe.id} isLoggedIn={Boolean(user)} />
            <div className="mt-5 grid gap-3">
              {recipe.comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-ink/10 bg-white/70 p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-olive/10 text-sm font-semibold text-olive">
                      {comment.user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={comment.user.avatarUrl} alt={comment.user.name} className="h-full w-full object-cover" />
                      ) : (
                        comment.user.name.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <strong className="block text-sm">{comment.user.name}</strong>
                      <span className="text-xs text-ink/45">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="leading-7 text-ink/70">{comment.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
