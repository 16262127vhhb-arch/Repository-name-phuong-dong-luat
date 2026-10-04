import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://liemminhlaw.com";

  const articles = await sql`
    SELECT
      slug,
      category,
      updated_at,
      published_at,
      created_at
    FROM articles
    WHERE published = true
    ORDER BY created_at DESC
  `;

  const categoryUrls = [
    "hon-nhan-gia-dinh",
    "hinh-su",
    "dan-su",
    "dat-dai",
    "doanh-nghiep",
    "kinh-doanh-thuong-mai",
    "lao-dong",
    "thi-hanh-an",
    "cac-linh-vuc-khac",
  ].map((slug) => ({
    url: `${baseUrl}/bai-viet/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/bai-viet/${slugify(article.category)}/${article.slug}`,
    lastModified:
      article.updated_at ||
      article.published_at ||
      article.created_at ||
      new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/bai-viet`,
      changeFrequency: "daily",
      priority: 0.9,
    },

    ...categoryUrls,

    {
      url: `${baseUrl}/gioi-thieu`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lien-he`,
      changeFrequency: "monthly",
      priority: 0.5,
    },

    ...articleUrls,
  ];
}