import { z } from "zod";

const securePassword = z
  .string()
  .min(8, "Use pelo menos 8 caracteres.")
  .regex(/[A-Z]/, "Inclua uma letra maiuscula.")
  .regex(/[a-z]/, "Inclua uma letra minuscula.")
  .regex(/[0-9]/, "Inclua um numero.");

export const loginSchema = z.object({
  email: z.string().email("Informe um email valido."),
  password: z.string().min(1, "Informe sua senha.")
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome."),
    email: z.string().email("Informe um email valido."),
    password: securePassword,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"]
  });

export const profileSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um email valido.")
});

export const categorySchema = z.object({
  name: z.string().min(2, "Informe o nome da categoria.")
});

export const recipeSchema = z.object({
  title: z.string().min(3, "Informe um titulo."),
  description: z.string().min(20, "Escreva uma descricao mais completa."),
  imageUrl: z.string().url("Informe uma URL de imagem valida."),
  categoryId: z.string().min(1, "Selecione uma categoria."),
  prepTime: z.coerce.number().int().min(1, "Tempo invalido."),
  servings: z.coerce.number().int().min(1, "Porcoes invalidas."),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  published: z.coerce.boolean().optional().default(false),
  featured: z.coerce.boolean().optional().default(false),
  ingredients: z
    .array(
      z.object({
        amount: z.string().min(1, "Informe a quantidade."),
        name: z.string().min(1, "Informe o ingrediente.")
      })
    )
    .min(1, "Inclua pelo menos um ingrediente."),
  steps: z.array(z.string().min(3, "Descreva o passo.")).min(1, "Inclua ao menos um passo.")
});

export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export function parseJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const value = formData.get(key);
  if (typeof value !== "string") return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function formError(error: unknown): ActionState {
  if (error instanceof z.ZodError) {
    return {
      ok: false,
      message: "Revise os campos destacados.",
      errors: error.flatten().fieldErrors
    };
  }

  return {
    ok: false,
    message: error instanceof Error ? error.message : "Nao foi possivel concluir a acao."
  };
}
