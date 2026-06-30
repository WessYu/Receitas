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
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      recipe: {
        include: { category: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="container-page py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-2">Area privada</p>
          <h1 className="font-serif text-5xl">Ola, {user.name.split(" ")[0]}</h1>
          <p className="mt-3 text-ink/60">Gerencie seus dados e as receitas que voce salvou.</p>
        </div>
        <form action={logoutAction}>
          <button className="button-secondary" type="submit">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>

      <div className="grid gap-8">
        <ProfileForm name={user.name} email={user.email} />

        <section>
          <h2 className="mb-5 font-serif text-4xl">Receitas salvas</h2>
          {favorites.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <RecipeCard key={favorite.recipeId} recipe={favorite.recipe} />
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhuma receita salva" description="Abra uma receita e use o botao de salvar para montar sua biblioteca pessoal." />
          )}
        </section>
      </div>
    </section>
  );
}
