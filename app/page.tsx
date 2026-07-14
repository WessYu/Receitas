import Link from "next/link";
import type { Category, Recipe } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { SaveRecipeButton } from "@/components/recipes/save-recipe-button";

type RecipeWithCategory = Recipe & { category: Category };

const cuisineCards = [
  {
    label: "Massas",
    href: "/recipes?category=massas",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=90"
  },
  {
    label: "Sobremesas",
    href: "/recipes?category=sobremesas",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=90"
  },
  {
    label: "Vegetarianas",
    href: "/recipes?category=vegetariano",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90"
  }
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [user, heroRecipe, popularRecipes, latestRecipes, quickRecipe] = await Promise.all([
    getCurrentUser(),
    prisma.recipe.findFirst({
      where: { published: true, featured: true },
      include: { category: true, favorites: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.recipe.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: [{ favorites: { _count: "desc" } }, { comments: { _count: "desc" } }, { createdAt: "desc" }],
      take: 5
    }),
    prisma.recipe.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.recipe.findFirst({
      where: { published: true, prepTime: { lte: 25 } },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const heroSaved = Boolean(user && heroRecipe?.favorites.some((favorite) => favorite.userId === user.id));

  return (
    <div>
      {heroRecipe ? (
        <section className="container-page py-8 md:py-12">
          <div className="relative min-h-[620px] overflow-hidden rounded-[30px] bg-surface md:min-h-[calc(100vh-150px)]">
            <RecipeImage src={heroRecipe.imageUrl} alt={heroRecipe.title} priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background/92 via-background/58 to-transparent md:inset-y-0 md:left-0 md:h-auto md:w-3/5 md:bg-gradient-to-r md:from-background/92 md:via-background/56 md:to-transparent" />
            <div className="absolute bottom-8 left-6 max-w-2xl md:bottom-14 md:left-14">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Receita em destaque</p>
              <h1 className="mt-5 font-serif text-5xl leading-[0.95] text-ink md:text-7xl">{heroRecipe.title}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{heroRecipe.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/recipes/${heroRecipe.slug}`} className="button-primary">
                  Ver receita
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <SaveRecipeButton
                  recipeId={heroRecipe.id}
                  isSaved={heroSaved}
                  isLoggedIn={Boolean(user)}
                  saveLabel="Salvar"
                  savedLabel="Salva"
                  loggedOutLabel="Salvar"
                  className="button-secondary"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-page py-14">
        <div className="mb-8">
          <p className="eyebrow mb-2">Savor</p>
          <h2 className="font-serif text-5xl leading-none text-ink">Cook beautifully.</h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">Descubra receitas criadas para quem ama cozinhar.</p>
        </div>
        <form action="/recipes" className="grid max-w-2xl gap-3 sm:grid-cols-[1fr_auto]">
          <input
            name="q"
            className="h-14 rounded-full border border-border bg-surface px-6 text-sm text-ink outline-none transition placeholder:text-disabled focus:border-olive"
            placeholder="Pesquisar receita..."
          />
          <button className="button-primary" type="submit">
            Pesquisar
          </button>
        </form>
      </section>

      <section className="bg-[#0c0c0e] py-16">
        <div className="container-page">
          <SectionTitle eyebrow="Cozinhas" title="Escolha por vontade." />
          <div className="grid gap-5 md:grid-cols-3">
            {cuisineCards.map((category) => (
              <Link key={category.label} href={category.href} className="group relative min-h-[300px] overflow-hidden rounded-[28px] bg-surface">
                <RecipeImage src={category.image} alt={category.label} sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.015]" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/86 to-transparent" />
                <span className="absolute bottom-6 left-6 font-serif text-4xl text-ink">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionTitle eyebrow="Mais populares" title="Receitas que a comunidade mais salvou." />
        <AsymmetricRecipes recipes={popularRecipes} />
      </section>

      {quickRecipe ? (
        <section className="bg-[#0c0c0e] py-16">
          <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-3">Receita rapida da semana</p>
              <h2 className="font-serif text-5xl leading-none text-ink">{quickRecipe.title}</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{quickRecipe.description}</p>
              <Link href={`/recipes/${quickRecipe.slug}`} className="button-primary mt-8">
                Cozinhar agora
              </Link>
            </div>
            <Link href={`/recipes/${quickRecipe.slug}`} className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface">
              <RecipeImage src={quickRecipe.imageUrl} alt={quickRecipe.title} sizes="(min-width: 1024px) 50vw, 100vw" />
            </Link>
          </div>
        </section>
      ) : null}

      <RecipeSection eyebrow="Novidades" title="Ultimas receitas adicionadas." recipes={latestRecipes} />

      <section className="container-page py-16">
        <div className="rounded-[30px] bg-surface p-8 md:p-12">
          <p className="eyebrow mb-3">Sua cozinha</p>
          <h2 className="max-w-3xl font-serif text-5xl leading-none text-ink">Salve receitas, volte quando quiser e cozinhe sem pressa.</h2>
          <Link href="/register" className="button-primary mt-8">
            Criar conta
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h2 className="font-serif text-4xl leading-none text-ink md:text-5xl">{title}</h2>
    </div>
  );
}

function AsymmetricRecipes({ recipes }: { recipes: RecipeWithCategory[] }) {
  if (!recipes.length) return null;
  const [first, ...rest] = recipes;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <RecipeCard recipe={first} priority />
      <div className="grid gap-10 sm:grid-cols-2">
        {rest.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

function RecipeSection({ eyebrow, title, recipes }: { eyebrow: string; title: string; recipes: RecipeWithCategory[] }) {
  if (!recipes.length) return null;

  return (
    <section className="container-page py-16">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
