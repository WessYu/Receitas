import Link from "next/link";
import type { Category, Recipe } from "@prisma/client";
import { RecipeImage } from "@/components/recipes/recipe-image";
import type { RecipeCompatibility } from "@/lib/pantry";

type RecipeCardProps = {
  recipe: Recipe & { category: Category };
  priority?: boolean;
  compatibility?: RecipeCompatibility | null;
};

function getScoreTone(score: number) {
  if (score === 100) return "border-olive bg-olive text-background";
  if (score >= 75) return "border-olive/40 bg-olive/10 text-olive";
  return "border-gold/40 bg-gold/10 text-gold";
}

export function RecipeCard({ recipe, priority = false, compatibility }: RecipeCardProps) {
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
        {compatibility ? (
          <span className={`absolute left-4 top-4 rounded-full border px-3 py-1.5 text-xs font-bold shadow-soft ${getScoreTone(compatibility.score)}`}>
            {compatibility.score}% compatível
          </span>
        ) : null}
      </div>
      <div className="pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {recipe.category.name} / {recipe.prepTime} min
        </p>
        <h3 className="mt-2 font-serif text-3xl leading-none text-ink">{recipe.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{recipe.description}</p>
        {compatibility ? (
          <div className="mt-4 rounded-2xl border border-border bg-surface p-4 transition duration-300 group-hover:border-white/15 group-hover:bg-elevated">
            <p className="text-sm font-semibold text-ink">
              Você já possui {compatibility.matchedCount} de {compatibility.totalCount} ingredientes.
            </p>
            {compatibility.missingIngredients.length ? (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Faltam</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {compatibility.missingIngredients.slice(0, 4).map((ingredient) => (
                    <span key={ingredient} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">
                      {ingredient}
                    </span>
                  ))}
                  {compatibility.missingIngredients.length > 4 ? (
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">
                      +{compatibility.missingIngredients.length - 4}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm font-semibold text-olive">Você pode cozinhar agora.</p>
            )}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
