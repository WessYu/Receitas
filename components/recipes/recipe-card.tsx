import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Category, Difficulty, Recipe } from "@prisma/client";
import { formatDifficulty } from "@/lib/utils";
import { RecipeImage } from "@/components/recipes/recipe-image";

type RecipeCardProps = {
  recipe: Recipe & { category: Category };
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block">
      <article>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-[#1D1D22]">
          <RecipeImage
            src={recipe.imageUrl}
            alt={recipe.title}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" />
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            {recipe.category.name}
          </span>
          <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition group-hover:bg-[#7BAE7F] group-hover:text-[#09090B]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="pt-4">
          <div className="flex items-center gap-3 text-xs font-medium text-[#9A9AA0]">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#7BAE7F]" />
              {recipe.prepTime} min
            </span>
            <span>·</span>
            <span>{formatDifficulty(recipe.difficulty as Difficulty)}</span>
          </div>

          <h3 className="mt-2 font-serif text-[26px] leading-[1.08] text-[#F5F5F3] transition group-hover:text-white">
            {recipe.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#A8A8AE]">
            {recipe.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
