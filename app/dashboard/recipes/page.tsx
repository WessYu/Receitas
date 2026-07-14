import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function UserRecipesPage() {
  const user = await requireUser();
  const recipes = await prisma.recipe.findMany({
    where: { authorId: user.id },
    include: {
      category: true,
      _count: { select: { comments: true, favorites: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="container-page py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Minha cozinha</p>
          <h1 className="font-serif text-5xl text-ink">Minhas receitas</h1>
          <p className="mt-4 max-w-2xl text-muted">Acompanhe o que você enviou e o que já foi publicado.</p>
        </div>
        <Link href="/dashboard/recipes/new" className="button-primary w-fit">
          Enviar receita
        </Link>
      </div>

      {recipes.length ? (
        <div className="overflow-hidden rounded-lg border border-border bg-surface/85 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-elevated text-xs uppercase text-disabled">
                <tr>
                  <th className="px-5 py-4">Receita</th>
                  <th className="px-5 py-4">Categoria</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Interações</th>
                  <th className="px-5 py-4 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recipes.map((recipe) => (
                  <tr key={recipe.id}>
                    <td className="px-5 py-4 font-semibold text-ink">{recipe.title}</td>
                    <td className="px-5 py-4 text-muted">{recipe.category.name}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-olive/20 bg-olive/10 px-3 py-1 text-xs font-semibold text-olive">
                        {recipe.published ? "Publicado" : "Em revisão"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {recipe._count.favorites} salvas · {recipe._count.comments} comentários
                    </td>
                    <td className="px-5 py-4 text-right">
                      {recipe.published ? (
                        <Link href={`/recipes/${recipe.slug}`} className="button-secondary px-3 py-2">
                          Ver
                        </Link>
                      ) : (
                        <span className="text-disabled">Aguardando</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="Nenhuma receita enviada" description="Envie uma receita com foto e passo a passo para compartilhar com todos." />
      )}
    </section>
  );
}
