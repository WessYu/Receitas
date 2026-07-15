import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, FolderTree, MessageCircle, Plus, Star, TrendingUp, UsersRound } from "lucide-react";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const [
    recipeCount,
    publishedCount,
    pendingCount,
    userCount,
    categoryCount,
    commentCount,
    favoriteCount,
    weeklyRecipes,
    topRecipes,
    latestRecipes,
    latestComments
  ] = await Promise.all([
    prisma.recipe.count(),
    prisma.recipe.count({ where: { published: true } }),
    prisma.recipe.count({ where: { published: false } }),
    prisma.user.count(),
    prisma.category.count(),
    prisma.comment.count(),
    prisma.favorite.count(),
    prisma.recipe.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.recipe.findMany({
      include: {
        category: true,
        _count: { select: { comments: true, favorites: true } }
      },
      orderBy: [{ favorites: { _count: "desc" } }, { comments: { _count: "desc" } }],
      take: 5
    }),
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
          <p className="eyebrow mb-2">Savor OS</p>
          <h1 className="font-serif text-6xl leading-none text-ink">Dashboard</h1>
          <p className="mt-4 text-muted">Operação editorial, conteúdo e sinais da comunidade em um só lugar.</p>
        </div>
        <Link href="/admin/recipes/new" className="button-primary w-fit">
          <Plus className="h-4 w-4" />
          Nova receita
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard label="Receitas" value={recipeCount} icon={BookOpen} />
        <DashboardCard label="Usuários" value={userCount} icon={UsersRound} />
        <DashboardCard label="Categorias" value={categoryCount} icon={FolderTree} />
        <DashboardCard label="Comentários" value={commentCount} icon={MessageCircle} />
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-4">
        <InsightCard label="Publicadas" value={publishedCount} detail={`${pendingCount} em revisão`} icon={Star} />
        <InsightCard label="Receitas salvas" value={favoriteCount} detail="favoritos totais" icon={Activity} />
        <InsightCard label="Receitas da semana" value={weeklyRecipes} detail="criadas nos últimos 7 dias" icon={TrendingUp} />
        <InsightCard label="Analytics" value={topRecipes.length} detail="receitas com sinais de interesse" icon={Activity} />
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[28px] bg-surface p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Analytics</p>
              <h2 className="font-serif text-4xl text-ink">Receitas mais vistas</h2>
            </div>
            <span className="rounded-full bg-elevated px-3 py-1 text-xs text-muted">engajamento</span>
          </div>
          <div className="grid gap-3">
            {topRecipes.map((recipe, index) => (
              <Link key={recipe.id} href={`/recipes/${recipe.slug}`} className="grid grid-cols-[48px_1fr_auto] items-center gap-4 rounded-2xl bg-elevated p-4 transition duration-300 hover:bg-border">
                <span className="font-serif text-3xl text-muted">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-semibold text-ink">{recipe.title}</p>
                  <p className="mt-1 text-sm text-muted">{recipe.category.name}</p>
                </div>
                <span className="text-sm text-muted">
                  {recipe._count.favorites + recipe._count.comments} sinais
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-surface p-6">
          <p className="eyebrow mb-2">Semana</p>
          <h2 className="font-serif text-4xl text-ink">Pipeline editorial</h2>
          <div className="mt-6 grid gap-3">
            {latestRecipes.map((recipe) => (
              <div key={recipe.id} className="rounded-2xl bg-elevated p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{recipe.title}</p>
                    <p className="mt-1 text-sm text-muted">{recipe.category.name} · {recipe.author?.name ?? "Admin"}</p>
                  </div>
                  <span className="rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive">
                    {recipe.published ? "Publicado" : "Em revisão"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] bg-surface p-6">
        <h2 className="mb-5 font-serif text-4xl text-ink">Comentários recentes</h2>
        {latestComments.length ? (
          <div className="grid gap-3">
            {latestComments.map((comment) => (
              <div key={comment.id} className="rounded-2xl bg-elevated p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                  <strong className="text-ink">{comment.user.name}</strong>
                  <span className="text-disabled">em</span>
                  <span className="font-semibold text-olive">{comment.recipe.title}</span>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-muted">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Ainda não há comentários publicados.</p>
        )}
      </section>
    </div>
  );
}

function InsightCard({ label, value, detail, icon: Icon }: { label: string; value: number; detail: string; icon: LucideIcon }) {
  return (
    <div className="rounded-[24px] bg-surface p-5">
      <Icon className="h-5 w-5 text-olive" />
      <p className="mt-5 text-sm text-muted">{label}</p>
      <strong className="mt-1 block font-serif text-4xl text-ink">{value}</strong>
      <p className="mt-2 text-xs text-disabled">{detail}</p>
    </div>
  );
}
