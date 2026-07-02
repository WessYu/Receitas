"use client";

import { useState, useTransition } from "react";
import { Trash2, X } from "lucide-react";
import { deleteRecipeAction, deleteCategoryAction } from "@/lib/actions";
import { useToast } from "@/components/toast";

export function ConfirmDeleteButton({
  id,
  type,
  label = "Excluir"
}: {
  id: string;
  type: "recipe" | "category";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  return (
    <>
      <button className="button-secondary px-3 py-2 text-tomato" type="button" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg bg-porcelain p-6 shadow-soft">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl">Confirmar exclusão</h2>
                <p className="mt-2 text-sm leading-6 text-ink/60">Esta ação remove o registro definitivamente.</p>
              </div>
              <button className="rounded-md p-2 hover:bg-ink/5" onClick={() => setOpen(false)} aria-label="Fechar" type="button">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button className="button-secondary" type="button" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button
                className="button-primary bg-tomato hover:bg-tomato"
                disabled={pending}
                type="button"
                onClick={() => {
                  startTransition(async () => {
                    if (type === "recipe") {
                      await deleteRecipeAction(id);
                    } else {
                      await deleteCategoryAction(id);
                    }
                    showToast("Registro excluído.");
                    setOpen(false);
                  });
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
