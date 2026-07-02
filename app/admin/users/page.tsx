import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      emailNotifications: true,
      role: true,
      createdAt: true,
      _count: { select: { favorites: true, recipes: true, comments: true } }
    }
  });

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-2">Usuários</p>
        <h1 className="font-serif text-5xl">Contas cadastradas</h1>
      </div>
      <div className="overflow-hidden rounded-lg border border-ink/10 bg-white/75 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-porcelain text-xs uppercase text-ink/45">
              <tr>
                <th className="px-5 py-4">Nome</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Receitas</th>
                <th className="px-5 py-4">Comentários</th>
                <th className="px-5 py-4">Favoritos</th>
                <th className="px-5 py-4">Emails</th>
                <th className="px-5 py-4">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 font-semibold">
                      <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-olive/10 text-olive">
                        {user.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          user.name.slice(0, 1).toUpperCase()
                        )}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink/60">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive">{user.role}</span>
                  </td>
                  <td className="px-5 py-4 text-ink/60">{user._count.recipes}</td>
                  <td className="px-5 py-4 text-ink/60">{user._count.comments}</td>
                  <td className="px-5 py-4 text-ink/60">{user._count.favorites}</td>
                  <td className="px-5 py-4 text-ink/60">{user.emailNotifications ? "Ativo" : "Desativado"}</td>
                  <td className="px-5 py-4 text-ink/60">{new Intl.DateTimeFormat("pt-BR").format(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
