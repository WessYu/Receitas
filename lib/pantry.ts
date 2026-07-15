export type PantryIngredientOption = {
  label: string;
  value: string;
};

export type PantryGroup = {
  title: string;
  items: PantryIngredientOption[];
};

export type IngredientLike = {
  name: string;
  normalizedName?: string | null;
};

export type RecipeCompatibility = {
  score: number;
  matchedCount: number;
  totalCount: number;
  missingIngredients: string[];
};

const normalizationAliases: Record<string, string> = {
  acem: "carne",
  avocado: "abacate",
  batatas: "batata",
  brioche: "pao",
  caldo: "caldo",
  camaroes: "camarao",
  castanhas: "castanha",
  claras: "ovo",
  cogumelos: "cogumelo",
  creme: "creme de leite",
  "creme fresco": "creme de leite",
  fuba: "farinha",
  gema: "ovo",
  gemas: "ovo",
  grao: "grao de bico",
  "grao de bico": "grao de bico",
  "leite condensado": "leite",
  mascarpone: "queijo",
  medalhoes: "carne",
  mucarela: "queijo",
  "massa folhada": "massa",
  ovos: "ovo",
  parmesao: "queijo",
  penne: "massa",
  ravioli: "massa",
  rucula: "rucula",
  salmao: "peixe",
  tagliatelle: "massa",
  tilapia: "peixe"
};

const pantryStopWords = new Set([
  "a",
  "ao",
  "com",
  "da",
  "de",
  "do",
  "e",
  "em",
  "fresco",
  "fresca",
  "frescas",
  "frios",
  "grande",
  "grandes",
  "integral",
  "limpa",
  "limpas",
  "picado",
  "picada",
  "unidade",
  "unidades",
  "xicara",
  "xicaras",
  "colher",
  "colheres",
  "lata",
  "pacote",
  "pitada",
  "punhado",
  "ramo"
]);

export const pantryGroups: PantryGroup[] = [
  {
    title: "Proteínas",
    items: [
      { label: "Ovos", value: "ovo" },
      { label: "Frango", value: "frango" },
      { label: "Carne", value: "carne" },
      { label: "Peixe", value: "peixe" },
      { label: "Camarões", value: "camarao" }
    ]
  },
  {
    title: "Laticínios",
    items: [
      { label: "Leite", value: "leite" },
      { label: "Queijo", value: "queijo" },
      { label: "Manteiga", value: "manteiga" },
      { label: "Iogurte", value: "iogurte" },
      { label: "Creme de leite", value: "creme de leite" }
    ]
  },
  {
    title: "Despensa",
    items: [
      { label: "Farinha", value: "farinha" },
      { label: "Açúcar", value: "acucar" },
      { label: "Arroz", value: "arroz" },
      { label: "Aveia", value: "aveia" },
      { label: "Massa", value: "massa" },
      { label: "Mel", value: "mel" }
    ]
  },
  {
    title: "Hortifruti",
    items: [
      { label: "Tomate", value: "tomate" },
      { label: "Cebola", value: "cebola" },
      { label: "Limão", value: "limao" },
      { label: "Cenoura", value: "cenoura" },
      { label: "Cogumelos", value: "cogumelo" },
      { label: "Rúcula", value: "rucula" }
    ]
  }
];

function basicNormalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b\d+(?:[,.]\d+)?\s*(?:g|kg|ml|l)\b/g, " ")
    .replace(/\b\d+(?:[,.]\d+)?\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeIngredientName(value: string) {
  const normalized = basicNormalize(value);
  const withoutMeasures = normalized
    .split(" ")
    .filter((part) => part.length > 1 && !pantryStopWords.has(part) && !/^(g|kg|ml|l)$/.test(part))
    .join(" ");

  if (!withoutMeasures) return normalized;

  const directAlias = normalizationAliases[withoutMeasures];
  if (directAlias) return directAlias;

  const [firstWord] = withoutMeasures.split(" ");
  return normalizationAliases[firstWord] ?? firstWord;
}

export function parsePantryParam(value?: string) {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => normalizeIngredientName(item))
        .filter(Boolean)
    )
  );
}

export function formatPantryParam(values: string[]) {
  return Array.from(new Set(values.map((item) => normalizeIngredientName(item)).filter(Boolean))).join(",");
}

export function getIngredientDisplayName(value: string) {
  const option = pantryGroups.flatMap((group) => group.items).find((item) => item.value === value);
  return option?.label ?? value;
}

export function calculateRecipeCompatibility(ingredients: IngredientLike[], pantryValues: string[]): RecipeCompatibility | null {
  if (!pantryValues.length) return null;

  const pantry = new Set(pantryValues.map(normalizeIngredientName));
  const recipeIngredients = new Map<string, string>();

  ingredients.forEach((ingredient) => {
    const normalized = normalizeIngredientName(ingredient.normalizedName || ingredient.name);
    if (normalized && !recipeIngredients.has(normalized)) {
      recipeIngredients.set(normalized, ingredient.name);
    }
  });

  const totalCount = recipeIngredients.size;
  if (!totalCount) return null;

  const missingIngredients = Array.from(recipeIngredients.entries())
    .filter(([normalized]) => !pantry.has(normalized))
    .map(([, label]) => label);
  const matchedCount = totalCount - missingIngredients.length;
  const score = Math.round((matchedCount / totalCount) * 100);

  return {
    score,
    matchedCount,
    totalCount,
    missingIngredients
  };
}
