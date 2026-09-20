import Link from "next/link";
import { notFound } from "next/navigation";
import { reader } from "@/lib/reader";

export async function generateStaticParams() {
  const sections = await reader.collections.sections.list();
  return sections.map((slug) => ({ section: slug }));
}

export default async function SectionPage(
  props: PageProps<"/[section]">
) {
  const { section } = await props.params;

  const sectionEntry = await reader.collections.sections.read(section);
  if (!sectionEntry) notFound();

  const allArticles = await reader.collections.articles.all();
  const sectionArticles = allArticles
    .filter((a) => a.entry.section === section)
    .sort((a, b) => {
      const da = a.entry.publishedAt ? new Date(a.entry.publishedAt).getTime() : 0;
      const db = b.entry.publishedAt ? new Date(b.entry.publishedAt).getTime() : 0;
      return db - da;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &larr; Back to Knowledge Base
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl">{sectionEntry.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {sectionEntry.title}
              </h1>
              {sectionEntry.description && (
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {sectionEntry.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {sectionArticles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No articles yet.</p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {sectionArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/${section}/${a.slug}`}
                className="group block py-5 first:pt-0"
              >
                <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {a.entry.title}
                </h2>
                {a.entry.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {a.entry.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3">
                  {a.entry.publishedAt && (
                    <time className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(a.entry.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {a.entry.tags && a.entry.tags.length > 0 && (
                    <div className="flex gap-1">
                      {a.entry.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
