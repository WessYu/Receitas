import bcrypt from "bcryptjs";
import { PrismaClient, Difficulty } from "@prisma/client";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

const categories = ["Jantar rapido", "Vegetariano", "Cafe da manha", "Sobremesas", "Massas"];

const recipes = [
  {
    title: "Risoto de limao siciliano com ervas",
    description: "Cremoso, perfumado e equilibrado, este risoto resolve um jantar especial com poucos ingredientes e tecnica simples.",
    category: "Jantar rapido",
    imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80",
    prepTime: 35,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: true,
    ingredients: [
      ["1 xicara", "arroz arboreo"],
      ["1/2 unidade", "cebola picada"],
      ["1 litro", "caldo de legumes quente"],
      ["1 unidade", "limao siciliano"],
      ["3 colheres", "queijo parmesao ralado"],
      ["1 colher", "manteiga fria"]
    ],
    steps: [
      "Refogue a cebola em azeite ate ficar translucida.",
      "Junte o arroz e mexa por dois minutos para envolver bem os graos.",
      "Adicione o caldo quente aos poucos, mexendo ate o arroz ficar cremoso.",
      "Finalize com raspas e suco de limao, parmesao e manteiga fria."
    ]
  },
  {
    title: "Bowl de graos com legumes tostados",
    description: "Uma refeicao completa, colorida e nutritiva com camadas de textura, molho fresco e preparo simples para a semana.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    prepTime: 30,
    servings: 2,
    difficulty: Difficulty.EASY,
    featured: true,
    ingredients: [
      ["1 xicara", "quinoa cozida"],
      ["1 unidade", "abobrinha em cubos"],
      ["1 unidade", "cenoura em tiras"],
      ["1/2 xicara", "grao-de-bico cozido"],
      ["2 colheres", "tahine"],
      ["1 unidade", "limao"]
    ],
    steps: [
      "Asse a abobrinha, a cenoura e o grao-de-bico com azeite e sal.",
      "Misture tahine, limao, agua e sal ate formar um molho fluido.",
      "Monte o bowl com quinoa, legumes tostados e molho por cima."
    ]
  },
  {
    title: "Panquecas de banana e aveia",
    description: "Maciez natural, docura na medida e preparo rapido para um cafe da manha de fim de semana sem complicacao.",
    category: "Cafe da manha",
    imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
    prepTime: 20,
    servings: 2,
    difficulty: Difficulty.EASY,
    featured: true,
    ingredients: [
      ["2 unidades", "bananas maduras"],
      ["2 unidades", "ovos"],
      ["1/2 xicara", "aveia em flocos"],
      ["1 pitada", "canela"],
      ["1 colher", "fermento quimico"]
    ],
    steps: [
      "Amasse as bananas e misture com ovos, aveia, canela e fermento.",
      "Aqueca uma frigideira antiaderente e doure pequenas porcoes de massa.",
      "Sirva com frutas, iogurte ou mel."
    ]
  },
  {
    title: "Torta fria de chocolate amargo",
    description: "Sobremesa intensa, elegante e sem excesso de acucar, com base crocante e recheio sedoso.",
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80",
    prepTime: 55,
    servings: 8,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [
      ["200 g", "biscoito de cacau"],
      ["80 g", "manteiga derretida"],
      ["300 g", "chocolate 70%"],
      ["300 ml", "creme de leite fresco"],
      ["1 pitada", "sal"]
    ],
    steps: [
      "Triture os biscoitos, misture com manteiga e pressione no fundo da forma.",
      "Aqueca o creme de leite e despeje sobre o chocolate picado.",
      "Mexa ate formar um creme liso, coloque sobre a base e gele ate firmar."
    ]
  },
  {
    title: "Massa curta com tomate assado",
    description: "Tomates assados lentamente, alho e manjericao criam um molho encorpado para uma massa honesta e memoravel.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    prepTime: 40,
    servings: 3,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["300 g", "massa curta"],
      ["500 g", "tomate cereja"],
      ["4 dentes", "alho"],
      ["1 punhado", "manjericao fresco"],
      ["3 colheres", "azeite"]
    ],
    steps: [
      "Asse os tomates com alho, azeite e sal ate murcharem.",
      "Cozinhe a massa em agua salgada e reserve um pouco da agua do cozimento.",
      "Misture a massa aos tomates, ajuste a textura com a agua reservada e finalize com manjericao."
    ]
  }
];

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@receitas.local" },
    update: { role: "ADMIN" },
    create: {
      name: "Admin Receitas",
      email: "admin@receitas.local",
      passwordHash,
      role: "ADMIN"
    }
  });

  await prisma.user.upsert({
    where: { email: "demo@receitas.local" },
    update: {},
    create: {
      name: "Usuario Demo",
      email: "demo@receitas.local",
      passwordHash: await bcrypt.hash("Demo@123456", 12)
    }
  });

  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) }
    });
  }

  for (const recipe of recipes) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: slugify(recipe.category) } });
    const slug = slugify(recipe.title);

    await prisma.recipe.upsert({
      where: { slug },
      update: {},
      create: {
        title: recipe.title,
        slug,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        featured: recipe.featured,
        published: true,
        categoryId: category.id,
        authorId: admin.id,
        ingredients: {
          create: recipe.ingredients.map(([amount, name], index) => ({
            amount,
            name,
            order: index + 1
          }))
        },
        steps: {
          create: recipe.steps.map((content, index) => ({
            content,
            order: index + 1
          }))
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
