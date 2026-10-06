"use client";

import { useState } from "react";

export default function EnrollButton({ courseId }) {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Enrollment failed.");
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      setMessage("Successfully enrolled!");
      setIsSuccess(true);
    } catch {
      setMessage("An unexpected error occurred. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleEnroll}
        disabled={loading || isSuccess}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
          isSuccess
            ? "bg-emerald-600 text-white dark:bg-emerald-500"
            : "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
        }`}
      >
        {loading ? (
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
            <span>Enrolling...</span>
          </>
        ) : isSuccess ? (
          <>
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Enrolled</span>
          </>
        ) : (
          <span>Enroll Now</span>
        )}
      </button>

      {/* Dynamic Feedback Message */}
      {message && (
        <div
          className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
            isSuccess
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
              : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/50"
          }`}
        >
          {isSuccess ? (
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 flex-shrink-0"
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
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}