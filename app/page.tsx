import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  ChefHat,
  Clock3,
  Search,
  Sparkles,
  Star,
  UtensilsCrossed
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { SearchBar } from "@/components/recipes/search-bar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredRecipes, categories, recipeCount] = await Promise.all([
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
    }),
    prisma.recipe.count({ where: { published: true } })
  ]);

  const heroRecipe = featuredRecipes[0];

  return (
    <main className="overflow-hidden">
      <section className="container-page relative grid min-h-[calc(100vh-80px)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-medium text-[#CFCFD3] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-[#C89B5B]" />
            Uma cozinha digital para quem aprecia detalhes
          </div>

          <h1 className="max-w-4xl font-serif text-6xl leading-[0.92] tracking-[-0.045em] text-[#F8F8F5] sm:text-7xl lg:text-[88px]">
            Cozinhe com <span className="italic text-[#7BAE7F]">intenção.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-[#9A9AA0] sm:text-lg">
            Descubra receitas bem curadas, encontre pratos pelos ingredientes que você já tem e guarde seus favoritos em um espaço feito para inspirar.
          </p>

          <form action="/recipes" className="mt-9 grid max-w-2xl gap-3 rounded-[22px] border border-white/10 bg-white/[0.035] p-2 backdrop-blur-xl sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7BAE7F]" />
              <SearchBar />
            </div>
            <button className="button-primary min-h-12 px-7" type="submit">
              Explorar receitas
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 text-sm text-[#9A9AA0]">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#7BAE7F]" />
              Filtros rápidos
            </span>
            <span className="inline-flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-[#7BAE7F]" />
              Favoritos privados
            </span>
            <span className="inline-flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-[#7BAE7F]" />
              Receitas autorais
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-12 -z-10 rounded-full bg-[#7BAE7F]/10 blur-3xl" />
          <article className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#141417] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#1D1D22]">
              <RecipeImage
                src={
                  heroRecipe?.imageUrl ??
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Banana_pancakes_Gili_Trawangan.JPG/1280px-Banana_pancakes_Gili_Trawangan.JPG"
                }
                alt={heroRecipe?.title ?? "Receita em destaque"}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

              <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xl">
                  Receita do momento
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs text-white backdrop-blur-xl">
                  <Star className="h-3.5 w-3.5 fill-[#C89B5B] text-[#C89B5B]" />
                  Curadoria
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#96C59A]">
                  {heroRecipe?.category?.name ?? "Café da manhã"}
                </p>
                <h2 className="max-w-xl font-serif text-4xl leading-none text-white sm:text-5xl">
                  {heroRecipe?.title ?? "Panquecas de banana e aveia"}
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
                  {heroRecipe?.description ??
                    "Maciez natural, doçura na medida e preparo rápido para um café da manhã sem complicação."}
                </p>
                {heroRecipe && (
                  <Link href={`/recipes/${heroRecipe.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:gap-3">
                    Ver receita
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.018]">
        <div className="container-page grid gap-8 py-8 sm:grid-cols-3">
          <div>
            <strong className="font-serif text-3xl text-[#F8F8F5]">{recipeCount}+</strong>
            <p className="mt-1 text-sm text-[#9A9AA0]">receitas publicadas</p>
          </div>
          <div>
            <strong className="font-serif text-3xl text-[#F8F8F5]">{categories.length}</strong>
            <p className="mt-1 text-sm text-[#9A9AA0]">categorias para explorar</p>
          </div>
          <div>
            <strong className="font-serif text-3xl text-[#F8F8F5]">100%</strong>
            <p className="mt-1 text-sm text-[#9A9AA0]">experiência personalizada</p>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Seleção da casa</p>
            <h2 className="max-w-2xl font-serif text-4xl leading-tight text-[#F8F8F5] sm:text-5xl">
              Receitas para transformar o cotidiano.
            </h2>
          </div>
          <Link href="/recipes" className="button-secondary w-fit">
            Ver biblioteca completa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="noir-card">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="noir-panel relative overflow-hidden p-7 sm:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#7BAE7F]/10 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C89B5B]/25 bg-[#C89B5B]/10 text-[#C89B5B]">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <p className="eyebrow mb-3">Escolha pelo momento</p>
              <h2 className="font-serif text-4xl leading-tight text-[#F8F8F5] sm:text-5xl">
                Sua próxima receita começa aqui.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-[#9A9AA0]">
                Do café da manhã ao jantar especial, encontre inspiração sem perder tempo.
              </p>
              <Link href="/register" className="button-primary mt-7 w-fit">
                Criar minha conta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/recipes?category=${category.slug}`}
                  className="group rounded-[20px] border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#7BAE7F]/35 hover:bg-white/[0.055]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-[#F8F8F5]">{category.name}</span>
                      <span className="mt-1 block text-sm text-[#9A9AA0]">{category._count.recipes} receitas</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#7BAE7F] transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
