"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleFavoriteAction } from "@/lib/actions";
import { useToast } from "@/components/toast";

export function SaveRecipeButton({ recipeId, isSaved, isLoggedIn }: { recipeId: string; isSaved: boolean; isLoggedIn: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  if (!isLoggedIn) {
    return (
      <a href="/login" className="button-primary">
        <Bookmark className="h-4 w-4" />
        Entrar para salvar
      </a>
    );
  }

  return (
    <button
      className="button-primary"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await toggleFavoriteAction(recipeId);
          showToast(result.saved ? "Receita salva." : "Receita removida.");
          router.refresh();
        });
      }}
      type="button"
    >
      {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {isSaved ? "Salva" : "Salvar receita"}
    </button>
  );
}
