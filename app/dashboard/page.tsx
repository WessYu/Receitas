import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Heart, LogOut, Sparkles, Tag } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ProfileForm } from "@/components/auth/profile-form";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { logoutAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [favorites, myRecipes, allMyRecipes] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        recipe: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.recipe.findMany({
      where: { authorId: user.id },
      include: {
        category: true,
        _count: { select: { comments: true, favorites: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.recipe.findMany({
      where: { authorId: user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const lastRecipe = myRecipes[0];
  const categoryCounts = allMyRecipes.reduce<Record<string, number>>((acc, recipe) => {
    acc[recipe.category.name] = (acc[recipe.category.name] ?? 0) + 1;
    return acc;
  }, {});
  const favoriteCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <section className="container-page py-12">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-2">Perfil</p>
          <h1 className="font-serif text-6xl leading-none text-ink">Ola, {user.name.split(" ")[0]}</h1>
          <p className="mt-4 text-muted">Sua cozinha pessoal: criacoes, favoritos e sinais do que voce mais cozinha.</p>
        </div>
        <form action={logoutAction}>
          <button className="button-secondary" type="submit">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <ProfileMetric icon={BookOpen} label="Receitas criadas" value={allMyRecipes.length} />
        <ProfileMetric icon={Heart} label="Favoritas" value={favorites.length} />
        <ProfileMetric icon={Sparkles} label="Publicadas" value={allMyRecipes.filter((recipe) => recipe.published).length} />
        <ProfileMetric icon={Tag} label="Categorias" value={favoriteCategories.length} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <ProfileForm name={user.name} email={user.email} avatarUrl={user.avatarUrl} emailNotifications={user.emailNotifications} />

        <section className="rounded-[28px] bg-surface p-6">
          <h2 className="font-serif text-4xl text-ink">Sua cozinha viva</h2>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl bg-elevated p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Ultima receita</p>
              <p className="mt-2 font-serif text-3xl text-ink">{lastRecipe?.title ?? "Nenhuma receita criada ainda"}</p>
            </div>
            <div className="rounded-2xl bg-elevated p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Categorias preferidas</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {favoriteCategories.length ? (
                  favoriteCategories.map(([name, count]) => (
                    <span key={name} className="rounded-full bg-surface px-3 py-1 text-sm text-ink">
                      {name} · {count}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted">Crie receitas para descobrir seus padroes.</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-[28px] bg-surface p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-4xl text-ink">Minhas receitas</h2>
            <p className="mt-2 text-sm text-muted">Envie receitas para revisao e acompanhe o desempenho editorial.</p>
          </div>
          <Link href="/dashboard/recipes/new" className="button-primary w-fit">
            Enviar receita
          </Link>
        </div>
        {myRecipes.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase text-disabled">
                <tr>
                  <th className="py-3">Receita</th>
                  <th className="py-3">Categoria</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Interacoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myRecipes.map((recipe) => (
                  <tr key={recipe.id}>
                    <td className="py-4 font-semibold text-ink">{recipe.title}</td>
                    <td className="py-4 text-muted">{recipe.category.name}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive">
                        {recipe.published ? "Publicado" : "Em revisao"}
                      </span>
                    </td>
                    <td className="py-4 text-muted">
                      {recipe._count.favorites} salvas · {recipe._count.comments} comentarios
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Nenhuma receita enviada" description="Crie sua primeira receita para que ela possa ser revisada e publicada." />
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-6 font-serif text-4xl text-ink">Receitas salvas</h2>
        {favorites.length ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <RecipeCard key={favorite.recipeId} recipe={favorite.recipe} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhuma receita salva" description="Abra uma receita e use o botao de salvar para montar sua biblioteca pessoal." />
        )}
      </section>
    </section>
  );
}

function ProfileMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="rounded-[24px] bg-surface p-5">
      <Icon className="h-5 w-5 text-olive" />
      <p className="mt-5 text-sm text-muted">{label}</p>
      <strong className="mt-1 block font-serif text-4xl text-ink">{value}</strong>
    </div>
  );
}
