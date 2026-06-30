import Link from "next/link";
import { BookOpen, FolderTree, Plus, UsersRound } from "lucide-react";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [recipeCount, userCount, categoryCount, latestRecipes] = await Promise.all([
    prisma.recipe.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.recipe.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-2">Painel admin</p>
          <h1 className="font-serif text-5xl">Controle editorial</h1>
        </div>
        <Link href="/admin/recipes/new" className="button-primary w-fit">
          <Plus className="h-4 w-4" />
          Nova receita
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard label="Receitas" value={recipeCount} icon={BookOpen} />
        <DashboardCard label="Usuarios" value={userCount} icon={UsersRound} />
        <DashboardCard label="Categorias" value={categoryCount} icon={FolderTree} />
      </div>
      <section className="mt-8 rounded-lg border border-ink/10 bg-white/75 p-6 shadow-sm">
        <h2 className="mb-5 font-serif text-3xl">Ultimas receitas</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs uppercase text-ink/45">
              <tr>
                <th className="py-3">Titulo</th>
                <th className="py-3">Categoria</th>
                <th className="py-3">Status</th>
                <th className="py-3">Tempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {latestRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="py-4 font-semibold">{recipe.title}</td>
                  <td className="py-4 text-ink/60">{recipe.category.name}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive">
                      {recipe.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="py-4 text-ink/60">{recipe.prepTime} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
