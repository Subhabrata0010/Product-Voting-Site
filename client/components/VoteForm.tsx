"use client";

import { useState } from "react";
import { voteAPI } from "@/lib/api";

interface VoteFormProps {
  productId: string;
  onVoteSubmitted: () => void;
}

export default function VoteForm({
  productId,
  onVoteSubmitted,
}: VoteFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await voteAPI.create({ productId, rating, comment });
      setMessage("Vote submitted successfully!");
      setComment("");
      setRating(5);
      onVoteSubmitted();
    } catch (error: unknown) {
      // extract a readable message from various error shapes (Error instance, Axios-like, or simple strings)
      let errMsg = "Error submitting vote";
      if (error instanceof Error && error.message) {
        errMsg = error.message;
      } else if (typeof error === "string" && error.length > 0) {
        errMsg = error;
      } else if (typeof error === "object" && error !== null) {
        const e = error as Record<string, unknown>;
        const response = e["response"] as Record<string, unknown> | undefined;
        const data = response?.["data"] ?? e["data"];
        if (typeof data === "string") {
          errMsg = data;
        } else if (typeof data === "object" && data !== null) {
          const d = data as Record<string, unknown>;
          const maybeMessage = d["message"];
          if (typeof maybeMessage === "string") {
            errMsg = maybeMessage;
          }
        }
      }
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.includes("Error")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Rating: {rating} stars
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Your Review (min 10 characters)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share your experience with this product..."
          required
          minLength={10}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        {loading ? "Submitting..." : "Submit Vote"}
      </button>
    </form>
  );
}
