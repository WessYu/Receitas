import Link from "next/link";
import { ArrowRight, Bookmark, Clock3, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { SearchBar } from "@/components/recipes/search-bar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredRecipes, categories] = await Promise.all([
    prisma.recipe.findMany({
      where: { published: true, featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.category.findMany({
      include: { _count: { select: { recipes: true } } },
      orderBy: { name: "asc" },
      take: 6
    })
  ]);

  return (
    <div>
      <section className="container-page grid min-h-[calc(100vh-80px)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow mb-5">Cozinha autoral em casa</p>
          <h1 className="max-w-3xl font-serif text-6xl leading-[0.96] text-ink md:text-7xl">
            Receitas claras, bonitas e salvas no seu ritmo.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/65">
            Descubra pratos realistas para a semana, filtre por tempo ou ingrediente e mantenha seus favoritos em uma área privada.
          </p>
          <form action="/recipes" className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-[1fr_auto]">
            <SearchBar />
            <button className="button-primary" type="submit">
              Buscar
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-8 grid gap-3 text-sm text-ink/65 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-olive" />
              Filtros rápidos
            </span>
            <span className="inline-flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-olive" />
              Favoritos privados
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-olive" />
              Curadoria editorial
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-ink/10 bg-ink p-5 text-porcelain shadow-soft">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="relative">
            <p className="text-sm font-medium text-porcelain/60">Receita do momento</p>
            <h2 className="mt-4 font-serif text-5xl leading-none">
              {featuredRecipes[0]?.title ?? "Risoto de limão siciliano"}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-porcelain/70">
              {featuredRecipes[0]?.description ??
                "Uma base cremosa, acidez elegante e finalização simples para jantar sem pressa."}
            </p>
            <div
              className="mt-8 aspect-[4/3] overflow-hidden rounded-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80)"
              }}
            />
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Destaques</p>
            <h2 className="font-serif text-4xl">Receitas para abrir o apetite</h2>
          </div>
          <Link href="/recipes" className="button-secondary w-fit">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="rounded-lg border border-ink/10 bg-white/60 p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-2">Categorias</p>
              <h2 className="font-serif text-4xl">Escolha pelo momento</h2>
            </div>
            <Link href="/register" className="button-primary w-fit">
              Criar conta
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/recipes?category=${category.slug}`}
                className="rounded-md border border-ink/10 bg-porcelain px-5 py-4 transition hover:-translate-y-0.5 hover:border-olive/40"
              >
                <span className="font-semibold">{category.name}</span>
                <span className="mt-1 block text-sm text-ink/55">{category._count.recipes} receitas</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
