import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { SearchBar } from "@/components/recipes/search-bar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredRecipes, categories] = await Promise.all([
    prisma.recipe.findMany({
      where: { published: true, featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.category.findMany({
      include: { _count: { select: { recipes: true } } },
      orderBy: { name: "asc" },
      take: 6
    })
  ]);
  const heroRecipe = featuredRecipes[0];

  return (
    <div>
      <section className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-muted">Mise</p>
          <h1 className="font-serif text-6xl leading-[0.9] text-ink md:text-8xl">Cook beautifully.</h1>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-9 text-muted md:text-2xl">
            Discover recipes crafted for people who love cooking.
          </p>
          <form action="/recipes" className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-[1fr_auto]">
            <SearchBar />
            <button className="button-primary" type="submit">
              Pesquisar
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="relative mt-16 aspect-[16/9] min-h-[420px] overflow-hidden rounded-[28px] bg-surface shadow-soft">
          <RecipeImage
            src={
              heroRecipe?.imageUrl ??
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=90"
            }
            alt={heroRecipe?.title ?? "Mise hero recipe"}
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          {heroRecipe ? (
            <Link href={`/recipes/${heroRecipe.slug}`} className="absolute bottom-6 left-6 max-w-xl md:bottom-10 md:left-10">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-olive">{heroRecipe.category.name}</span>
              <h2 className="mt-3 font-serif text-4xl leading-none text-ink md:text-6xl">{heroRecipe.title}</h2>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Editorial</p>
            <h2 className="font-serif text-4xl text-ink">Selected recipes</h2>
          </div>
          <Link href="/recipes" className="button-secondary w-fit">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {featuredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/recipes?category=${category.slug}`} className="bg-surface p-6 transition duration-300 hover:bg-elevated">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{category._count.recipes} receitas</span>
              <span className="mt-3 block font-serif text-3xl text-ink">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
