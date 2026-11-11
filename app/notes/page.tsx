import type { Metadata } from "next";
import { NOTES } from "@/data/notes";
import { SITE } from "@/data/site";
import { NotesIndexClient } from "./notes-client";

export const metadata: Metadata = {
  title: "Notes",
  description: `Writing from ${SITE.name} on AI systems, web performance, and software craft.`,
  alternates: { canonical: "/notes" },
};

export default function NotesIndex() {
  return <NotesIndexClient />;
}
