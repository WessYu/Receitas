"use client";

import { useEffect } from "react";

export function RecipeViewTracker({ recipeId }: { recipeId: string }) {
  useEffect(() => {
    const key = `savor:view:${recipeId}`;
    const lastView = Number(window.sessionStorage.getItem(key) ?? "0");
    const now = Date.now();

    if (now - lastView < 30_000) return;
    window.sessionStorage.setItem(key, String(now));

    fetch(`/api/recipes/${recipeId}/view`, {
      method: "POST",
      keepalive: true
    }).catch(() => undefined);
  }, [recipeId]);

  return null;
}
