import { expect, type Page, test } from "@playwright/test";

const runId = Date.now();
const user = {
  name: "Teste Savor",
  email: `savor-e2e-${runId}@example.com`,
  password: "SenhaForte123"
};

async function openFirstRecipe(page: Page) {
  await page.goto("/recipes");
  const firstRecipe = page.locator('a[href^="/recipes/"]').filter({ has: page.locator("h3") }).first();
  await firstRecipe.click();
  await page.waitForURL(/\/recipes\/[^/?]+$/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

test.describe.serial("fluxos principais", () => {
  test("filtro de despensa encontra receitas compatíveis", async ({ page }) => {
    await page.goto("/recipes");
    await page.getByRole("button", { name: /O que tenho em casa/i }).click();

    await expect(page.getByRole("dialog", { name: /Cozinhe com o que você tem/i })).toBeVisible();
    await page.getByRole("button", { name: "Ovos", exact: true }).click();
    await page.getByRole("button", { name: "Leite", exact: true }).click();
    await page.getByRole("button", { name: "Farinha", exact: true }).click();
    await page.getByRole("button", { name: "Encontrar receitas" }).click();

    await expect(page).toHaveURL(/pantry=.*ovo/);
    await expect(page.getByText(/compatível/i).first()).toBeVisible();
    await expect(page.getByText(/Você já possui/i).first()).toBeVisible();
  });

  test("cadastro cria uma sessão de usuário", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Nome").fill(user.name);
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Senha", { exact: true }).fill(user.password);
    await page.getByLabel("Confirmar senha").fill(user.password);
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: /Olá/i })).toBeVisible();
  });

  test("login autentica usuário existente", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Senha").fill(user.password);
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
  });

  test("favorito e comentário funcionam em uma receita publicada", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Senha").fill(user.password);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

    await openFirstRecipe(page);
    await page.getByRole("button", { name: /Salvar receita|Salva/i }).click();
    await expect(page.getByText(/Receita salva|Receita removida/)).toBeVisible();

    const comment = `Comentário automatizado ${runId}`;
    await page.getByLabel("Comentar receita").fill(comment);
    await page.getByRole("button", { name: "Publicar comentário" }).click();
    await expect(page.getByText("Comentário publicado.")).toBeVisible();
    await page.reload();
    await expect(page.getByText(comment)).toBeVisible();
  });

  test("usuário envia receita para revisão", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Senha").fill(user.password);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

    await page.goto("/dashboard/recipes/new");
    await page.getByLabel("Título").fill(`Receita E2E ${runId}`);
    await page.getByLabel("Descrição").fill("Receita criada por teste automatizado para validar o fluxo de envio.");
    await page.getByLabel("Imagem por URL").fill("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80");
    await page.getByLabel("Categoria").selectOption({ index: 1 });
    await page.getByLabel("Dificuldade").selectOption("EASY");
    await page.getByLabel("Tempo de preparo").fill("25");
    await page.getByLabel("Porções").fill("2");
    await page.getByPlaceholder("Quantidade").first().fill("2 xícaras");
    await page.getByPlaceholder("Ingrediente").first().fill("ingrediente de teste");
    await page.getByPlaceholder("Passo 1").fill("Misture tudo e finalize o prato.");
    await page.getByRole("button", { name: "Enviar para revisão" }).click();

    await expect(page).toHaveURL(/\/dashboard\/recipes/, { timeout: 30_000 });
    await expect(page.getByText(`Receita E2E ${runId}`)).toBeVisible();
  });
});
