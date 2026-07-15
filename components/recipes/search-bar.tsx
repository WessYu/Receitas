"use client";

import { Search } from "lucide-react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">Buscar receitas</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input name="q" defaultValue={defaultValue} className="field field-with-icon" placeholder="Buscar receita, técnica ou ingrediente" />
    </label>
  );
}
