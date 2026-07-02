import Link from "next/link";
import { BookOpen, FolderTree, MessageCircle, Plus, Star, UsersRound } from "lucide-react";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [recipeCount, publishedCount, pendingCount, userCount, categoryCount, commentCount, favoriteCount, latestRecipes, latestComments] = await Promise.all([
    prisma.recipe.count(),
    prisma.recipe.count({ where: { published: true } }),
    prisma.recipe.count({ where: { published: false } }),
    prisma.user.count(),
    prisma.category.count(),
    prisma.comment.count(),
    prisma.favorite.count(),
    prisma.recipe.findMany({
      include: {
        category: true,
        author: { select: { name: true } },
        _count: { select: { comments: true, favorites: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.comment.findMany({
      include: {
        user: { select: { name: true } },
        recipe: { select: { title: true, slug: true } }
      },
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
        <DashboardCard label="Publicadas" value={publishedCount} icon={Star} />
        <DashboardCard label="Em revisão" value={pendingCount} icon={BookOpen} />
        <DashboardCard label="Usuários" value={userCount} icon={UsersRound} />
        <DashboardCard label="Categorias" value={categoryCount} icon={FolderTree} />
        <DashboardCard label="Comentários" value={commentCount} icon={MessageCircle} />
        <DashboardCard label="Receitas salvas" value={favoriteCount} icon={Star} />
      </div>
      <section className="mt-8 rounded-lg border border-ink/10 bg-white/75 p-6 shadow-sm">
        <h2 className="mb-5 font-serif text-3xl">Últimas receitas</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase text-ink/45">
              <tr>
                <th className="py-3">Título</th>
                <th className="py-3">Categoria</th>
                <th className="py-3">Autor</th>
                <th className="py-3">Status</th>
                <th className="py-3">Interações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {latestRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="py-4 font-semibold">{recipe.title}</td>
                  <td className="py-4 text-ink/60">{recipe.category.name}</td>
                  <td className="py-4 text-ink/60">{recipe.author?.name ?? "Admin"}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive">
                      {recipe.published ? "Publicado" : "Em revisão"}
                    </span>
                  </td>
                  <td className="py-4 text-ink/60">
                    {recipe._count.favorites} salvas · {recipe._count.comments} comentários
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-8 rounded-lg border border-ink/10 bg-white/75 p-6 shadow-sm">
        <h2 className="mb-5 font-serif text-3xl">Comentários recentes</h2>
        {latestComments.length ? (
          <div className="grid gap-3">
            {latestComments.map((comment) => (
              <div key={comment.id} className="rounded-md bg-porcelain/80 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                  <strong>{comment.user.name}</strong>
                  <span className="text-ink/45">em</span>
                  <span className="font-semibold text-olive">{comment.recipe.title}</span>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-ink/65">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/55">Ainda não há comentários publicados.</p>
        )}
      </section>
    </div>
  );
}
