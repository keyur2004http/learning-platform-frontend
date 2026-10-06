"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
export default function ManageCourse() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(1);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      const courseResponse = await fetch(`/api/courses/${id}`);
      const courseData = await courseResponse.json();

      if (!courseResponse.ok) {
        setError(courseData.detail || "Failed to load course.");
        setLoading(false);
        return;
      }

      setCourse(courseData);

      const lessonsResponse = await fetch(`/api/courses/${id}/lessons`);
      const lessonsData = await lessonsResponse.json();

      if (lessonsResponse.ok) {
        setLessons(lessonsData);
        if (lessonsData.length > 0) {
          const maxOrder = Math.max(...lessonsData.map((l) => l.order || 0));
          setOrder(maxOrder + 1);
        }
      }
    } catch {
      setError("An unexpected error occurred while fetching course details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: Number(id),
          title,
          content,
          order: Number(order),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            data.title?.[0] ||
            data.content?.[0] ||
            "Failed to create lesson."
        );
        setSaving(false);
        return;
      }

      setTitle("");
      setContent("");
      await loadData();
    } catch {
      setError("Failed to create lesson. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  /* Skeleton Loading State */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="lg:col-span-7 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  /* Not Found / Error State */
  if (!course) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-md w-full shadow-sm">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {error || "Course not found."}
          </p>
          <Link
            href="/my-created-courses"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Back to My Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb & Header */}
        <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800">
          <Link
            href="/my-created-courses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to My Courses</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Manage Course Lessons
              </h1>
              <p className="mt-1 text-base font-semibold text-indigo-600 dark:text-indigo-400">
                {course.title}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
              </span>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
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

        {/* Two-Column Grid: Form & Lessons List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Add Lesson Form */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Add New Lesson
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Create and append a new lesson module to this course
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Lesson Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Introduction to React Hooks"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Order Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Lesson Sequence Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={order}
                  onChange={(event) => setOrder(event.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Lesson Content */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Lesson Content
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Write detailed lesson explanation or resources here..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-normal leading-relaxed resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm active:scale-95 disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Adding Lesson...</span>
                  </>
                ) : (
                  <span>Add Lesson</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Existing Lessons List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Existing Lessons
              </h2>
            </div>

            {lessons.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No lessons created for this course yet.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Use the form on the left to publish your first lesson.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-900/40">
                        {lesson.order}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {lesson.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                      {lesson.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}