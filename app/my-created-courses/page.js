"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
export default function MyCreatedCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  async function deleteCourse(courseId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Failed to delete course.");
        return;
      }

      setCourses((currentCourses) =>
        currentCourses.filter((course) => course.id !== courseId)
      );
    } catch {
      setError("An unexpected error occurred while deleting the course.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch("/api/my-created-courses");
        const data = await response.json();

        if (!response.ok) {
          setError(data.detail || "Failed to load your courses.");
          setLoading(false);
          return;
        }

        setCourses(data);
      } catch {
        setError("An unexpected error occurred while fetching your courses.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Create CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              My Created Courses
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your authored courses, lessons, and content
            </p>
          </div>
          <Link
            href="/create-course"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No courses created yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You have not authored any courses. Start sharing your knowledge by creating your first course today.
              </p>
            </div>
          </div>
        )}

        {/* Course Grid */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isDeleting = deletingId === course.id;

              return (
                <div
                  key={course.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-5"
                >
                  <div className="space-y-3">
                    {/* Category & Status Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                        {course.category}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          course.status?.toLowerCase() === "published"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>

                    {/* Course Title & Description */}
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                        {course.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Price Tag */}
                    <div className="pt-1">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                        ₹{course.price}
                      </span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
                      >
                        View
                      </Link>
                      <Link
                        href={`/edit-course/${course.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
                      >
                        Edit
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/manage-course/${course.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-center"
                      >
                        Lessons
                      </Link>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-center disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}