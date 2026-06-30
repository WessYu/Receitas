import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { favorites: true } }
    }
  });

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-2">Usuarios</p>
        <h1 className="font-serif text-5xl">Contas cadastradas</h1>
      </div>
      <div className="overflow-hidden rounded-lg border border-ink/10 bg-white/75 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-porcelain text-xs uppercase text-ink/45">
              <tr>
                <th className="px-5 py-4">Nome</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Favoritos</th>
                <th className="px-5 py-4">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4 font-semibold">{user.name}</td>
                  <td className="px-5 py-4 text-ink/60">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold text-olive">{user.role}</span>
                  </td>
                  <td className="px-5 py-4 text-ink/60">{user._count.favorites}</td>
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
