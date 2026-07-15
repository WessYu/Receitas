import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CookingMode } from "@/components/recipes/cooking-mode";

export const dynamic = "force-dynamic";

export default async function CookingModePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const recipe = await prisma.recipe.findFirst({
    where: { slug, published: true },
    include: {
      ingredients: {
        orderBy: { order: "asc" },
        select: { id: true, amount: true, name: true }
      },
      steps: { orderBy: { order: "asc" } }
    }
  });

  if (!recipe) notFound();

  return (
    <CookingMode
      slug={recipe.slug}
      title={recipe.title}
      servings={recipe.servings}
      ingredients={recipe.ingredients.map((ingredient) => ({
        id: ingredient.id,
        amount: ingredient.amount,
        name: ingredient.name
      }))}
      steps={recipe.steps.map((step) => ({
        id: step.id,
        order: step.order,
        content: step.content
      }))}
    />
  );
}
