"use client";

import { useActionState, useEffect, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { createCommentAction } from "@/lib/actions";
import { useToast } from "@/components/toast";

export function CommentForm({ recipeId, isLoggedIn }: { recipeId: string; isLoggedIn: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createCommentAction.bind(null, recipeId), {});
  const { showToast } = useToast();

  useEffect(() => {
    if (!state.message) return;
    showToast(state.message);
    if (state.ok) formRef.current?.reset();
  }, [showToast, state.message, state.ok]);

  if (!isLoggedIn) {
    return (
      <div className="rounded-lg border border-ink/10 bg-porcelain/80 p-5 text-sm text-ink/65">
        Entre na sua conta para comentar e participar das receitas.
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="rounded-lg border border-ink/10 bg-white/75 p-5 shadow-sm">
      <label className="mb-3 flex items-center gap-2 text-sm font-semibold" htmlFor="content">
        <MessageCircle className="h-4 w-4 text-olive" />
        Comentar receita
      </label>
      <textarea
        className="field min-h-28"
        id="content"
        name="content"
        placeholder="Conte como ficou, deixe uma dica ou tire uma dúvida."
      />
      {state.errors?.content ? <p className="mt-2 text-xs text-tomato">{state.errors.content[0]}</p> : null}
      {state.message && !state.ok ? <p className="mt-3 text-sm text-tomato">{state.message}</p> : null}
      <button className="button-primary mt-4" disabled={pending} type="submit">
        <Send className="h-4 w-4" />
        Publicar comentário
      </button>
    </form>
  );
}
