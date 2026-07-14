import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChefHat, Clock3, Layers3, MessageCircle, UsersRound } from "lucide-react";
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
    <article>
      <section className="container-page pt-8 sm:pt-12">
        <div className="relative aspect-[16/8] min-h-[380px] overflow-hidden rounded-[22px] bg-[#1D1D22]">
          <RecipeImage src={recipe.imageUrl} alt={recipe.title} priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#96C59A]">{recipe.category.name}</p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl">
              {recipe.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{recipe.description}</p>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-10 lg:grid-cols-[0.72fr_1.28fr] lg:py-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[18px] border border-white/10 bg-[#141417] p-5">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Clock3 className="h-4 w-4 text-[#7BAE7F]" />
                <strong className="mt-2 block text-sm text-[#F5F5F3]">{recipe.prepTime} min</strong>
                <span className="text-xs text-[#8F8F96]">tempo</span>
              </div>
              <div>
                <UsersRound className="h-4 w-4 text-[#7BAE7F]" />
                <strong className="mt-2 block text-sm text-[#F5F5F3]">{recipe.servings}</strong>
                <span className="text-xs text-[#8F8F96]">porções</span>
              </div>
              <div>
                <Layers3 className="h-4 w-4 text-[#7BAE7F]" />
                <strong className="mt-2 block text-sm text-[#F5F5F3]">{formatDifficulty(recipe.difficulty)}</strong>
                <span className="text-xs text-[#8F8F96]">nível</span>
              </div>
            </div>

            <Link href={`/recipes/${recipe.slug}/cook`} className="button-primary mt-6 flex w-full">
              <ChefHat className="h-4 w-4" />
              Começar a cozinhar
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-3">
              <SaveRecipeButton recipeId={recipe.id} isSaved={isSaved} isLoggedIn={Boolean(user)} />
            </div>
          </div>

          {recipe.author ? (
            <div className="mt-5 flex items-center gap-3 text-sm text-[#9A9AA0]">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#1D1D22] font-semibold text-[#7BAE7F]">
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
        </aside>

        <div>
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Antes de começar</p>
            <h2 className="mt-2 font-serif text-3xl text-[#F5F5F3] sm:text-4xl">Ingredientes</h2>
            <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="grid grid-cols-[110px_1fr] gap-4 py-4 text-sm sm:grid-cols-[150px_1fr]">
                  <strong className="text-[#96C59A]">{ingredient.amount}</strong>
                  <span className="text-[#D0D0D4]">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Passo a passo</p>
            <h2 className="mt-2 font-serif text-3xl text-[#F5F5F3] sm:text-4xl">Preparo</h2>
            <ol className="mt-7 space-y-8">
              {recipe.steps.map((step) => (
                <li key={step.id} className="grid grid-cols-[42px_1fr] gap-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-[#7BAE7F]/30 text-sm font-bold text-[#96C59A]">
                    {step.order}
                  </span>
                  <p className="pt-1 text-base leading-8 text-[#C2C2C7]">{step.content}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-16 border-t border-white/10 pt-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Comunidade</p>
                <h2 className="mt-2 font-serif text-3xl text-[#F5F5F3]">Comentários</h2>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-[#9A9AA0]">
                <MessageCircle className="h-4 w-4 text-[#7BAE7F]" />
                {recipe.comments.length}
              </span>
            </div>
            <CommentForm recipeId={recipe.id} isLoggedIn={Boolean(user)} />
            <div className="mt-6 grid gap-3">
              {recipe.comments.map((comment) => (
                <div key={comment.id} className="rounded-[16px] border border-white/10 bg-[#141417] p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#1D1D22] text-sm font-semibold text-[#7BAE7F]">
                      {comment.user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={comment.user.avatarUrl} alt={comment.user.name} className="h-full w-full object-cover" />
                      ) : (
                        comment.user.name.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <strong className="block text-sm text-[#F5F5F3]">{comment.user.name}</strong>
                      <span className="text-xs text-[#77777E]">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="leading-7 text-[#B8B8BE]">{comment.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}
