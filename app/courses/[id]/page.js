import Link from "next/link";
import EnrollButton from "../../components/EnrollButton";
import LessonList from "../../components/LessonList";
import ReviewSection from "../../components/ReviewSection";
import { BACKEND_URL } from "../../lib/config";
export default async function CourseDetails({ params }) {
  const { id } = await params;

  const response = await fetch(`${BACKEND_URL}/api/courses/${id}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Course not found");
  }

  const course = await response.json();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation / Breadcrumb */}
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Courses
          </Link>
        </div>

        {/* Hero Banner / Course Summary Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                {course.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                  course.status === "published" || course.status === "active"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40"
                }`}
              >
                {course.status}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ₹{course.price}
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {course.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <EnrollButton courseId={course.id} />
          </div>
        </div>

        {/* Curriculum / Lessons Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Course Content
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore the modules and lessons included in this course
            </p>
          </div>

          <LessonList courseId={course.id} />
        </section>

        {/* Reviews Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Student Reviews
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              See what other learners are saying about this course
            </p>
          </div>

          <ReviewSection courseId={course.id} />
        </section>

      </div>
    </main>
  );
}