import Link from "next/link";
import type { Category, Recipe } from "@prisma/client";
import { ArrowRight, Clock3, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RecipeImage } from "@/components/recipes/recipe-image";

type RecipeWithCategory = Recipe & { category: Category };
type CategoryWithCount = Category & { _count: { recipes: number } };

const categoryVisuals = [
  "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=90"
];

const categoryImageBySlug: Record<string, string> = {
  "cafe-da-manha": "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=90",
  massas: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=90",
  sobremesas: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=90",
  vegetariano: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90",
  "jantar-rapido": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=90"
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredRecipe, categories, popularRecipes, weeklyRecipe, latestRecipes] = await Promise.all([
    prisma.recipe.findFirst({
      where: { published: true, featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.category.findMany({
      include: { _count: { select: { recipes: true } } },
      orderBy: { name: "asc" },
      take: 6
    }),
    prisma.recipe.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: [{ favorites: { _count: "desc" } }, { comments: { _count: "desc" } }, { createdAt: "desc" }],
      take: 5
    }),
    prisma.recipe.findFirst({
      where: { published: true },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    }),
    prisma.recipe.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);

  return (
    <main className="overflow-hidden">
      <section className="container-page flex min-h-[64vh] flex-col items-center justify-center py-24 text-center md:min-h-[70vh] md:py-28">
        <p className="eyebrow mb-6 text-gold">Savor</p>
        <h1 className="max-w-5xl font-serif text-6xl leading-[0.88] text-ink md:text-8xl lg:text-[7.5rem]">
          Receitas que valem o seu tempo.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-muted md:text-xl">
          Descubra pratos com curadoria, salve o que inspira e cozinhe com uma interface calma.
        </p>
        <form
          action="/recipes"
          className="mt-10 flex w-full max-w-2xl items-center gap-3 rounded-full border border-border bg-surface px-4 py-3 transition duration-300 focus-within:border-olive focus-within:bg-elevated"
        >
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            name="q"
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-disabled"
            placeholder="Pesquisar receita..."
          />
          <button className="button-primary hidden px-6 py-2.5 sm:inline-flex" type="submit">
            Buscar
          </button>
        </form>
      </section>

      {featuredRecipe ? <FeaturedRecipe recipe={featuredRecipe} /> : null}

      {categories.length ? (
        <section className="py-24">
          <div className="container-page">
            <SectionHeading eyebrow="Categorias" title="Escolha pela vontade do momento." />
          </div>
          <div className="mt-10 flex gap-4 overflow-x-auto px-4 pb-2 md:container-page md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-6">
            {categories.map((category, index) => (
              <CategoryTile key={category.id} category={category} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      {popularRecipes.length ? (
        <section className="container-page py-16 md:py-24">
          <SectionHeading eyebrow="Mais populares" title="As receitas mais salvas agora." />
          <div className="mt-10 grid gap-x-8 gap-y-12 lg:grid-cols-12">
            {popularRecipes.map((recipe, index) => (
              <EditorialRecipe
                key={recipe.id}
                recipe={recipe}
                priority={index < 2}
                className={index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : "lg:col-span-4"}
                imageClassName={index === 0 ? "aspect-[1.18/1]" : index === 1 ? "aspect-[0.92/1]" : "aspect-[1.1/1]"}
              />
            ))}
          </div>
        </section>
      ) : null}

      {weeklyRecipe ? <RecipeOfTheWeek recipe={weeklyRecipe} /> : null}

      {latestRecipes.length ? (
        <section className="container-page py-20 md:py-28">
          <SectionHeading eyebrow="Novidades" title="Pratos recem-chegados a cozinha." />
          <div className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {latestRecipes.map((recipe, index) => (
              <EditorialRecipe key={recipe.id} recipe={recipe} priority={index < 2} imageClassName="aspect-[1.18/1]" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page py-10 md:py-16">
        <div className="relative overflow-hidden rounded-[32px] bg-surface px-6 py-14 md:px-14 md:py-16">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4 text-gold">Sua cozinha</p>
            <h2 className="font-serif text-5xl leading-[0.95] text-ink md:text-7xl">
              Comece a salvar suas receitas favoritas.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted">
              Monte uma biblioteca pessoal, volte para pratos que funcionam e cozinhe sem pressa.
            </p>
            <Link href="/register" className="button-primary mt-9">
              Criar conta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeaturedRecipe({ recipe }: { recipe: RecipeWithCategory }) {
  return (
    <section className="pb-16 md:pb-24">
      <Link
        href={`/recipes/${recipe.slug}`}
        className="group relative mx-auto block min-h-[620px] w-[min(1500px,calc(100%-24px))] overflow-hidden rounded-[34px] bg-surface md:min-h-[calc(100vh-150px)]"
      >
        <RecipeImage
          src={recipe.imageUrl}
          alt={recipe.title}
          priority
          sizes="100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background/95 via-background/52 to-transparent" />
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-background/70 to-transparent md:block" />
        <div className="absolute bottom-8 left-6 max-w-2xl md:bottom-14 md:left-14 lg:bottom-16 lg:left-16">
          <span className="inline-flex rounded-full border border-white/12 bg-background/55 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-ink backdrop-blur-sm">
            {recipe.category.name}
          </span>
          <h2 className="mt-5 font-serif text-5xl leading-[0.9] text-ink md:text-7xl lg:text-8xl">{recipe.title}</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#E8E8E4] md:text-lg">{recipe.description}</p>
          <span className="button-primary mt-8">
            Ver receita
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </section>
  );
}

function CategoryTile({ category, index }: { category: CategoryWithCount; index: number }) {
  const image = categoryImageBySlug[category.slug] ?? categoryVisuals[index % categoryVisuals.length];

  return (
    <Link
      href={`/recipes?category=${category.slug}`}
      className="group relative h-[310px] min-w-[235px] overflow-hidden rounded-[28px] bg-surface md:min-w-0"
    >
      <RecipeImage
        src={image}
        alt={category.name}
        sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 72vw"
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-black/18" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/88 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <h3 className="font-serif text-3xl leading-none text-ink">{category.name}</h3>
        <p className="mt-2 text-sm text-muted">
          {category._count.recipes} {category._count.recipes === 1 ? "receita" : "receitas"}
        </p>
      </div>
    </Link>
  );
}

function RecipeOfTheWeek({ recipe }: { recipe: RecipeWithCategory }) {
  return (
    <section className="bg-[#0c0c0e] py-24 md:py-32">
      <div className="container-page">
        <p className="eyebrow text-gold">Receita da semana</p>
        <Link href={`/recipes/${recipe.slug}`} className="group mt-8 block">
          <div className="relative aspect-[16/9] min-h-[420px] overflow-hidden rounded-[34px] bg-surface">
            <RecipeImage
              src={recipe.imageUrl}
              alt={recipe.title}
              sizes="100vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/75 to-transparent" />
          </div>
        </Link>
        <div className="mt-9 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <span className="text-sm font-medium uppercase tracking-[0.14em] text-muted">{recipe.category.name}</span>
            <h2 className="mt-4 font-serif text-5xl leading-[0.95] text-ink md:text-6xl">{recipe.title}</h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-muted">{recipe.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Clock3 className="h-4 w-4 text-olive" />
                {recipe.prepTime} min
              </span>
              <Link href={`/recipes/${recipe.slug}`} className="button-primary">
                Cozinhar agora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialRecipe({
  recipe,
  priority,
  className = "",
  imageClassName = "aspect-[1.08/1]"
}: {
  recipe: RecipeWithCategory;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <article className={className}>
      <Link href={`/recipes/${recipe.slug}`} className="group block">
        <div className={`relative overflow-hidden rounded-[28px] bg-surface ${imageClassName}`}>
          <RecipeImage
            src={recipe.imageUrl}
            alt={recipe.title}
            priority={priority}
            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.018]"
          />
        </div>
        <div className="pt-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            {recipe.category.name} · {recipe.prepTime} min
          </p>
          <h3 className="mt-3 font-serif text-3xl leading-none text-ink md:text-4xl">{recipe.title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{recipe.description}</p>
        </div>
      </Link>
    </article>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl leading-[0.98] text-ink md:text-6xl">{title}</h2>
    </div>
  );
}
