import "server-only";

import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

type NewRecipeEmail = {
  title: string;
  slug: string;
  description: string;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
}

function getSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function notifyUsersAboutNewRecipe(recipe: NewRecipeEmail) {
  const transport = getSmtpTransport();

  if (!transport) {
    console.info("SMTP não configurado. Aviso de nova receita não enviado.");
    return;
  }

  const subscribers = await prisma.user.findMany({
    where: { emailNotifications: true },
    select: { email: true, name: true }
  });

  if (!subscribers.length) return;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const recipeUrl = `${getBaseUrl().replace(/\/$/, "")}/recipes/${recipe.slug}`;

  await Promise.allSettled(
    subscribers.map((subscriber) =>
      transport.sendMail({
        from,
        to: subscriber.email,
        subject: `Receita nova: ${recipe.title}`,
        text: `Olá, ${subscriber.name}!\n\nAcabei de publicar uma receita nova: ${recipe.title}.\n\n${recipe.description}\n\nVeja aqui: ${recipeUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f211d; line-height: 1.6;">
            <h1 style="margin: 0 0 12px;">Receita nova no ar</h1>
            <p>Olá, ${subscriber.name}!</p>
            <p>Acabei de publicar uma receita nova: <strong>${recipe.title}</strong>.</p>
            <p>${recipe.description}</p>
            <p><a href="${recipeUrl}" style="color: #50614a; font-weight: 700;">Abrir receita</a></p>
          </div>
        `
      })
    )
  );
}
