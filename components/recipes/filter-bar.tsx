import { SlidersHorizontal } from "lucide-react";
import type { Category } from "@prisma/client";
import { SearchBar } from "@/components/recipes/search-bar";

type FilterBarProps = {
  categories: Category[];
  params: {
    q?: string;
    category?: string;
    gourmet?: string;
    difficulty?: string;
    maxTime?: string;
    ingredient?: string;
    sort?: string;
    perPage?: string;
  };
};

export function FilterBar({ categories, params }: FilterBarProps) {
  return (
    <form className="rounded-[28px] bg-surface p-4" action="/recipes">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <SlidersHorizontal className="h-4 w-4 text-olive" />
        Filtros
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.35fr_0.95fr_0.95fr_0.95fr_0.9fr_0.9fr_0.85fr_auto]">
        <SearchBar defaultValue={params.q} />
        <select className="field" name="category" defaultValue={params.category ?? ""} aria-label="Categoria">
          <option value="">Categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select className="field" name="gourmet" defaultValue={params.gourmet === "1" ? "1" : ""} aria-label="Curadoria">
          <option value="">Todas</option>
          <option value="1">Receitas gourmet</option>
        </select>
        <select className="field" name="difficulty" defaultValue={params.difficulty ?? ""} aria-label="Dificuldade">
          <option value="">Dificuldade</option>
          <option value="EASY">Fácil</option>
          <option value="MEDIUM">Média</option>
          <option value="HARD">Avançada</option>
        </select>
        <label className="sr-only" htmlFor="maxTime">
          Tempo máximo em minutos
        </label>
        <input id="maxTime" className="field" name="maxTime" defaultValue={params.maxTime ?? ""} placeholder="Até min" type="number" min="1" />
        <label className="sr-only" htmlFor="ingredient">
          Ingrediente
        </label>
        <input id="ingredient" className="field" name="ingredient" defaultValue={params.ingredient ?? ""} placeholder="Ingrediente" />
        <select className="field" name="sort" defaultValue={params.sort ?? "latest"} aria-label="Ordenação">
          <option value="latest">Recentes</option>
          <option value="viewed">Mais vistas</option>
          <option value="saved">Mais salvas</option>
          <option value="commented">Comentadas</option>
          <option value="fastest">Menor tempo</option>
          <option value="title">A-Z</option>
        </select>
        <select className="field" name="perPage" defaultValue={params.perPage ?? "9"} aria-label="Itens por página">
          <option value="6">6 por página</option>
          <option value="9">9 por página</option>
          <option value="12">12 por página</option>
          <option value="24">24 por página</option>
        </select>
        <button className="button-primary whitespace-nowrap" type="submit">
          Aplicar
        </button>
      </div>
    </form>
  );
}
