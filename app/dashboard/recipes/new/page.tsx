import { RecipeForm } from "@/components/admin/recipe-form";
import { getCategories } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NewUserRecipePage() {
  await requireUser();
  const categories = await getCategories();

  return (
    <section className="container-page py-12">
      <div className="mb-8">
        <p className="eyebrow mb-2">Minha cozinha</p>
        <h1 className="font-serif text-5xl">Enviar receita</h1>
        <p className="mt-4 max-w-2xl text-ink/60">
          Capriche na foto, nos ingredientes e no passo a passo. A receita fica em revisão até ser publicada pelo admin.
        </p>
      </div>
      <RecipeForm categories={categories} mode="user" />
    </section>
  );
}
