import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock3, Layers3, UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { recipeInclude } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { formatDifficulty } from "@/lib/utils";
import { SaveRecipeButton } from "@/components/recipes/save-recipe-button";

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
          <Image src={recipe.imageUrl} alt={recipe.title} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow mb-3">{recipe.category.name}</p>
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">{recipe.title}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">{recipe.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <Clock3 className="h-4 w-4 text-olive" />
              {recipe.prepTime} min
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <UsersRound className="h-4 w-4 text-olive" />
              {recipe.servings} porcoes
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
        </div>
      </div>
    </article>
  );
}
