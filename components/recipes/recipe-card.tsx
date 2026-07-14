import Link from "next/link";
import { Clock3 } from "lucide-react";
import type { Category, Recipe } from "@prisma/client";
import { RecipeImage } from "@/components/recipes/recipe-image";

type RecipeCardProps = {
  recipe: Recipe & { category: Category };
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-surface">
        <RecipeImage
          src={recipe.imageUrl}
          alt={recipe.title}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{recipe.category.name}</p>
        <h3 className="mt-2 font-serif text-3xl leading-none text-ink">{recipe.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{recipe.description}</p>
        <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-olive" />
            {recipe.prepTime} min
          </span>
          <span className="text-gold" aria-label="Avaliacao cinco estrelas">
            ★★★★★
          </span>
        </div>
      </div>
    </Link>
  );
}
