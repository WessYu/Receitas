import { SearchX } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/20 bg-white/50 px-6 py-14 text-center">
      <SearchX className="mx-auto mb-4 h-10 w-10 text-olive" />
      <h3 className="font-serif text-2xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">{description}</p>
    </div>
  );
}
