import { RecipeForm } from "@/components/admin/recipe-form";
import { getCategories } from "@/lib/queries";

export default async function NewRecipePage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-2">Nova receita</p>
        <h1 className="font-serif text-5xl text-ink">Criar receita</h1>
      </div>
      <RecipeForm categories={categories} />
    </div>
  );
}
