import Link from "next/link";
import { BookOpen, FolderTree, LayoutDashboard, UsersRound } from "lucide-react";

const links = [
  { href: "/admin", label: "Resumo", icon: LayoutDashboard },
  { href: "/admin/recipes", label: "Receitas", icon: BookOpen },
  { href: "/admin/categories", label: "Categorias", icon: FolderTree },
  { href: "/admin/users", label: "Usuários", icon: UsersRound }
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg border border-border bg-surface/85 p-3 shadow-sm lg:sticky lg:top-24 lg:h-fit">
      <nav className="grid gap-1">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-muted transition hover:bg-olive/10 hover:text-ink"
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
