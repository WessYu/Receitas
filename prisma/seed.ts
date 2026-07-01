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
  },
  {
    title: "Frango ao molho de mostarda e mel",
    description: "Peito de frango dourado com molho cremoso, acidez leve e toque adocicado na medida.",
    category: "Jantar rapido",
    imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80",
    prepTime: 32,
    servings: 3,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["3 unidades", "files de frango"],
      ["2 colheres", "mostarda"],
      ["1 colher", "mel"],
      ["1/2 xicara", "creme de leite"],
      ["1 ramo", "tomilho fresco"]
    ],
    steps: [
      "Tempere e doure o frango dos dois lados.",
      "Misture mostarda, mel e creme de leite.",
      "Volte o frango ao molho e cozinhe ate ficar macio."
    ]
  },
  {
    title: "Sopa cremosa de abobora assada",
    description: "Abobora assada, gengibre e caldo de legumes formam uma sopa aveludada e confortante.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
    prepTime: 45,
    servings: 4,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["800 g", "abobora"],
      ["1 unidade", "cebola"],
      ["1 colher", "gengibre ralado"],
      ["700 ml", "caldo de legumes"],
      ["2 colheres", "sementes tostadas"]
    ],
    steps: [
      "Asse a abobora com cebola e azeite.",
      "Bata com caldo quente e gengibre.",
      "Ajuste sal e finalize com sementes."
    ]
  },
  {
    title: "Omelete de cogumelos e queijo",
    description: "Omelete macia com cogumelos salteados e queijo derretido para uma refeicao rapida.",
    category: "Cafe da manha",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    prepTime: 15,
    servings: 1,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["3 unidades", "ovos"],
      ["1 xicara", "cogumelos"],
      ["1/3 xicara", "queijo"],
      ["1 colher", "cebolinha"],
      ["1 colher", "manteiga"]
    ],
    steps: [
      "Salteie os cogumelos na manteiga.",
      "Bata os ovos e leve a frigideira.",
      "Recheie, dobre e finalize com cebolinha."
    ]
  },
  {
    title: "Cheesecake leve com frutas vermelhas",
    description: "Base crocante, creme suave e cobertura de frutas vermelhas para servir gelado.",
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
    prepTime: 70,
    servings: 8,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["200 g", "biscoito"],
      ["80 g", "manteiga"],
      ["450 g", "cream cheese"],
      ["3 unidades", "ovos"],
      ["1 xicara", "frutas vermelhas"]
    ],
    steps: [
      "Monte a base com biscoito e manteiga.",
      "Bata o creme e despeje sobre a base.",
      "Asse em temperatura baixa e cubra com frutas."
    ]
  },
  {
    title: "Carbonara com ervilhas frescas",
    description: "Massa cremosa sem creme de leite, com ovos, queijo, pimenta e ervilhas para frescor.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
    prepTime: 25,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["220 g", "espaguete"],
      ["2 unidades", "gemas"],
      ["1 unidade", "ovo"],
      ["1/2 xicara", "parmesao"],
      ["1/2 xicara", "ervilhas"]
    ],
    steps: [
      "Cozinhe a massa e reserve agua.",
      "Misture ovos, queijo e pimenta.",
      "Una tudo fora do fogo ate formar creme."
    ]
  },
  {
    title: "Arroz de camarao com coentro",
    description: "Arroz umido, camaroes suculentos e ervas frescas em uma panela so.",
    category: "Jantar rapido",
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    prepTime: 38,
    servings: 4,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["300 g", "camarao"],
      ["1 xicara", "arroz"],
      ["1 unidade", "tomate"],
      ["1/2 unidade", "pimentao"],
      ["1 punhado", "coentro fresco"]
    ],
    steps: [
      "Refogue os aromaticos e o arroz.",
      "Adicione caldo e cozinhe ate quase secar.",
      "Junte os camaroes no final e finalize com coentro."
    ]
  },
  {
    title: "Salada morna de lentilha",
    description: "Lentilhas cozidas no ponto, legumes crocantes e vinagrete de mostarda para marmita elegante.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
    prepTime: 35,
    servings: 3,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["1 xicara", "lentilha"],
      ["1 unidade", "cenoura"],
      ["1 talo", "salsao"],
      ["1 colher", "mostarda"],
      ["1 punhado", "salsinha"]
    ],
    steps: [
      "Cozinhe a lentilha ate ficar macia.",
      "Misture legumes picados e vinagrete.",
      "Sirva morna com salsinha."
    ]
  },
  {
    title: "Rabanada de forno com laranja",
    description: "Fatias douradas no forno com perfume de laranja, canela e textura macia.",
    category: "Cafe da manha",
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80",
    prepTime: 35,
    servings: 4,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["6 fatias", "pao"],
      ["2 unidades", "ovos"],
      ["1 xicara", "leite"],
      ["1 colher", "raspas de laranja"],
      ["1 pitada", "canela"]
    ],
    steps: [
      "Misture ovos, leite, laranja e canela.",
      "Passe as fatias de pao na mistura.",
      "Asse ate dourar dos dois lados."
    ]
  },
  {
    title: "Panna cotta de baunilha",
    description: "Creme italiano delicado, gelado e servido com calda simples de frutas.",
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    prepTime: 25,
    servings: 6,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["500 ml", "creme de leite"],
      ["1 unidade", "fava de baunilha"],
      ["1/3 xicara", "acucar"],
      ["1 pacote", "gelatina incolor"],
      ["1/2 xicara", "calda de frutas"]
    ],
    steps: [
      "Aqueca creme, baunilha e acucar.",
      "Misture a gelatina hidratada.",
      "Leve para gelar e sirva com calda."
    ]
  },
  {
    title: "Gnocchi na manteiga de salvia",
    description: "Gnocchi macio envolvido em manteiga noisette, salvia crocante e queijo ralado.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    prepTime: 30,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["400 g", "gnocchi"],
      ["3 colheres", "manteiga"],
      ["10 folhas", "salvia"],
      ["1/2 xicara", "parmesao"],
      ["1 pitada", "pimenta-do-reino"]
    ],
    steps: [
      "Cozinhe o gnocchi ate subir.",
      "Doure a manteiga com salvia.",
      "Misture o gnocchi e finalize com queijo."
    ]
  }
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de rodar o seed.");
  }

  if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD precisa ter pelo menos 12 caracteres.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { role: "ADMIN" },
    create: {
      name: "Admin Receitas",
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "ADMIN"
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
