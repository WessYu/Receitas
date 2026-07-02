import bcrypt from "bcryptjs";
import { PrismaClient, Difficulty } from "@prisma/client";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

const categories = ["Jantar rápido", "Vegetariano", "Café da manhã", "Sobremesas", "Massas"];

const recipes = [
  {
    title: "Risoto de limão siciliano com ervas",
    description: "Cremoso, perfumado e equilibrado, este risoto resolve um jantar especial com poucos ingredientes e técnica simples.",
    category: "Jantar rápido",
    imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80",
    prepTime: 35,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: true,
    ingredients: [
      ["1 xícara", "arroz arbóreo"],
      ["1/2 unidade", "cebola picada"],
      ["1 litro", "caldo de legumes quente"],
      ["1 unidade", "limão siciliano"],
      ["3 colheres", "queijo parmesão ralado"],
      ["1 colher", "manteiga fria"]
    ],
    steps: [
      "Refogue a cebola em azeite até ficar translúcida.",
      "Junte o arroz e mexa por dois minutos para envolver bem os grãos.",
      "Adicione o caldo quente aos poucos, mexendo até o arroz ficar cremoso.",
      "Finalize com raspas e suco de limão, parmesão e manteiga fria."
    ]
  },
  {
    title: "Bowl de grãos com legumes tostados",
    description: "Uma refeição completa, colorida e nutritiva com camadas de textura, molho fresco e preparo simples para a semana.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    prepTime: 30,
    servings: 2,
    difficulty: Difficulty.EASY,
    featured: true,
    ingredients: [
      ["1 xícara", "quinoa cozida"],
      ["1 unidade", "abobrinha em cubos"],
      ["1 unidade", "cenoura em tiras"],
      ["1/2 xícara", "grão-de-bico cozido"],
      ["2 colheres", "tahine"],
      ["1 unidade", "limão"]
    ],
    steps: [
      "Asse a abobrinha, a cenoura e o grão-de-bico com azeite e sal.",
      "Misture tahine, limão, água e sal até formar um molho fluido.",
      "Monte o bowl com quinoa, legumes tostados e molho por cima."
    ]
  },
  {
    title: "Panquecas de banana e aveia",
    description: "Maciez natural, doçura na medida e preparo rápido para um café da manhã de fim de semana sem complicação.",
    category: "Café da manhã",
    imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
    prepTime: 20,
    servings: 2,
    difficulty: Difficulty.EASY,
    featured: true,
    ingredients: [
      ["2 unidades", "bananas maduras"],
      ["2 unidades", "ovos"],
      ["1/2 xícara", "aveia em flocos"],
      ["1 pitada", "canela"],
      ["1 colher", "fermento químico"]
    ],
    steps: [
      "Amasse as bananas e misture com ovos, aveia, canela e fermento.",
      "Aqueça uma frigideira antiaderente e doure pequenas porções de massa.",
      "Sirva com frutas, iogurte ou mel."
    ]
  },
  {
    title: "Torta fria de chocolate amargo",
    description: "Sobremesa intensa, elegante e sem excesso de açúcar, com base crocante e recheio sedoso.",
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
      "Aqueça o creme de leite e despeje sobre o chocolate picado.",
      "Mexa até formar um creme liso, coloque sobre a base e gele até firmar."
    ]
  },
  {
    title: "Massa curta com tomate assado",
    description: "Tomates assados lentamente, alho e manjericão criam um molho encorpado para uma massa honesta e memorável.",
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
      ["1 punhado", "manjericão fresco"],
      ["3 colheres", "azeite"]
    ],
    steps: [
      "Asse os tomates com alho, azeite e sal até murcharem.",
      "Cozinhe a massa em água salgada e reserve um pouco da água do cozimento.",
      "Misture a massa aos tomates, ajuste a textura com a água reservada e finalize com manjericão."
    ]
  },
  {
    title: "Frango ao molho de mostarda e mel",
    description: "Peito de frango dourado com molho cremoso, acidez leve e toque adocicado na medida.",
    category: "Jantar rápido",
    imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80",
    prepTime: 32,
    servings: 3,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["3 unidades", "filés de frango"],
      ["2 colheres", "mostarda"],
      ["1 colher", "mel"],
      ["1/2 xícara", "creme de leite"],
      ["1 ramo", "tomilho fresco"]
    ],
    steps: [
      "Tempere e doure o frango dos dois lados.",
      "Misture mostarda, mel e creme de leite.",
      "Volte o frango ao molho e cozinhe até ficar macio."
    ]
  },
  {
    title: "Sopa cremosa de abóbora assada",
    description: "Abóbora assada, gengibre e caldo de legumes formam uma sopa aveludada e confortante.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
    prepTime: 45,
    servings: 4,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["800 g", "abóbora"],
      ["1 unidade", "cebola"],
      ["1 colher", "gengibre ralado"],
      ["700 ml", "caldo de legumes"],
      ["2 colheres", "sementes tostadas"]
    ],
    steps: [
      "Asse a abóbora com cebola e azeite.",
      "Bata com caldo quente e gengibre.",
      "Ajuste sal e finalize com sementes."
    ]
  },
  {
    title: "Omelete de cogumelos e queijo",
    description: "Omelete macia com cogumelos salteados e queijo derretido para uma refeição rápida.",
    category: "Café da manhã",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    prepTime: 15,
    servings: 1,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["3 unidades", "ovos"],
      ["1 xícara", "cogumelos"],
      ["1/3 xícara", "queijo"],
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
      ["1 xícara", "frutas vermelhas"]
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Espaguetis_carbonara.jpg/1280px-Espaguetis_carbonara.jpg",
    prepTime: 25,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["220 g", "espaguete"],
      ["2 unidades", "gemas"],
      ["1 unidade", "ovo"],
      ["1/2 xícara", "parmesão"],
      ["1/2 xícara", "ervilhas"]
    ],
    steps: [
      "Cozinhe a massa e reserve água.",
      "Misture ovos, queijo e pimenta.",
      "Una tudo fora do fogo até formar creme."
    ]
  },
  {
    title: "Arroz de camarão com coentro",
    description: "Arroz úmido, camarões suculentos e ervas frescas em uma panela só.",
    category: "Jantar rápido",
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    prepTime: 38,
    servings: 4,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["300 g", "camarão"],
      ["1 xícara", "arroz"],
      ["1 unidade", "tomate"],
      ["1/2 unidade", "pimentão"],
      ["1 punhado", "coentro fresco"]
    ],
    steps: [
      "Refogue os aromáticos e o arroz.",
      "Adicione caldo e cozinhe até quase secar.",
      "Junte os camarões no final e finalize com coentro."
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
      ["1 xícara", "lentilha"],
      ["1 unidade", "cenoura"],
      ["1 talo", "salsão"],
      ["1 colher", "mostarda"],
      ["1 punhado", "salsinha"]
    ],
    steps: [
      "Cozinhe a lentilha até ficar macia.",
      "Misture legumes picados e vinagrete.",
      "Sirva morna com salsinha."
    ]
  },
  {
    title: "Rabanada de forno com laranja",
    description: "Fatias douradas no forno com perfume de laranja, canela e textura macia.",
    category: "Café da manhã",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/French_toast_001.jpg/1280px-French_toast_001.jpg",
    prepTime: 35,
    servings: 4,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [
      ["6 fatias", "pão"],
      ["2 unidades", "ovos"],
      ["1 xícara", "leite"],
      ["1 colher", "raspas de laranja"],
      ["1 pitada", "canela"]
    ],
    steps: [
      "Misture ovos, leite, laranja e canela.",
      "Passe as fatias de pão na mistura.",
      "Asse até dourar dos dois lados."
    ]
  },
  {
    title: "Panna cotta de baunilha",
    description: "Creme italiano delicado, gelado e servido com calda simples de frutas.",
    category: "Sobremesas",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Panna_Cotta_with_cream_and_garnish.jpg/1280px-Panna_Cotta_with_cream_and_garnish.jpg",
    prepTime: 25,
    servings: 6,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["500 ml", "creme de leite"],
      ["1 unidade", "fava de baunilha"],
      ["1/3 xícara", "açúcar"],
      ["1 pacote", "gelatina incolor"],
      ["1/2 xícara", "calda de frutas"]
    ],
    steps: [
      "Aqueça creme, baunilha e açúcar.",
      "Misture a gelatina hidratada.",
      "Leve para gelar e sirva com calda."
    ]
  },
  {
    title: "Gnocchi na manteiga de sálvia",
    description: "Gnocchi macio envolvido em manteiga noisette, sálvia crocante e queijo ralado.",
    category: "Massas",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Semolina_gnocchi_with_sage_brown_butter_%2810063056444%29.jpg/1280px-Semolina_gnocchi_with_sage_brown_butter_%2810063056444%29.jpg",
    prepTime: 30,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [
      ["400 g", "gnocchi"],
      ["3 colheres", "manteiga"],
      ["10 folhas", "sálvia"],
      ["1/2 xícara", "parmesão"],
      ["1 pitada", "pimenta-do-reino"]
    ],
    steps: [
      "Cozinhe o gnocchi até subir.",
      "Doure a manteiga com sálvia.",
      "Misture o gnocchi e finalize com queijo."
    ]
  },
  {
    title: "Tilápia no papillote com legumes",
    description: "Peixe assado no papel com legumes finos, limão e azeite, sem sujeira e com muito aroma.",
    category: "Jantar rápido",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Orata_al_Cartoccio.jpg",
    prepTime: 26,
    servings: 2,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["2 unidades", "filés de tilápia"], ["1 unidade", "abobrinha"], ["1 unidade", "cenoura"], ["1 unidade", "limão"], ["2 colheres", "azeite"]],
    steps: ["Monte os filés sobre papel manteiga.", "Cubra com legumes, azeite e limão.", "Feche bem e asse até o peixe ficar macio."]
  },
  {
    title: "Curry de grão-de-bico",
    description: "Grão-de-bico cozido em molho de coco, tomate e especiarias para um jantar quente e perfumado.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    prepTime: 34,
    servings: 4,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["2 xícaras", "grão-de-bico"], ["1 lata", "leite de coco"], ["1 unidade", "tomate"], ["1 colher", "curry"], ["1 punhado", "coentro"]],
    steps: ["Refogue tomate e especiarias.", "Junte grão-de-bico e leite de coco.", "Cozinhe até engrossar e finalize com coentro."]
  },
  {
    title: "Granola de frigideira",
    description: "Aveia, castanhas e mel tostados rapidamente para acompanhar frutas e iogurte.",
    category: "Café da manhã",
    imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=80",
    prepTime: 18,
    servings: 6,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["2 xícaras", "aveia"], ["1/2 xícara", "castanhas"], ["2 colheres", "mel"], ["1 pitada", "canela"], ["1/2 xícara", "coco em lascas"]],
    steps: ["Misture todos os ingredientes.", "Toste em frigideira baixa mexendo sempre.", "Esfrie antes de guardar."]
  },
  {
    title: "Mousse de maracujá com iogurte",
    description: "Mousse leve, ácida e cremosa feita com iogurte, maracujá e poucos ingredientes.",
    category: "Sobremesas",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/MouseDeMaracuja.jpg/1280px-MouseDeMaracuja.jpg",
    prepTime: 15,
    servings: 6,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["1 xícara", "polpa de maracujá"], ["2 xícaras", "iogurte"], ["1 lata", "leite condensado"], ["1 pacote", "gelatina incolor"]],
    steps: ["Bata iogurte, polpa e leite condensado.", "Misture gelatina hidratada.", "Leve para gelar até firmar."]
  },
  {
    title: "Lasanha de berinjela",
    description: "Camadas de berinjela grelhada, molho de tomate e queijo para uma lasanha mais leve.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1200&q=80",
    prepTime: 60,
    servings: 6,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["2 unidades", "berinjelas"], ["2 xícaras", "molho de tomate"], ["300 g", "muçarela"], ["1 punhado", "manjericão"], ["1/2 xícara", "parmesão"]],
    steps: ["Grelhe fatias de berinjela.", "Monte camadas com molho e queijo.", "Asse até borbulhar e dourar."]
  },
  {
    title: "Carne de panela com cenoura",
    description: "Carne cozida lentamente com caldo encorpado, cenoura macia e tempero caseiro.",
    category: "Jantar rápido",
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
    prepTime: 75,
    servings: 5,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["700 g", "acém"], ["2 unidades", "cenouras"], ["1 unidade", "cebola"], ["2 xícaras", "caldo"], ["2 folhas", "louro"]],
    steps: ["Sele a carne em cubos.", "Refogue cebola e junte caldo.", "Cozinhe até amaciar e finalize com cenoura."]
  },
  {
    title: "Tabule de quinoa",
    description: "Quinoa fria com pepino, tomate, hortelã e limão para uma salada fresca e completa.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    prepTime: 22,
    servings: 4,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["1 xícara", "quinoa"], ["1 unidade", "pepino"], ["2 unidades", "tomates"], ["1 punhado", "hortelã"], ["1 unidade", "limão"]],
    steps: ["Cozinhe e esfrie a quinoa.", "Pique os legumes pequenos.", "Misture com ervas, limão e azeite."]
  },
  {
    title: "Waffle de iogurte",
    description: "Massa macia por dentro e crocante por fora, perfeita com frutas frescas.",
    category: "Café da manhã",
    imageUrl: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1200&q=80",
    prepTime: 24,
    servings: 4,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["1 xícara", "farinha"], ["1 pote", "iogurte"], ["2 unidades", "ovos"], ["1 colher", "fermento"], ["1 colher", "manteiga"]],
    steps: ["Misture os ingredientes até formar massa lisa.", "Asse na máquina de waffle.", "Sirva com frutas."]
  },
  {
    title: "Brownie intenso de cacau",
    description: "Brownie denso, brilhante e com sabor profundo de cacau para cortar em quadrados.",
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
    prepTime: 38,
    servings: 9,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["180 g", "manteiga"], ["1 xícara", "açúcar"], ["3 unidades", "ovos"], ["3/4 xícara", "cacau"], ["1/2 xícara", "farinha"]],
    steps: ["Derreta a manteiga e misture açúcar.", "Junte ovos, cacau e farinha.", "Asse até formar casquinha."]
  },
  {
    title: "Penne ao pesto de rúcula",
    description: "Massa rápida com pesto fresco de rúcula, castanhas e queijo curado.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80",
    prepTime: 20,
    servings: 3,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["300 g", "penne"], ["2 xícaras", "rúcula"], ["1/3 xícara", "castanhas"], ["1/2 xícara", "parmesão"], ["1/2 xícara", "azeite"]],
    steps: ["Bata rúcula, castanhas, queijo e azeite.", "Cozinhe a massa.", "Misture tudo com um pouco da água do cozimento."]
  }
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de rodar o seed.");
  }

  if (adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD precisa ter pelo menos 8 caracteres.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      role: "ADMIN",
      passwordHash
    },
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
      update: {
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        featured: recipe.featured,
        published: true,
        categoryId: category.id,
        authorId: admin.id
      },
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
