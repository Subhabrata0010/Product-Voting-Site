"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  productAPI,
  voteAPI,
  Product,
  Vote,
  SentimentAnalysis,
} from "@/lib/api";
import VoteForm from "@/components/VoteForm";
import SentimentDisplay from "@/components/SentimentDisplay";
import Image from "next/image";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
  }, [params.id]);

  const fetchProductData = async () => {
    try {
      const [productRes, votesRes, sentimentRes] = await Promise.all([
        productAPI.getById(params.id as string),
        voteAPI.getByProduct(params.id as string),
        voteAPI.getSentiment(params.id as string),
      ]);

      setProduct(productRes.data.data);
      setVotes(votesRes.data.data);
      setSentiment(sentimentRes.data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSubmitted = () => {
    fetchProductData();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Product not found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={384}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            loading="lazy"
          />
        </div>

        <div>
          <div className="flex flex-row flex-wrap justify-between me-10">
            <div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-6 text-lg">
                {product.description}
              </p>
            </div>
            <div className="flex items-center gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-yellow-500">
                    {product.averageRating.toFixed(1)}
                  </span>
                  <span className="text-yellow-500 text-3xl">★</span>
                </div>
                <p className="text-sm text-gray-600">
                  {product.totalVotes} votes
                </p>
              </div>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                {product.category}
              </span>
            </div>
          </div>
          {sentiment && <SentimentDisplay sentiment={sentiment} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Submit Your Vote</h2>
          <VoteForm
            productId={product._id}
            onVoteSubmitted={handleVoteSubmitted}
          />
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto border-2 border-gray-400 p-4 rounded-lg">
            {votes.length === 0 ? (
              <p className="text-gray-600">No reviews yet. Be the first!</p>
            ) : (
              votes.slice(0, 10).map((vote) => (
                <div
                  key={vote._id}
                  className="border-3 border-pink-500 rounded-tl-4xl rounded-br-4xl rounded-tr-4xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">
                      {"★".repeat(vote.rating)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-2xl text-xs font-medium ${
                        vote.sentiment === "positive"
                          ? "bg-green-200 text-green-800 border-2 border-green-700"
                          : vote.sentiment === "negative"
                          ? "bg-red-200 text-red-800 border-2 border-red-700"
                          : "bg-gray-300 text-gray-800 border-2 border-gray-700"
                      }`}
                    >
                      {vote.sentiment}
                    </span>
                  </div>
                  <p className="text-gray-900">{vote.comment}</p>
                  <p className="text-xs text-gray-800 mt-2">
                    {new Date(vote.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
