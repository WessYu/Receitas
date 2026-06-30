"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { Category, Difficulty, Ingredient, PreparationStep, Recipe } from "@prisma/client";
import { createRecipeAction, updateRecipeAction } from "@/lib/actions";
import type { ActionState } from "@/lib/validators";

type RecipeWithChildren = Recipe & {
  ingredients: Ingredient[];
  steps: PreparationStep[];
};

type IngredientDraft = {
  amount: string;
  name: string;
};

export function RecipeForm({ categories, recipe }: { categories: Category[]; recipe?: RecipeWithChildren }) {
  const action = useMemo(
    () => (recipe ? updateRecipeAction.bind(null, recipe.id) : createRecipeAction),
    [recipe]
  );
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  const [ingredients, setIngredients] = useState<IngredientDraft[]>(
    recipe?.ingredients.map((item) => ({ amount: item.amount, name: item.name })) ?? [{ amount: "", name: "" }]
  );
  const [steps, setSteps] = useState<string[]>(recipe?.steps.map((step) => step.content) ?? [""]);

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <p className="rounded-md border border-tomato/20 bg-tomato/10 px-4 py-3 text-sm text-tomato">{state.message}</p>
      ) : null}

      <input type="hidden" name="ingredients" value={JSON.stringify(ingredients.filter((item) => item.amount || item.name))} />
      <input type="hidden" name="steps" value={JSON.stringify(steps.filter(Boolean))} />

      <section className="rounded-lg border border-ink/10 bg-white/75 p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold" htmlFor="title">
              Titulo
            </label>
            <input className="field" id="title" name="title" defaultValue={recipe?.title} />
            {state.errors?.title ? <p className="mt-2 text-xs text-tomato">{state.errors.title[0]}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold" htmlFor="description">
              Descricao
            </label>
            <textarea className="field min-h-28" id="description" name="description" defaultValue={recipe?.description} />
            {state.errors?.description ? <p className="mt-2 text-xs text-tomato">{state.errors.description[0]}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold" htmlFor="imageUrl">
              Imagem
            </label>
            <input className="field" id="imageUrl" name="imageUrl" defaultValue={recipe?.imageUrl} placeholder="https://images.unsplash.com/..." />
            {state.errors?.imageUrl ? <p className="mt-2 text-xs text-tomato">{state.errors.imageUrl[0]}</p> : null}
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
              <option value="EASY">Facil</option>
              <option value="MEDIUM">Media</option>
              <option value="HARD">Avancada</option>
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
              Porcoes
            </label>
            <input className="field" id="servings" name="servings" type="number" min="1" defaultValue={recipe?.servings ?? 2} />
          </div>
          <label className="flex items-center gap-3 rounded-md border border-ink/10 bg-porcelain/70 px-4 py-3 text-sm font-semibold">
            <input type="checkbox" name="published" defaultChecked={recipe?.published ?? true} />
            Publicada
          </label>
          <label className="flex items-center gap-3 rounded-md border border-ink/10 bg-porcelain/70 px-4 py-3 text-sm font-semibold">
            <input type="checkbox" name="featured" defaultChecked={recipe?.featured ?? false} />
            Destaque
          </label>
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
        Salvar receita
      </button>
    </form>
  );
}
