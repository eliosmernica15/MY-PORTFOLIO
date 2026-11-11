import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { PROJECTS } from "@/data/projects";
import { NOTES } from "@/data/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date().toISOString();
  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${base}/en`,
          sq: `${base}/sq`,
          "x-default": `${base}/en`,
        },
      },
    },
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/sq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/notes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...PROJECTS.map((p) => ({
      url: `${base}/project/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...NOTES.map((n) => ({
      url: `${base}/notes/${n.slug}`,
      lastModified: n.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
