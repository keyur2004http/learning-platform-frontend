"use client";

import { useEffect, useState } from "react";

export default function ReviewSection({ courseId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [profile, setProfile] = useState(null);

  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [reviewsResponse, ratingResponse, profileResponse] =
        await Promise.all([
          fetch(`/api/courses/${courseId}/reviews`),
          fetch(`/api/courses/${courseId}/rating`),
          fetch("/api/profile"),
        ]);

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      }

      if (ratingResponse.ok) {
        const ratingData = await ratingResponse.json();
        setRating(ratingData);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      }
    } catch {
      setMessage("Failed to load review data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [courseId]);

  async function submitReview(event) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: courseId,
          rating: Number(selectedRating),
          comment: comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail ||
            data.rating?.[0] ||
            "Failed to submit review."
        );
        return;
      }

      setMessage("Review submitted successfully.");
      setComment("");
      setSelectedRating(5);

      await loadData();
    } catch {
      setMessage("An error occurred while submitting your review.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(review) {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
    setMessage("");
  }

  function cancelEdit() {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  }

  async function updateReview(reviewId) {
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reviewId,
          rating: Number(editRating),
          comment: editComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail ||
            data.rating?.[0] ||
            "Failed to update review."
        );
        return;
      }

      setMessage("Review updated successfully.");
      cancelEdit();
      await loadData();
    } catch {
      setMessage("An error occurred while updating the review.");
    }
  }

  async function deleteReview(reviewId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let data = {};
        try {
          data = await response.json();
        } catch {
          data = {};
        }

        setMessage(data.detail || "Failed to delete review.");
        return;
      }

      setMessage("Review deleted successfully.");
      await loadData();
    } catch {
      setMessage("An error occurred while deleting the review.");
    }
  }

  /* Star Rating Renderer */
  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={
          i < count
            ? "text-amber-400"
            : "text-slate-300 dark:text-slate-700"
        }
      >
        ★
      </span>
    ));
  };

  /* Skeleton Loading State */
  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Section Header & Rating Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Student Reviews
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Read feedback from students enrolled in this course
          </p>
        </div>

        {rating && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {rating.average_rating
                ? Number(rating.average_rating).toFixed(1)
                : "0.0"}
            </div>
            <div>
              <div className="flex text-sm leading-none">
                {renderStars(Math.round(rating.average_rating || 0))}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                {rating.total_reviews}{" "}
                {rating.total_reviews === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Global Message Banner */}
      {message && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium flex items-center gap-2">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{message}</span>
        </div>
      )}

      {/* Write a Review Form */}
      {profile && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Write a Review
          </h3>

          <form onSubmit={submitReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(event) =>
                    setSelectedRating(event.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium cursor-pointer"
                >
                  <option value="5">5 ⭐ - Excellent</option>
                  <option value="4">4 ⭐ - Very Good</option>
                  <option value="3">3 ⭐ - Average</option>
                  <option value="2">2 ⭐ - Below Average</option>
                  <option value="1">1 ⭐ - Poor</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Comment
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share your experience with this course..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm leading-relaxed resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm active:scale-95 disabled:opacity-50 transition-all"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              No reviews yet. Be the first to review this course!
            </p>
          </div>
        ) : (
          reviews.map((review) => {
            const isOwnReview = profile && review.student === profile.id;
            const isEditing = editingReviewId === review.id;

            return (
              <div
                key={review.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
              >
                {isEditing ? (
                  /* Inline Edit Form */
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Edit Your Review
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          Rating
                        </label>
                        <select
                          value={editRating}
                          onChange={(event) =>
                            setEditRating(event.target.value)
                          }
                          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="5">5 ⭐ - Excellent</option>
                          <option value="4">4 ⭐ - Very Good</option>
                          <option value="3">3 ⭐ - Average</option>
                          <option value="2">2 ⭐ - Below Average</option>
                          <option value="1">1 ⭐ - Poor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          Comment
                        </label>
                        <textarea
                          rows={3}
                          value={editComment}
                          onChange={(event) =>
                            setEditComment(event.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateReview(review.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Review Item */
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex text-sm">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {review.rating}.0
                        </span>
                      </div>

                      {isOwnReview && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(review)}
                            className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="px-2.5 py-1 rounded-md text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {review.comment || (
                        <span className="italic text-slate-400 dark:text-slate-500">
                          No written comment provided.
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}