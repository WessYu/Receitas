import Link from "next/link";
import { LogOut } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ProfileForm } from "@/components/auth/profile-form";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { logoutAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [favorites, myRecipes] = await Promise.all([
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
    })
  ]);

  return (
    <section className="container-page py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-2">Área privada</p>
          <h1 className="font-serif text-5xl">Olá, {user.name.split(" ")[0]}</h1>
          <p className="mt-3 text-ink/60">Gerencie seu perfil, suas receitas e a biblioteca que você salvou.</p>
        </div>
        <form action={logoutAction}>
          <button className="button-secondary" type="submit">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>

      <div className="grid gap-8">
        <ProfileForm name={user.name} email={user.email} avatarUrl={user.avatarUrl} emailNotifications={user.emailNotifications} />

        <section className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-4xl">Minhas receitas</h2>
              <p className="mt-2 text-sm text-ink/60">Envie receitas para revisão e compartilhe com a comunidade quando forem publicadas.</p>
            </div>
            <Link href="/dashboard/recipes/new" className="button-primary w-fit">
              Enviar receita
            </Link>
          </div>
          {myRecipes.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="text-xs uppercase text-ink/45">
                  <tr>
                    <th className="py-3">Receita</th>
                    <th className="py-3">Categoria</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Interações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {myRecipes.map((recipe) => (
                    <tr key={recipe.id}>
                      <td className="py-4 font-semibold">{recipe.title}</td>
                      <td className="py-4 text-ink/60">{recipe.category.name}</td>
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
          ) : (
            <EmptyState title="Nenhuma receita enviada" description="Crie sua primeira receita para que ela possa ser revisada e publicada." />
          )}
        </section>

        <section>
          <h2 className="mb-5 font-serif text-4xl">Receitas salvas</h2>
          {favorites.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <RecipeCard key={favorite.recipeId} recipe={favorite.recipe} />
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhuma receita salva" description="Abra uma receita e use o botão de salvar para montar sua biblioteca pessoal." />
          )}
        </section>
      </div>
    </section>
  );
}
