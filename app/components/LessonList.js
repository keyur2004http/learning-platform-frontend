"use client";

import { useEffect, useState } from "react";

export default function LessonList({ courseId }) {
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  async function loadData() {
    try {
      const lessonsResponse = await fetch(`/api/courses/${courseId}/lessons`);
      const lessonsData = await lessonsResponse.json();

      if (!lessonsResponse.ok) {
        setError(lessonsData.detail || "Failed to load lessons");
        setLoading(false);
        return;
      }

      setLessons(lessonsData);

      const progressResponse = await fetch(`/api/courses/${courseId}/progress`);
      const progressData = await progressResponse.json();

      if (progressResponse.ok) {
        setProgress(progressData);
      }
    } catch {
      setError("An unexpected error occurred while fetching lessons.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [courseId]);

  async function completeLesson(lessonId) {
    setCompletingId(lessonId);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to complete lesson");
        return;
      }

      await loadData();
    } catch {
      setError("Failed to mark lesson as completed.");
    } finally {
      setCompletingId(null);
    }
  }

  /* Skeleton Loading State */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 animate-pulse space-y-3">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3"
            >
              <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* Error Banner */
  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Progress Card */}
      {progress && (
        <div className="p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-slate-700 dark:text-slate-300">
              Course Completion
            </span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {progress.progress}%
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progress.progress))}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {progress.completed_lessons} of {progress.total_lessons} lessons completed
          </p>
        </div>
      )}

      {/* Empty State */}
      {lessons.length === 0 && (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No lessons available for this course yet.
          </p>
        </div>
      )}

      {/* Lesson Item List */}
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const lessonProgress = progress?.lessons?.find(
            (item) => item.lesson_id === lesson.id
          );
          const completed = lessonProgress?.completed || false;
          const isSubmitting = completingId === lesson.id;

          return (
            <div
              key={lesson.id}
              className={`p-5 rounded-2xl border transition-all ${
                completed
                  ? "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-90"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                        completed
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                          : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      {lesson.order}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lesson.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-9">
                    {lesson.content}
                  </p>
                </div>

                {/* Completion Toggle Button */}
                <div className="sm:self-center pl-9 sm:pl-0">
                  <button
                    onClick={() => completeLesson(lesson.id)}
                    disabled={completed || isSubmitting}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      completed
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 cursor-default"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm active:scale-95 disabled:opacity-50"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5 animate-spin"
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
                        <span>Updating...</span>
                      </>
                    ) : completed ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Completed</span>
                      </>
                    ) : (
                      <span>Mark as Complete</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}