import { SlidersHorizontal } from "lucide-react";
import type { Category } from "@prisma/client";
import { SearchBar } from "@/components/recipes/search-bar";

type FilterBarProps = {
  categories: Category[];
  params: {
    q?: string;
    category?: string;
    difficulty?: string;
    maxTime?: string;
    ingredient?: string;
  };
};

export function FilterBar({ categories, params }: FilterBarProps) {
  return (
    <form className="rounded-[28px] bg-surface p-4" action="/recipes">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <SlidersHorizontal className="h-4 w-4 text-olive" />
        Filtros
      </div>
      <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_auto]">
        <SearchBar defaultValue={params.q} />
        <select className="field" name="category" defaultValue={params.category ?? ""} aria-label="Categoria">
          <option value="">Categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select className="field" name="difficulty" defaultValue={params.difficulty ?? ""} aria-label="Dificuldade">
          <option value="">Dificuldade</option>
          <option value="EASY">Facil</option>
          <option value="MEDIUM">Media</option>
          <option value="HARD">Avancada</option>
        </select>
        <input className="field" name="maxTime" defaultValue={params.maxTime ?? ""} placeholder="Ate min" type="number" min="1" />
        <input className="field" name="ingredient" defaultValue={params.ingredient ?? ""} placeholder="Ingrediente" />
        <button className="button-primary whitespace-nowrap" type="submit">
          Aplicar
        </button>
      </div>
    </form>
  );
}
