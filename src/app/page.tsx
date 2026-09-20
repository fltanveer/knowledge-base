import Link from "next/link";
import { reader } from "@/lib/reader";

export default async function HomePage() {
  const [sections, articles] = await Promise.all([
    reader.collections.sections.all(),
    reader.collections.articles.all(),
  ]);

  const sortedSections = sections.sort(
    (a, b) => (a.entry.sortOrder ?? 0) - (b.entry.sortOrder ?? 0)
  );

  const featuredArticles = articles
    .filter((a) => a.entry.featured)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Knowledge Base
          </h1>
          <nav className="flex gap-4">
            <Link
              href="/keystatic"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Edit Content
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <section>
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Browse by Section
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSections.map((s) => {
              const articleCount = articles.filter(
                (a) => a.entry.section === s.slug
              ).length;

              return (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="group rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600"
                >
                  <span className="text-2xl">{s.entry.icon}</span>
                  <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {s.entry.title}
                  </h3>
                  {s.entry.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {s.entry.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {articleCount} article{articleCount !== 1 ? "s" : ""}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {featuredArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Featured
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${a.entry.section}/${a.slug}`}
                  className="group rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {a.entry.title}
                  </h3>
                  {a.entry.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {a.entry.description}
                    </p>
                  )}
                  {a.entry.tags && a.entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {a.entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
