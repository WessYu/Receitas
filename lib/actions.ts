"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { notifyUsersAboutNewRecipe } from "@/lib/mail";
import { normalizeIngredientName } from "@/lib/pantry";
import { createSession, destroySession, requireAdmin, requireUser } from "@/lib/session";
import { saveUploadedImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import {
  type ActionState,
  categorySchema,
  commentSchema,
  formError,
  loginSchema,
  parseJsonField,
  profileSchema,
  recipeSchema,
  registerSchema
} from "@/lib/validators";

function fieldValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: fieldValue(formData, "email").toLowerCase(),
    password: fieldValue(formData, "password")
  });

  if (!parsed.success) return formError(parsed.error);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return { ok: false, message: "Email ou senha inválidos." };

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordMatches) return { ok: false, message: "Email ou senha inválidos." };

  await createSession({ userId: user.id, role: user.role });
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function registerAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: fieldValue(formData, "name"),
    email: fieldValue(formData, "email").toLowerCase(),
    password: fieldValue(formData, "password"),
    confirmPassword: fieldValue(formData, "confirmPassword")
  });

  if (!parsed.success) return formError(parsed.error);

  const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) return { ok: false, message: "Já existe uma conta com este email." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash
    }
  });

  await createSession({ userId: user.id, role: user.role });
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function updateProfileAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  let parsed;

  try {
    const avatarUrl = await saveUploadedImage(formData, "avatarFile", "perfil");
    parsed = profileSchema.safeParse({
      name: fieldValue(formData, "name"),
      email: fieldValue(formData, "email").toLowerCase(),
      avatarUrl: avatarUrl || fieldValue(formData, "currentAvatarUrl") || undefined,
      emailNotifications: formData.has("emailNotifications")
    });
  } catch (error) {
    return formError(error);
  }

  if (!parsed.success) return formError(parsed.error);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        avatarUrl: parsed.data.avatarUrl,
        emailNotifications: parsed.data.emailNotifications
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Este email já está em uso." };
    }

    return formError(error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/recipes");
  return { ok: true, message: "Perfil atualizado." };
}

export async function toggleFavoriteAction(recipeId: string) {
  const user = await requireUser();
  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, published: true },
    select: { id: true, slug: true }
  });

  if (!recipe) throw new Error("Receita não encontrada.");

  const favorite = await prisma.favorite.findUnique({
    where: { userId_recipeId: { userId: user.id, recipeId } }
  });

  if (favorite) {
    await prisma.favorite.delete({ where: { userId_recipeId: { userId: user.id, recipeId } } });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, recipeId } });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/recipes/${recipe.slug}`);

  return { saved: !favorite };
}

export async function createCategoryAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse({ name: fieldValue(formData, "name") });

  if (!parsed.success) return formError(parsed.error);

  try {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: slugify(parsed.data.name)
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Categoria já cadastrada." };
    }

    return formError(error);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/recipes");
  return { ok: true, message: "Categoria criada." };
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/recipes");
}

async function recipePayloadFromForm(formData: FormData) {
  const uploadedImageUrl = await saveUploadedImage(formData);
  const typedImageUrl = fieldValue(formData, "imageUrl");
  const currentImageUrl = fieldValue(formData, "currentImageUrl");

  return {
    title: fieldValue(formData, "title"),
    description: fieldValue(formData, "description"),
    imageUrl: uploadedImageUrl || typedImageUrl || currentImageUrl,
    categoryId: fieldValue(formData, "categoryId"),
    prepTime: fieldValue(formData, "prepTime"),
    servings: fieldValue(formData, "servings"),
    difficulty: fieldValue(formData, "difficulty"),
    published: formData.has("published"),
    featured: formData.has("featured"),
    ingredients: parseJsonField(formData, "ingredients", []),
    steps: parseJsonField(formData, "steps", [])
  };
}

async function createRecipeRecord(userId: string, formData: FormData, options: { admin: boolean }) {
  const payload = await recipePayloadFromForm(formData);
  const parsed = recipeSchema.safeParse({
    ...payload,
    published: options.admin ? payload.published : false,
    featured: options.admin ? payload.featured : false
  });

  if (!parsed.success) return { parsed };

  const recipe = await prisma.recipe.create({
    data: {
      title: parsed.data.title,
      slug: slugify(parsed.data.title),
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      categoryId: parsed.data.categoryId,
      prepTime: parsed.data.prepTime,
      servings: parsed.data.servings,
      difficulty: parsed.data.difficulty,
      published: parsed.data.published,
      featured: parsed.data.featured,
      authorId: userId,
      ingredients: {
        create: parsed.data.ingredients.map((ingredient, index) => ({
          ...ingredient,
          normalizedName: normalizeIngredientName(ingredient.name),
          order: index + 1
        }))
      },
      steps: {
        create: parsed.data.steps.map((content, index) => ({
          content,
          order: index + 1
        }))
      }
    }
  });

  return { parsed, recipe };
}

export async function createRecipeAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdmin();

  try {
    const result = await createRecipeRecord(user.id, formData, { admin: true });
    if (!result.parsed.success) return formError(result.parsed.error);

    if (result.recipe?.published) {
      await notifyUsersAboutNewRecipe(result.recipe);
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Já existe uma receita com esse título." };
    }

    return formError(error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/recipes");
  revalidatePath("/recipes");
  redirect("/admin/recipes");
}

export async function createUserRecipeAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  try {
    const result = await createRecipeRecord(user.id, formData, { admin: false });
    if (!result.parsed.success) return formError(result.parsed.error);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Já existe uma receita com esse título." };
    }

    return formError(error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/recipes");
  revalidatePath("/admin");
  revalidatePath("/admin/recipes");
  redirect("/dashboard/recipes");
}

export async function updateRecipeAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const currentRecipe = await prisma.recipe.findUnique({
    where: { id },
    select: { published: true }
  });
  let parsed;

  try {
    parsed = recipeSchema.safeParse(await recipePayloadFromForm(formData));
  } catch (error) {
    return formError(error);
  }

  if (!parsed.success) return formError(parsed.error);

  try {
    const [, , recipe] = await prisma.$transaction([
      prisma.ingredient.deleteMany({ where: { recipeId: id } }),
      prisma.preparationStep.deleteMany({ where: { recipeId: id } }),
      prisma.recipe.update({
        where: { id },
        data: {
          title: parsed.data.title,
          slug: slugify(parsed.data.title),
          description: parsed.data.description,
          imageUrl: parsed.data.imageUrl,
          categoryId: parsed.data.categoryId,
          prepTime: parsed.data.prepTime,
          servings: parsed.data.servings,
          difficulty: parsed.data.difficulty,
          published: parsed.data.published,
          featured: parsed.data.featured,
          ingredients: {
            create: parsed.data.ingredients.map((ingredient, index) => ({
              ...ingredient,
              normalizedName: normalizeIngredientName(ingredient.name),
              order: index + 1
            }))
          },
          steps: {
            create: parsed.data.steps.map((content, index) => ({
              content,
              order: index + 1
            }))
          }
        }
      })
    ]);

    if (!currentRecipe?.published && recipe.published) {
      await notifyUsersAboutNewRecipe(recipe);
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Já existe uma receita com esse título." };
    }

    return formError(error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/recipes");
  revalidatePath("/recipes");
  redirect("/admin/recipes");
}

export async function deleteRecipeAction(id: string) {
  await requireAdmin();
  await prisma.recipe.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/recipes");
  revalidatePath("/recipes");
}

export async function createCommentAction(
  recipeId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = commentSchema.safeParse({ content: fieldValue(formData, "content") });

  if (!parsed.success) return formError(parsed.error);

  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, published: true },
    select: { id: true, slug: true }
  });

  if (!recipe) return { ok: false, message: "Receita não encontrada." };

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      recipeId: recipe.id,
      userId: user.id
    }
  });

  revalidatePath(`/recipes/${recipe.slug}`);
  revalidatePath("/admin");
  return { ok: true, message: "Comentário publicado." };
}
