import Link from "next/link";
import { Clock3, UsersRound } from "lucide-react";
import type { Category, Difficulty, Recipe } from "@prisma/client";
import { formatDifficulty } from "@/lib/utils";
import { RecipeImage } from "@/components/recipes/recipe-image";

type RecipeCardProps = {
  recipe: Recipe & { category: Category };
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group overflow-hidden rounded-lg border border-ink/10 bg-white/75 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        <RecipeImage
          src={recipe.imageUrl}
          alt={recipe.title}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-porcelain/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
          {recipe.category.name}
        </span>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3 text-xs font-medium text-ink/55">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />
            {recipe.prepTime} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersRound className="h-4 w-4" />
            {recipe.servings}
          </span>
          <span>{formatDifficulty(recipe.difficulty as Difficulty)}</span>
        </div>
        <h3 className="font-serif text-2xl leading-tight text-ink">{recipe.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">{recipe.description}</p>
      </div>
    </Link>
  );
}
