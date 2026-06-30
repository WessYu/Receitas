import type { LucideIcon } from "lucide-react";

export function DashboardCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/75 p-6 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-olive/10 text-olive">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-ink/55">{label}</p>
      <strong className="mt-2 block font-serif text-4xl font-semibold text-ink">{value}</strong>
    </div>
  );
}
