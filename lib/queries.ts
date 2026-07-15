import { cache } from "react";
import { Difficulty, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { gourmetRecipeSlugs } from "@/lib/gourmet-recipes";
import { normalizeIngredientName } from "@/lib/pantry";

export function buildRecipeWhere(params: {
  q?: string;
  category?: string;
  gourmet?: string;
  difficulty?: string;
  maxTime?: string;
  ingredient?: string;
  includeDrafts?: boolean;
}): Prisma.RecipeWhereInput {
  const where: Prisma.RecipeWhereInput = params.includeDrafts ? {} : { published: true };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } }
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.gourmet === "1") {
    where.slug = { in: gourmetRecipeSlugs };
  }

  if (params.difficulty && ["EASY", "MEDIUM", "HARD"].includes(params.difficulty)) {
    where.difficulty = params.difficulty as Difficulty;
  }

  if (params.maxTime) {
    const maxTime = Number(params.maxTime);
    if (!Number.isNaN(maxTime) && maxTime > 0) {
      where.prepTime = { lte: maxTime };
    }
  }

  if (params.ingredient) {
    const normalizedIngredient = normalizeIngredientName(params.ingredient);
    where.ingredients = {
      some: {
        OR: [
          { name: { contains: params.ingredient, mode: "insensitive" } },
          { normalizedName: { contains: normalizedIngredient, mode: "insensitive" } }
        ]
      }
    };
  }

  return where;
}

export function buildRecipeOrderBy(sort?: string): Prisma.RecipeOrderByWithRelationInput[] {
  if (sort === "saved") {
    return [{ favorites: { _count: "desc" } }, { createdAt: "desc" }];
  }

  if (sort === "commented") {
    return [{ comments: { _count: "desc" } }, { createdAt: "desc" }];
  }

  if (sort === "viewed") {
    return [{ views: { _count: "desc" } }, { createdAt: "desc" }];
  }

  if (sort === "fastest") {
    return [{ prepTime: "asc" }, { createdAt: "desc" }];
  }

  if (sort === "title") {
    return [{ title: "asc" }];
  }

  return [{ createdAt: "desc" }];
}

export const recipeInclude = {
  category: true,
  author: { select: { name: true, avatarUrl: true } },
  ingredients: {
    orderBy: { order: "asc" },
    select: { id: true, amount: true, name: true, order: true, recipeId: true }
  },
  steps: { orderBy: { order: "asc" } },
  favorites: true,
  comments: {
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, avatarUrl: true } } }
  }
} satisfies Prisma.RecipeInclude;

export const getCategories = cache(async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
});
