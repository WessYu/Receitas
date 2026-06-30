import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <section className="container-page grid gap-6 py-12 lg:grid-cols-[230px_1fr]">
      <AdminSidebar />
      <div>{children}</div>
    </section>
  );
}
