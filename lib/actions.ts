"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, requireAdmin, requireUser } from "@/lib/session";
import { slugify } from "@/lib/utils";
import {
  type ActionState,
  categorySchema,
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

async function saveUploadedImage(formData: FormData) {
  const file = formData.get("imageFile");

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  const allowedTypes = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
    ["image/webp", ".webp"],
    ["image/gif", ".gif"]
  ]);
  const extension = allowedTypes.get(file.type);

  if (!extension) {
    throw new Error("Envie uma imagem JPG, PNG, WEBP ou GIF.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("A imagem precisa ter no maximo 5 MB.");
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const rawName = file.name.replace(/\.[^.]+$/, "");
  const safeName = slugify(rawName).slice(0, 48) || "receita";
  const fileName = `${safeName}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);

  return `/uploads/${fileName}`;
}

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: fieldValue(formData, "email").toLowerCase(),
    password: fieldValue(formData, "password")
  });

  if (!parsed.success) return formError(parsed.error);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return { ok: false, message: "Email ou senha invalidos." };

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordMatches) return { ok: false, message: "Email ou senha invalidos." };

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
  if (existingUser) return { ok: false, message: "Ja existe uma conta com este email." };

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
  const parsed = profileSchema.safeParse({
    name: fieldValue(formData, "name"),
    email: fieldValue(formData, "email").toLowerCase()
  });

  if (!parsed.success) return formError(parsed.error);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: parsed.data
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Este email ja esta em uso." };
    }

    return formError(error);
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Perfil atualizado." };
}

export async function toggleFavoriteAction(recipeId: string) {
  const user = await requireUser();
  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, published: true },
    select: { id: true, slug: true }
  });

  if (!recipe) throw new Error("Receita nao encontrada.");

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
      return { ok: false, message: "Categoria ja cadastrada." };
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

export async function createRecipeAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdmin();
  let parsed;

  try {
    parsed = recipeSchema.safeParse(await recipePayloadFromForm(formData));
  } catch (error) {
    return formError(error);
  }

  if (!parsed.success) return formError(parsed.error);

  try {
    await prisma.recipe.create({
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
        authorId: user.id,
        ingredients: {
          create: parsed.data.ingredients.map((ingredient, index) => ({
            ...ingredient,
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Ja existe uma receita com esse titulo." };
    }

    return formError(error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/recipes");
  revalidatePath("/recipes");
  redirect("/admin/recipes");
}

export async function updateRecipeAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  let parsed;

  try {
    parsed = recipeSchema.safeParse(await recipePayloadFromForm(formData));
  } catch (error) {
    return formError(error);
  }

  if (!parsed.success) return formError(parsed.error);

  try {
    await prisma.$transaction([
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Ja existe uma receita com esse titulo." };
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
