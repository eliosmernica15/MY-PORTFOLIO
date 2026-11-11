import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOTES } from "@/data/notes";
import { SITE } from "@/data/site";
import { NoteDetailClient } from "../notes-client";

export const dynamicParams = false;

export function generateStaticParams() {
  return NOTES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);
  if (!note) return { title: "Note not found" };
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.summary,
      url: `${SITE.url}/notes/${note.slug}`,
      publishedTime: note.date,
      tags: note.tags,
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);
  if (!note) notFound();

  return <NoteDetailClient slug={slug} />;
}
