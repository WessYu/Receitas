import { notFound } from "next/navigation";
import { RecipeForm } from "@/components/admin/recipe-form";
import { getCategories, recipeInclude } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [recipe, categories] = await Promise.all([
    prisma.recipe.findUnique({
      where: { id },
      include: recipeInclude
    }),
    getCategories()
  ]);

  if (!recipe) notFound();

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-2">Editar receita</p>
        <h1 className="font-serif text-5xl">{recipe.title}</h1>
      </div>
      <RecipeForm categories={categories} recipe={recipe} />
    </div>
  );
}
