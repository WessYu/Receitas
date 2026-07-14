import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { recipes: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-2">Categorias</p>
        <h1 className="font-serif text-5xl text-ink">Organizar biblioteca</h1>
      </div>
      <CategoryForm />
      <div className="mt-6 grid gap-3">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface/85 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <strong className="text-ink">{category.name}</strong>
              <p className="mt-1 text-sm text-muted">{category._count.recipes} receitas vinculadas</p>
            </div>
            <ConfirmDeleteButton id={category.id} type="category" />
          </div>
        ))}
      </div>
    </div>
  );
}
