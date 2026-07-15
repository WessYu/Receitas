import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ChefHat, Clock3, Layers3, MessageCircle, UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { recipeInclude } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { formatDifficulty } from "@/lib/utils";
import { SaveRecipeButton } from "@/components/recipes/save-recipe-button";
import { CommentForm } from "@/components/recipes/comment-form";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { RecipeCard } from "@/components/recipes/recipe-card";

export const dynamic = "force-dynamic";

type RecipePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await prisma.recipe.findFirst({
    where: { slug, published: true },
    select: {
      title: true,
      description: true,
      imageUrl: true,
      slug: true
    }
  });

  if (!recipe) {
    return {
      title: "Receita não encontrada"
    };
  }

  return {
    title: recipe.title,
    description: recipe.description,
    alternates: {
      canonical: `/recipes/${recipe.slug}`
    },
    openGraph: {
      title: `${recipe.title} | Savor`,
      description: recipe.description,
      url: `/recipes/${recipe.slug}`,
      type: "article",
      images: [
        {
          url: recipe.imageUrl,
          alt: recipe.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${recipe.title} | Savor`,
      description: recipe.description,
      images: [recipe.imageUrl]
    }
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const [recipe, user] = await Promise.all([
    prisma.recipe.findFirst({
      where: { slug, published: true },
      include: recipeInclude
    }),
    getCurrentUser()
  ]);

  if (!recipe) notFound();

  const relatedRecipes = await prisma.recipe.findMany({
    where: {
      published: true,
      id: { not: recipe.id },
      categoryId: recipe.categoryId
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  const isSaved = user ? recipe.favorites.some((favorite) => favorite.userId === user.id) : false;

  return (
    <article>
      <section className="container-page pt-8 md:pt-12">
        <div className="relative aspect-[16/9] min-h-[440px] overflow-hidden rounded-[30px] bg-surface">
          <RecipeImage src={recipe.imageUrl} alt={recipe.title} priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/24 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{recipe.category.name}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.96] text-ink md:text-7xl">{recipe.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted md:text-lg">{recipe.description}</p>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
          <section className="rounded-[28px] bg-surface p-6">
            <div className="grid grid-cols-3 gap-4">
              <Metric icon={Clock3} value={`${recipe.prepTime} min`} label="tempo" />
              <Metric icon={UsersRound} value={`${recipe.servings}`} label="porções" />
              <Metric icon={Layers3} value={formatDifficulty(recipe.difficulty)} label="nível" />
            </div>
            <Link href={`/recipes/${recipe.slug}/cook`} className="button-primary mt-6 w-full">
              <ChefHat className="h-4 w-4" />
              Começar a cozinhar
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-3">
              <SaveRecipeButton recipeId={recipe.id} isSaved={isSaved} isLoggedIn={Boolean(user)} className="button-secondary w-full" />
            </div>
          </section>

          <section className="rounded-[28px] bg-surface p-6">
            <h2 className="font-serif text-3xl text-ink">Ingredientes</h2>
            <ul className="mt-6 grid gap-4">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="grid grid-cols-[104px_1fr] gap-4 border-b border-border pb-4 text-sm last:border-b-0 last:pb-0">
                  <strong className="text-olive">{ingredient.amount}</strong>
                  <span className="text-ink">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] bg-surface p-6">
            <h2 className="font-serif text-3xl text-ink">Informações da receita</h2>
            <p className="mt-2 text-xs text-muted">Dados cadastrados no preparo</p>
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border">
              {[
                ["Tempo total", `${recipe.prepTime} min`],
                ["Porções", `${recipe.servings}`],
                ["Dificuldade", formatDifficulty(recipe.difficulty)],
                ["Ingredientes", `${recipe.ingredients.length}`]
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
            <p className="eyebrow mb-2">Passo a passo</p>
            <h2 className="font-serif text-4xl text-ink">Modo de preparo</h2>
            <ol className="mt-8 space-y-8">
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
              <h2 className="font-serif text-4xl text-ink">Comentários</h2>
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
            <h2 className="font-serif text-4xl text-ink">Receitas relacionadas</h2>
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

function Metric({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div>
      <Icon className="h-4 w-4 text-olive" />
      <strong className="mt-2 block text-sm text-ink">{value}</strong>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
