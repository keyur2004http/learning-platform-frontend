import Link from "next/link";
// import { BACKEND_URL } from "../../lib/config";
import { BACKEND_URL } from "../lib/config";
export default async function Courses({ searchParams }) {
  const params = await searchParams;

  const search = params?.search || "";
  const category = params?.category || "";
  const minPrice = params?.min_price || "";
  const maxPrice = params?.max_price || "";
  const page = params?.page || "1";

  const query = new URLSearchParams();

  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (minPrice) query.set("min_price", minPrice);
  if (maxPrice) query.set("max_price", maxPrice);
  if (page) query.set("page", page);

  const response = await fetch(
    `${BACKEND_URL}/api/courses/?${query.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const data = await response.json();

  const prevQuery = new URLSearchParams();
  if (search) prevQuery.set("search", search);
  if (category) prevQuery.set("category", category);
  if (minPrice) prevQuery.set("min_price", minPrice);
  if (maxPrice) prevQuery.set("max_price", maxPrice);
  prevQuery.set("page", String(Number(page) - 1));

  const nextQuery = new URLSearchParams();
  if (search) nextQuery.set("search", search);
  if (category) nextQuery.set("category", category);
  if (minPrice) nextQuery.set("min_price", minPrice);
  if (maxPrice) nextQuery.set("max_price", maxPrice);
  nextQuery.set("page", String(Number(page) + 1));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Explore Courses
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Discover top-rated development and technology courses
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4 space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search courses..."
                  defaultValue={search}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-3 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Category
              </label>
              <select
                name="category"
                defaultValue={category}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="programming">Programming</option>
                <option value="web">Web Development</option>
                <option value="database">Database</option>
                <option value="devops">DevOps</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Min Price
                </label>
                <input
                  type="number"
                  name="min_price"
                  placeholder="₹ Min"
                  defaultValue={minPrice}
                  min="0"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Max Price
                </label>
                <input
                  type="number"
                  name="max_price"
                  placeholder="₹ Max"
                  defaultValue={maxPrice}
                  min="0"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-500/20 active:scale-95 transition-all text-center"
              >
                Search
              </button>

              <Link
                href="/courses"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
              >
                Clear
              </Link>
            </div>
          </form>
        </div>

        {data.results?.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No courses found
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any courses matching your search criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results?.map((course) => (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                      {course.category}
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ₹{course.price}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {course.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all group/btn"
                  >
                    <span>View Course</span>
                    <svg
                      className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {(data.previous || data.next) && (
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            {data.previous && (
              <Link
                href={`?${prevQuery.toString()}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                ← Previous
              </Link>
            )}

            {data.next && (
              <Link
                href={`?${nextQuery.toString()}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}