import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${appUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    }
  ];

  if (!process.env.POSTGRES_PRISMA_URL) {
    return staticRoutes;
  }

  const [recipes, categories] = await Promise.all([
    prisma.recipe.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true }
    })
  ]);

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: `${appUrl}/recipes?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...recipes.map((recipe) => ({
      url: `${appUrl}/recipes/${recipe.slug}`,
      lastModified: recipe.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
