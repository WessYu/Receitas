"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { Category, Difficulty, Ingredient, PreparationStep, Recipe } from "@prisma/client";
import { createRecipeAction, createUserRecipeAction, updateRecipeAction } from "@/lib/actions";
import type { ActionState } from "@/lib/validators";

type RecipeWithChildren = Recipe & {
  ingredients: Ingredient[];
  steps: PreparationStep[];
};

type IngredientDraft = {
  amount: string;
  name: string;
};

export function RecipeForm({
  categories,
  recipe,
  mode = "admin"
}: {
  categories: Category[];
  recipe?: RecipeWithChildren;
  mode?: "admin" | "user";
}) {
  const action = useMemo(
    () => (recipe ? updateRecipeAction.bind(null, recipe.id) : mode === "admin" ? createRecipeAction : createUserRecipeAction),
    [mode, recipe]
  );
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  const [ingredients, setIngredients] = useState<IngredientDraft[]>(
    recipe?.ingredients.map((item) => ({ amount: item.amount, name: item.name })) ?? [{ amount: "", name: "" }]
  );
  const [steps, setSteps] = useState<string[]>(recipe?.steps.map((step) => step.content) ?? [""]);

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      {state.message ? (
        <p className="rounded-md border border-tomato/20 bg-tomato/10 px-4 py-3 text-sm text-tomato">{state.message}</p>
      ) : null}

      <input type="hidden" name="ingredients" value={JSON.stringify(ingredients.filter((item) => item.amount || item.name))} />
      <input type="hidden" name="steps" value={JSON.stringify(steps.filter(Boolean))} />
      <input type="hidden" name="currentImageUrl" value={recipe?.imageUrl ?? ""} />

      <section className="rounded-lg border border-ink/10 bg-white/75 p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold" htmlFor="title">
              Título
            </label>
            <input className="field" id="title" name="title" defaultValue={recipe?.title} />
            {state.errors?.title ? <p className="mt-2 text-xs text-tomato">{state.errors.title[0]}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold" htmlFor="description">
              Descrição
            </label>
            <textarea className="field min-h-28" id="description" name="description" defaultValue={recipe?.description} />
            {state.errors?.description ? <p className="mt-2 text-xs text-tomato">{state.errors.description[0]}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold" htmlFor="imageUrl">
              Imagem por URL
            </label>
            <input className="field" id="imageUrl" name="imageUrl" defaultValue={recipe?.imageUrl} placeholder="https://images.unsplash.com/..." />
            {state.errors?.imageUrl ? <p className="mt-2 text-xs text-tomato">{state.errors.imageUrl[0]}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold" htmlFor="imageFile">
              Enviar foto
            </label>
            <input className="field file:mr-4 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-porcelain" id="imageFile" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
            <p className="mt-2 text-xs leading-5 text-ink/55">
              Use uma foto do seu computador ou mantenha a URL acima. Formatos aceitos: JPG, PNG, WEBP e GIF até 5 MB.
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="categoryId">
              Categoria
            </label>
            <select className="field" id="categoryId" name="categoryId" defaultValue={recipe?.categoryId ?? ""}>
              <option value="">Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {state.errors?.categoryId ? <p className="mt-2 text-xs text-tomato">{state.errors.categoryId[0]}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="difficulty">
              Dificuldade
            </label>
            <select className="field" id="difficulty" name="difficulty" defaultValue={recipe?.difficulty ?? "EASY"}>
              <option value="EASY">Fácil</option>
              <option value="MEDIUM">Média</option>
              <option value="HARD">Avançada</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="prepTime">
              Tempo de preparo
            </label>
            <input className="field" id="prepTime" name="prepTime" type="number" min="1" defaultValue={recipe?.prepTime ?? 30} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="servings">
              Porções
            </label>
            <input className="field" id="servings" name="servings" type="number" min="1" defaultValue={recipe?.servings ?? 2} />
          </div>
          {mode === "admin" ? (
            <>
              <label className="flex items-center gap-3 rounded-md border border-ink/10 bg-porcelain/70 px-4 py-3 text-sm font-semibold">
                <input type="checkbox" name="published" defaultChecked={recipe?.published ?? true} />
                Publicada
              </label>
              <label className="flex items-center gap-3 rounded-md border border-ink/10 bg-porcelain/70 px-4 py-3 text-sm font-semibold">
                <input type="checkbox" name="featured" defaultChecked={recipe?.featured ?? false} />
                Destaque
              </label>
            </>
          ) : (
            <p className="rounded-md border border-olive/15 bg-olive/10 px-4 py-3 text-sm font-medium text-ink/70 md:col-span-2">
              Sua receita será enviada para revisão. Quando o admin publicar, ela aparece na biblioteca para todos.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white/75 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-3xl">Ingredientes</h2>
          <button className="button-secondary px-3 py-2" type="button" onClick={() => setIngredients((current) => [...current, { amount: "", name: "" }])}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[160px_1fr_auto]">
              <input
                className="field"
                placeholder="Quantidade"
                value={ingredient.amount}
                onChange={(event) =>
                  setIngredients((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, amount: event.target.value } : item)))
                }
              />
              <input
                className="field"
                placeholder="Ingrediente"
                value={ingredient.name}
                onChange={(event) =>
                  setIngredients((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)))
                }
              />
              <button
                className="button-secondary px-3 py-2 text-tomato"
                type="button"
                onClick={() => setIngredients((current) => current.filter((_, itemIndex) => itemIndex !== index))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {state.errors?.ingredients ? <p className="mt-3 text-xs text-tomato">{state.errors.ingredients[0]}</p> : null}
      </section>

      <section className="rounded-lg border border-ink/10 bg-white/75 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-3xl">Modo de preparo</h2>
          <button className="button-secondary px-3 py-2" type="button" onClick={() => setSteps((current) => [...current, ""])}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <textarea
                className="field min-h-20"
                placeholder={`Passo ${index + 1}`}
                value={step}
                onChange={(event) => setSteps((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))}
              />
              <button className="button-secondary px-3 py-2 text-tomato" type="button" onClick={() => setSteps((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {state.errors?.steps ? <p className="mt-3 text-xs text-tomato">{state.errors.steps[0]}</p> : null}
      </section>

      <button className="button-primary" disabled={pending} type="submit">
        <Save className="h-4 w-4" />
        {mode === "admin" ? "Salvar receita" : "Enviar para revisão"}
      </button>
    </form>
  );
}
