import Link from "next/link";
import { Edit, Plus } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { prisma } from "@/lib/prisma";
import { formatDifficulty } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminRecipesPage() {
  const recipes = await prisma.recipe.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-2">Receitas</p>
          <h1 className="font-serif text-5xl">Gerenciar receitas</h1>
        </div>
        <Link href="/admin/recipes/new" className="button-primary w-fit">
          <Plus className="h-4 w-4" />
          Criar receita
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-ink/10 bg-white/75 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-porcelain text-xs uppercase text-ink/45">
              <tr>
                <th className="px-5 py-4">Titulo</th>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4">Dificuldade</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="px-5 py-4 font-semibold">{recipe.title}</td>
                  <td className="px-5 py-4 text-ink/60">{recipe.category.name}</td>
                  <td className="px-5 py-4 text-ink/60">{formatDifficulty(recipe.difficulty)}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive">
                      {recipe.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/recipes/${recipe.id}/edit`} className="button-secondary px-3 py-2">
                        <Edit className="h-4 w-4" />
                        Editar
                      </Link>
                      <ConfirmDeleteButton id={recipe.id} type="recipe" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
