"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleFavoriteAction } from "@/lib/actions";
import { useToast } from "@/components/toast";

export function SaveRecipeButton({
  recipeId,
  isSaved,
  isLoggedIn,
  saveLabel = "Salvar receita",
  savedLabel = "Salva",
  loggedOutLabel = "Entrar para salvar",
  className = "button-primary"
}: {
  recipeId: string;
  isSaved: boolean;
  isLoggedIn: boolean;
  saveLabel?: string;
  savedLabel?: string;
  loggedOutLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  if (!isLoggedIn) {
    return (
      <a href="/login" className={className}>
        <Bookmark className="h-4 w-4" />
        {loggedOutLabel}
      </a>
    );
  }

  return (
    <button
      className={className}
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
      {isSaved ? savedLabel : saveLabel}
    </button>
  );
}
