import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDifficulty(value: string) {
  const labels: Record<string, string> = {
    EASY: "Fácil",
    MEDIUM: "Média",
    HARD: "Avançada"
  };

  return labels[value] ?? value;
}
