"use client";

import { Search } from "lucide-react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">Buscar receitas</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" />
      <input
        name="q"
        defaultValue={defaultValue}
        className="field pl-12"
        placeholder="Buscar por receita, tecnica ou ingrediente"
      />
    </label>
  );
}
