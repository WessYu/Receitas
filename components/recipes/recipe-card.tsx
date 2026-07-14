import Link from "next/link";
import type { Category, Recipe } from "@prisma/client";
import { RecipeImage } from "@/components/recipes/recipe-image";

type RecipeCardProps = {
  recipe: Recipe & { category: Category };
  priority?: boolean;
};

export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-surface">
        <RecipeImage
          src={recipe.imageUrl}
          alt={recipe.title}
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
        />
      </div>
      <div className="pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {recipe.category.name} / {recipe.prepTime} min
        </p>
        <h3 className="mt-2 font-serif text-3xl leading-none text-ink">{recipe.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{recipe.description}</p>
      </div>
    </Link>
  );
}
