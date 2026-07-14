import Link from "next/link";
import { ArrowRight, Bookmark, Clock3, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { SearchBar } from "@/components/recipes/search-bar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredRecipes, latestRecipes, popularRecipes, categories] = await Promise.all([
    prisma.recipe.findMany({
      where: { published: true, featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.recipe.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.recipe.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { favorites: { _count: "desc" } },
      take: 3
    }),
    prisma.category.findMany({
      include: { _count: { select: { recipes: true } } },
      orderBy: { name: "asc" },
      take: 8
    })
  ]);

  const heroRecipe = featuredRecipes[0] ?? latestRecipes[0];

  return (
    <main>
      <section className="container-page grid gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">
            Descobrir, salvar e cozinhar
          </p>
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.96] tracking-[-0.04em] text-[#F5F5F3] sm:text-6xl lg:text-7xl">
            Receitas que valem o seu tempo.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#B8B8BE] sm:text-lg">
            Uma seleção direta, bonita e prática para encontrar o que cozinhar sem transformar a escolha em outra tarefa.
          </p>

          <form action="/recipes" className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7BAE7F]" />
              <SearchBar />
            </div>
            <button className="button-primary min-h-12 px-6" type="submit">
              Buscar receitas
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#9A9AA0]">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#7BAE7F]" />
              Filtre pelo tempo
            </span>
            <span className="inline-flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-[#7BAE7F]" />
              Salve para depois
            </span>
          </div>
        </div>

        {heroRecipe ? (
          <Link href={`/recipes/${heroRecipe.slug}`} className="group block">
            <article className="overflow-hidden rounded-[22px] border border-white/10 bg-[#141417]">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1D1D22]">
                <RecipeImage
                  src={heroRecipe.imageUrl}
                  alt={heroRecipe.title}
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#96C59A]">
                    Receita da semana · {heroRecipe.category.name}
                  </p>
                  <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-white sm:text-4xl">
                    {heroRecipe.title}
                  </h2>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Ver receita
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ) : null}
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="mb-7 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Categorias</p>
            <h2 className="mt-2 font-serif text-3xl text-[#F5F5F3] sm:text-4xl">Escolha pelo que combina com hoje.</h2>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/recipes?category=${category.slug}`}
              className="min-w-[180px] rounded-[16px] border border-white/10 bg-[#141417] px-5 py-5 transition hover:border-[#7BAE7F]/40"
            >
              <strong className="block text-[#F5F5F3]">{category.name}</strong>
              <span className="mt-1 block text-sm text-[#9A9AA0]">{category._count.recipes} receitas</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Mais salvas</p>
            <h2 className="mt-2 font-serif text-3xl text-[#F5F5F3] sm:text-4xl">As favoritas da comunidade.</h2>
          </div>
          <Link href="/recipes" className="hidden items-center gap-2 text-sm font-semibold text-[#F5F5F3] sm:inline-flex">
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {popularRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Novidades</p>
            <h2 className="mt-2 font-serif text-3xl text-[#F5F5F3] sm:text-4xl">Receitas adicionadas recentemente.</h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="container-page pb-20 pt-8">
        <div className="rounded-[20px] border border-white/10 bg-[#141417] px-6 py-10 sm:px-10 sm:py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7BAE7F]">Sua cozinha</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#F5F5F3] sm:text-4xl">
              Guarde favoritas, publique receitas e volte de onde parou.
            </h2>
            <p className="mt-4 leading-7 text-[#A8A8AE]">
              Crie uma conta para transformar a biblioteca em um espaço realmente seu.
            </p>
            <Link href="/register" className="button-primary mt-7 w-fit">
              Criar conta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
