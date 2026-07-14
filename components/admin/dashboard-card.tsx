import type { LucideIcon } from "lucide-react";

export function DashboardCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-border bg-surface/85 p-6 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-olive/20 bg-olive/10 text-olive">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-muted">{label}</p>
      <strong className="mt-2 block font-serif text-4xl font-semibold text-ink">{value}</strong>
    </div>
  );
}
