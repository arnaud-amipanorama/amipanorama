import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDraftPage } from "@/data/draft-pages";
import { pageMeta } from "@/lib/seo";

export function draftMetadata(slug: string): Metadata {
  const page = getDraftPage(slug);
  return pageMeta({
    title: page?.title ?? "Brouillon",
    description: "Page en préparation.",
    path: page?.path ?? "/",
    index: false,
  });
}

export function DraftPage({ slug }: { slug: string }) {
  const page = getDraftPage(slug);
  if (!page || !page.publish) notFound();

  const sections = page.sections.filter((section) => section.body);
  if (sections.length === 0) notFound();

  return (
    <article style={{ maxWidth: 760, margin: "0 auto", padding: "140px 24px 96px" }}>
      <h1>{page.title}</h1>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </article>
  );
}
