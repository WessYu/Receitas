import Link from "next/link";
import type { Category, Recipe } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { SaveRecipeButton } from "@/components/recipes/save-recipe-button";

type RecipeWithCategory = Recipe & { category: Category };

const categoryTiles = [
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
    label: "Vegetariano",
    href: "/recipes?category=vegetariano",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90"
  },
  {
    label: "Cafe da manha",
    href: "/recipes?category=cafe-da-manha",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=90"
  },
  {
    label: "Jantar rapido",
    href: "/recipes?category=jantar-rapido",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=90"
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
    <main>
      <section className="container-page py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-5">Savor</p>
          <h1 className="font-serif text-6xl leading-[0.92] text-ink md:text-8xl">
            Receitas que valem o seu tempo.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">
            Descubra receitas bem escolhidas, salve suas favoritas e cozinhe com calma.
          </p>
          <form action="/recipes" className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              name="q"
              className="h-14 flex-1 rounded-full border border-border bg-surface px-6 text-sm text-ink outline-none transition placeholder:text-disabled focus:border-olive"
              placeholder="Pesquisar receita..."
            />
            <button className="button-primary min-h-14 px-7" type="submit">
              Buscar
            </button>
          </form>
        </div>
      </section>

      {heroRecipe ? (
        <section className="container-page pb-20">
          <div className="relative min-h-[620px] overflow-hidden rounded-[30px] bg-surface md:min-h-[calc(100vh-170px)]">
            <RecipeImage src={heroRecipe.imageUrl} alt={heroRecipe.title} priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background/92 via-background/54 to-transparent md:inset-y-0 md:left-0 md:h-auto md:w-3/5 md:bg-gradient-to-r md:from-background/92 md:via-background/54 md:to-transparent" />
            <div className="absolute bottom-8 left-6 max-w-2xl md:bottom-14 md:left-14">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Receita em destaque</p>
              <h2 className="mt-5 font-serif text-5xl leading-[0.96] text-ink md:text-7xl">{heroRecipe.title}</h2>
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

      <section className="bg-[#0c0c0e] py-16">
        <div className="container-page">
          <SectionTitle eyebrow="Categorias" title="Escolha por vontade." />
          <div className="flex gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
            {categoryTiles.map((category) => (
              <Link key={category.label} href={category.href} className="group relative min-h-[280px] min-w-[240px] overflow-hidden rounded-[28px] bg-surface md:min-w-0">
                <RecipeImage src={category.image} alt={category.label} sizes="(min-width: 768px) 20vw, 70vw" className="object-cover transition duration-700 group-hover:scale-[1.015]" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/86 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="font-serif text-3xl text-ink">{category.label}</span>
                  <span className="mt-1 block text-sm text-muted">Explorar</span>
                </div>
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
              <p className="eyebrow mb-3">Receita da semana</p>
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
          <h2 className="max-w-3xl font-serif text-5xl leading-none text-ink">Comece a salvar suas receitas favoritas.</h2>
          <Link href="/register" className="button-primary mt-8">
            Criar conta
          </Link>
        </div>
      </section>
    </main>
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
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
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
