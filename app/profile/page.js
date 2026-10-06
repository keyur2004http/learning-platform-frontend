"use client";

import { useEffect, useState } from "react";
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (!response.ok) {
          setError(data.detail || "Failed to load profile");
          setLoading(false);
          return;
        }

        setProfile(data);
      } catch {
        setError("An unexpected error occurred while fetching your profile.");
      }  {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Account Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage your account details and information
          </p>
        </div>

        {/* Error State */}
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
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-56 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        )}

        {/* Profile Card */}
        {!loading && !error && profile && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            {/* User Hero Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-extrabold uppercase shadow-sm">
                {profile.username ? profile.username.charAt(0) : "U"}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {profile.username}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {profile.email}
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    ID: #{profile.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Username
                </label>
                <div className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-900 dark:text-white text-sm font-medium">
                  {profile.username}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Email Address
                </label>
                <div className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-900 dark:text-white text-sm font-medium">
                  {profile.email}
                </div>
              </div>

              {/* Bio Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Bio
                </label>
                <div className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-900 dark:text-white text-sm font-normal min-h-[80px] leading-relaxed">
                  {profile.bio || (
                    <span className="text-slate-400 dark:text-slate-500 italic">
                      No bio provided.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}