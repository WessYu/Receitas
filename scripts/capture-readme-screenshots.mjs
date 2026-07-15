import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "docs", "screenshots");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9222;
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";

function readEnv() {
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) return {};

  const lines = readFile(envPath, "utf8");
  return lines.then((content) =>
    Object.fromEntries(
      content
        .split(/\r?\n/)
        .map((line) => line.match(/^\s*([A-Za-z0-9_]+)=(.*)\s*$/))
        .filter(Boolean)
        .map((match) => [match[1], match[2].trim().replace(/^"|"$/g, "")])
    )
  );
}

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

async function connectToChrome() {
  for (let index = 0; index < 60; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
      if (response.ok) {
        const target = await response.json();
        return new WebSocket(target.webSocketDebuggerUrl);
      }
    } catch {
      await wait(250);
    }
  }

  throw new Error("Chrome DevTools Protocol did not become available.");
}

async function createClient(socket) {
  let id = 0;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id && pending.has(message.id)) {
      const { resolve: resolvePending, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolvePending(message.result);
      return;
    }

    const callbacks = listeners.get(message.method) ?? [];
    callbacks.forEach((callback) => callback(message.params));
  });

  await new Promise((resolveOpen) => socket.addEventListener("open", resolveOpen, { once: true }));

  return {
    send(method, params = {}) {
      id += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolveSend, reject) => pending.set(id, { resolve: resolveSend, reject }));
    },
    once(method) {
      return new Promise((resolveOnce) => {
        const current = listeners.get(method) ?? [];
        const callback = (params) => {
          listeners.set(
            method,
            (listeners.get(method) ?? []).filter((item) => item !== callback)
          );
          resolveOnce(params);
        };
        listeners.set(method, [...current, callback]);
      });
    },
    close() {
      socket.close();
    }
  };
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await rm(resolve(root, ".tmp-chrome-screenshots"), { recursive: true, force: true });

  const chrome = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${resolve(root, ".tmp-chrome-screenshots")}`,
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1440,1200",
    "about:blank"
  ]);

  chrome.stderr.on("data", () => undefined);

  const socket = await connectToChrome();
  const client = await createClient(socket);
  const env = await readEnv();

  await client.send("Page.enable");
  await client.send("Network.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });

  async function navigate(path) {
    const loaded = client.once("Page.loadEventFired");
    await client.send("Page.navigate", { url: `${baseUrl}${path}` });
    await loaded;
    await wait(1600);
  }

  async function evaluate(expression) {
    const result = await client.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    return result.result.value;
  }

  async function screenshot(name) {
    const { data } = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false
    });
    await writeFile(resolve(outDir, name), Buffer.from(data, "base64"));
  }

  async function setAdminSession() {
    if (!env.SESSION_SECRET) return false;

    const databaseUrl = env.POSTGRES_PRISMA_URL ?? env.DATABASE_URL;
    if (!databaseUrl) return false;

    process.env.POSTGRES_PRISMA_URL = databaseUrl;
    process.env.SESSION_SECRET = env.SESSION_SECRET;

    const [{ PrismaClient }, { SignJWT }] = await Promise.all([import("@prisma/client"), import("jose")]);
    const prisma = new PrismaClient();
    const admin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
        ...(env.ADMIN_EMAIL ? { email: env.ADMIN_EMAIL.toLowerCase() } : {})
      },
      select: { id: true, role: true }
    });
    await prisma.$disconnect();

    if (!admin) return false;

    const token = await new SignJWT({ userId: admin.id, role: admin.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(env.SESSION_SECRET));

    await client.send("Network.setCookie", {
      name: "receitas_session",
      value: token,
      url: baseUrl,
      path: "/",
      httpOnly: true,
      sameSite: "Lax"
    });

    return true;
  }

  await navigate("/");
  await screenshot("home.png");

  await navigate("/recipes");
  const recipePath = await evaluate(`(() => {
    const link = Array.from(document.querySelectorAll("a"))
      .map((item) => new URL(item.href).pathname)
      .find((pathname) => /^\\/recipes\\/.+/.test(pathname) && !pathname.endsWith("/cook"));
    return link || "/recipes";
  })()`);

  await navigate(recipePath);
  await screenshot("recipe.png");

  await navigate(`${recipePath}/cook`);
  await screenshot("flow.png");

  if (await setAdminSession()) {
    await navigate("/dashboard");
    await screenshot("kitchen.png");
    await navigate("/admin");
    await screenshot("admin.png");
  } else {
    await navigate("/dashboard");
    await screenshot("kitchen.png");
    await navigate("/login");
    await screenshot("admin.png");
  }

  client.close();
  chrome.kill();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
