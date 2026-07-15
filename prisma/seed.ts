import bcrypt from "bcryptjs";
import { PrismaClient, Difficulty } from "@prisma/client";
import { normalizeIngredientName } from "../lib/pantry";
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
    imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1400&q=90",
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
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1400&q=90",
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
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1400&q=90",
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
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=90",
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
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1400&q=90",
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
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=90",
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
    imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1400&q=90",
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
  },
  {
    title: "Vieiras seladas com purê de couve-flor",
    description: "Vieiras douradas na manteiga com purê aveludado, limão e finalização de ervas frescas.",
    category: "Jantar rápido",
    imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=90",
    prepTime: 28,
    servings: 2,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [["8 unidades", "vieiras limpas"], ["1 unidade", "couve-flor"], ["2 colheres", "manteiga"], ["1/2 xícara", "creme fresco"], ["1 unidade", "limão siciliano"]],
    steps: ["Cozinhe a couve-flor até ficar macia.", "Bata com creme, sal e um pouco de manteiga até formar purê liso.", "Seque bem as vieiras e sele em frigideira muito quente.", "Sirva sobre o purê com raspas de limão."]
  },
  {
    title: "Ravioli de ricota com manteiga trufada",
    description: "Massa recheada com ricota cremosa, manteiga noisette e um toque de trufa para um jantar elegante.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1400&q=90",
    prepTime: 42,
    servings: 3,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [["360 g", "ravioli de ricota"], ["3 colheres", "manteiga"], ["1 colher", "azeite trufado"], ["1/2 xícara", "parmesão"], ["8 folhas", "sálvia"]],
    steps: ["Cozinhe o ravioli em água salgada.", "Doure a manteiga com sálvia até ficar aromática.", "Misture a massa delicadamente.", "Finalize com azeite trufado e parmesão."]
  },
  {
    title: "Pato com redução de laranja",
    description: "Peito de pato com pele crocante, molho cítrico brilhante e legumes tostados.",
    category: "Jantar rápido",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1400&q=90",
    prepTime: 48,
    servings: 2,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [["2 unidades", "peitos de pato"], ["2 unidades", "laranjas"], ["1 colher", "mel"], ["1/2 xícara", "caldo de frango"], ["1 ramo", "alecrim"]],
    steps: ["Faça cortes leves na pele do pato e tempere.", "Doure com a pele para baixo até ficar crocante.", "Reduza suco de laranja, mel e caldo.", "Fatie o pato e sirva com o molho."]
  },
  {
    title: "Tartar de salmão com avocado",
    description: "Salmão fresco em cubos, avocado cremoso, gergelim e molho cítrico para uma entrada precisa.",
    category: "Jantar rápido",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=90",
    prepTime: 22,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["240 g", "salmão fresco"], ["1 unidade", "avocado"], ["1 colher", "shoyu"], ["1 unidade", "limão"], ["1 colher", "gergelim"]],
    steps: ["Corte o salmão em cubos pequenos.", "Tempere com shoyu, limão e gergelim.", "Amasse o avocado com sal e limão.", "Monte em camadas e sirva gelado."]
  },
  {
    title: "Nhoque de mandioquinha com fonduta",
    description: "Nhoque delicado de mandioquinha servido com fonduta de queijo e pimenta-do-reino.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=90",
    prepTime: 55,
    servings: 4,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [["600 g", "mandioquinha"], ["1 xícara", "farinha"], ["1 unidade", "gema"], ["250 ml", "creme fresco"], ["160 g", "queijo grana padano"]],
    steps: ["Cozinhe e amasse a mandioquinha.", "Misture gema e farinha até dar ponto.", "Corte os nhoques e cozinhe rapidamente.", "Aqueça creme e queijo até formar fonduta."]
  },
  {
    title: "Salada de burrata com figos grelhados",
    description: "Burrata cremosa, figos caramelizados, folhas amargas e aceto para uma composição leve e sofisticada.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=90",
    prepTime: 18,
    servings: 2,
    difficulty: Difficulty.EASY,
    featured: false,
    ingredients: [["1 unidade", "burrata"], ["4 unidades", "figos"], ["2 xícaras", "rúcula"], ["1 colher", "mel"], ["2 colheres", "aceto balsâmico"]],
    steps: ["Grelhe os figos cortados com um fio de mel.", "Disponha rúcula e burrata no prato.", "Adicione figos mornos.", "Finalize com aceto, azeite e sal."]
  },
  {
    title: "Cogumelos glaceados com polenta cremosa",
    description: "Mix de cogumelos dourados com shoyu, vinho branco e polenta macia de parmesão.",
    category: "Vegetariano",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=90",
    prepTime: 36,
    servings: 3,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["400 g", "cogumelos variados"], ["1 xícara", "fubá mimoso"], ["4 xícaras", "caldo de legumes"], ["1/2 xícara", "parmesão"], ["2 colheres", "shoyu"]],
    steps: ["Cozinhe o fubá no caldo, mexendo até ficar cremoso.", "Finalize a polenta com parmesão.", "Doure os cogumelos em fogo alto.", "Glaceie com shoyu e vinho branco."]
  },
  {
    title: "Aspargos com ovo perfeito e hollandaise",
    description: "Aspargos tostados, ovo de gema cremosa e molho hollandaise sedoso para brunch de restaurante.",
    category: "Café da manhã",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=90",
    prepTime: 26,
    servings: 2,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [["12 unidades", "aspargos"], ["2 unidades", "ovos"], ["2 unidades", "gemas"], ["100 g", "manteiga clarificada"], ["1 colher", "suco de limão"]],
    steps: ["Toste os aspargos com azeite e sal.", "Cozinhe os ovos até a gema ficar cremosa.", "Emulsione gemas, limão e manteiga para o hollandaise.", "Monte e sirva imediatamente."]
  },
  {
    title: "French toast de brioche com mascarpone",
    description: "Brioche dourado, mascarpone batido e frutas frescas para um café da manhã de hotel boutique.",
    category: "Café da manhã",
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1400&q=90",
    prepTime: 24,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["4 fatias", "brioche"], ["2 unidades", "ovos"], ["1/2 xícara", "leite"], ["120 g", "mascarpone"], ["1 xícara", "frutas vermelhas"]],
    steps: ["Misture ovos, leite e baunilha.", "Passe o brioche na mistura.", "Doure na manteiga até ficar crocante.", "Sirva com mascarpone e frutas."]
  },
  {
    title: "Ovos cocotte com creme e ervas",
    description: "Ovos assados em ramequins com creme fresco, cogumelos e ervas finas.",
    category: "Café da manhã",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=90",
    prepTime: 21,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["4 unidades", "ovos"], ["1/2 xícara", "creme fresco"], ["1 xícara", "cogumelos"], ["1 colher", "cebolinha"], ["1 colher", "manteiga"]],
    steps: ["Unte ramequins com manteiga.", "Adicione creme, cogumelos e ovos.", "Asse em banho-maria até firmar as claras.", "Finalize com ervas."]
  },
  {
    title: "Mil-folhas de baunilha e caramelo",
    description: "Camadas crocantes de massa folhada com creme de baunilha e caramelo âmbar.",
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1400&q=90",
    prepTime: 80,
    servings: 6,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [["400 g", "massa folhada"], ["500 ml", "leite"], ["4 unidades", "gemas"], ["1/2 xícara", "açúcar"], ["1 unidade", "fava de baunilha"]],
    steps: ["Asse a massa folhada prensada até dourar.", "Prepare creme de confeiteiro com baunilha.", "Monte camadas alternadas.", "Finalize com caramelo fino."]
  },
  {
    title: "Pavlova de frutas amarelas",
    description: "Merengue crocante por fora, macio por dentro, creme leve e frutas tropicais ácidas.",
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=90",
    prepTime: 95,
    servings: 8,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [["4 unidades", "claras"], ["1 xícara", "açúcar"], ["1 colher", "amido de milho"], ["300 ml", "creme fresco"], ["2 xícaras", "frutas amarelas"]],
    steps: ["Bata claras com açúcar até formar merengue firme.", "Modele e asse em baixa temperatura.", "Bata o creme fresco.", "Cubra com creme e frutas na hora de servir."]
  },
  {
    title: "Crème brûlée de café",
    description: "Creme assado com infusão de café e crosta fina de açúcar queimado.",
    category: "Sobremesas",
    imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1400&q=90",
    prepTime: 65,
    servings: 6,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["500 ml", "creme fresco"], ["5 unidades", "gemas"], ["1/2 xícara", "açúcar"], ["2 colheres", "café forte"], ["3 colheres", "açúcar para queimar"]],
    steps: ["Aqueça o creme com café.", "Misture gemas e açúcar sem incorporar ar.", "Asse em banho-maria até firmar.", "Gele e queime açúcar no topo."]
  },
  {
    title: "Tagliatelle com ragu de cogumelos",
    description: "Massa longa com ragu profundo de cogumelos, vinho tinto e parmesão curado.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1400&q=90",
    prepTime: 50,
    servings: 4,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["400 g", "tagliatelle"], ["500 g", "cogumelos"], ["1/2 xícara", "vinho tinto"], ["1 unidade", "cebola"], ["1/2 xícara", "parmesão"]],
    steps: ["Doure cogumelos em fogo alto.", "Refogue cebola e volte os cogumelos.", "Reduza com vinho tinto.", "Misture à massa e finalize com parmesão."]
  },
  {
    title: "Risoto de açafrão com camarões",
    description: "Arroz cremoso com açafrão, camarões selados e finalização cítrica.",
    category: "Massas",
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1400&q=90",
    prepTime: 44,
    servings: 3,
    difficulty: Difficulty.HARD,
    featured: false,
    ingredients: [["1 xícara", "arroz arbóreo"], ["300 g", "camarões"], ["1 pitada", "açafrão"], ["1 litro", "caldo de legumes"], ["1/2 xícara", "parmesão"]],
    steps: ["Sele os camarões rapidamente e reserve.", "Prepare o risoto adicionando caldo aos poucos.", "Junte açafrão no meio do cozimento.", "Finalize com parmesão e camarões."]
  },
  {
    title: "Filé mignon ao molho de vinho",
    description: "Medalhões no ponto com redução de vinho tinto, manteiga fria e batatas douradas.",
    category: "Jantar rápido",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1400&q=90",
    prepTime: 40,
    servings: 2,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    ingredients: [["2 unidades", "medalhões de filé"], ["1 xícara", "vinho tinto"], ["1/2 xícara", "caldo de carne"], ["2 colheres", "manteiga fria"], ["300 g", "batatas bolinha"]],
    steps: ["Doure os medalhões e reserve.", "Reduza vinho e caldo na mesma frigideira.", "Monte o molho com manteiga fria.", "Sirva com batatas douradas."]
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
        authorId: admin.id,
        ingredients: {
          deleteMany: {},
          create: recipe.ingredients.map(([amount, name], index) => ({
            amount,
            name,
            normalizedName: normalizeIngredientName(name),
            order: index + 1
          }))
        },
        steps: {
          deleteMany: {},
          create: recipe.steps.map((content, index) => ({
            content,
            order: index + 1
          }))
        }
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
            normalizedName: normalizeIngredientName(name),
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
