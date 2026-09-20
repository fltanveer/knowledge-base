import Link from "next/link";
import { notFound } from "next/navigation";
import Markdoc from "@markdoc/markdoc";
import { reader } from "@/lib/reader";
import { markdocConfig } from "@/lib/markdoc-config";
import { renderMarkdoc } from "@/lib/markdoc";

export async function generateStaticParams() {
  const articles = await reader.collections.articles.all();
  return articles
    .filter((a) => a.entry.section)
    .map((a) => ({
      section: a.entry.section!,
      slug: a.slug,
    }));
}

export default async function ArticlePage(
  props: PageProps<"/[section]/[slug]">
) {
  const { section, slug } = await props.params;

  const sectionEntry = await reader.collections.sections.read(section);
  if (!sectionEntry) notFound();

  const article = await reader.collections.articles.read(slug, {
    resolveLinkedFiles: true,
  });
  if (!article || article.section !== section) notFound();

  const node =
    typeof article.content === "object" && "node" in article.content
      ? (article.content.node as unknown as import("@markdoc/markdoc").Node)
      : Markdoc.parse("");
  const content = Markdoc.transform(node, markdocConfig);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/${section}`}
              className="hover:text-gray-700 dark:hover:text-gray-200"
            >
              {sectionEntry.title}
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h1>
          {article.description && (
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              {article.description}
            </p>
          )}
          <div className="mt-4 flex items-center gap-4">
            {article.publishedAt && (
              <time className="text-sm text-gray-400 dark:text-gray-500">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {article.updatedAt && (
              <span className="text-sm text-gray-400 dark:text-gray-500">
                Updated{" "}
                {new Date(article.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <article className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg">
          {renderMarkdoc(content)}
        </article>
      </main>
    </div>
  );
}
