import Link from "next/link";
import { Bookmark, Clock3, UsersRound } from "lucide-react";
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
      className="group block overflow-hidden rounded-[18px] border border-white/10 bg-[#141417] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1D1D22]">
        <RecipeImage
          src={recipe.imageUrl}
          alt={recipe.title}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.025]"
        />
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          {recipe.category.name}
        </span>
        <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md">
          <Bookmark className="h-4 w-4" />
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#B8B8BE]">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-[#7BAE7F]" />
            {recipe.prepTime} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersRound className="h-3.5 w-3.5 text-[#7BAE7F]" />
            {recipe.servings} porções
          </span>
          <span>{formatDifficulty(recipe.difficulty as Difficulty)}</span>
        </div>

        <h3 className="font-serif text-[26px] leading-[1.08] text-[#F8F8F5]">
          {recipe.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#A8A8AE]">
          {recipe.description}
        </p>
      </div>
    </Link>
  );
}
