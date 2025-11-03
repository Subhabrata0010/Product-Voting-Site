import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  author?: string;
  averageRating: number;
  totalVotes: number;
  sentimentScore: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  _id: string;
  productId: string;
  rating: number;
  comment: string;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface SentimentAnalysis {
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  averageSentiment: number;
  totalVotes: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface CreateVoteData {
  productId: string;
  rating: number;
  comment: string;
}

export const productAPI = {
  getAll: () => api.get<{ success: boolean; data: Product[] }>("/products"),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Product }>(`/products/${id}`),
  create: (data: CreateProductData) =>
    api.post<{ success: boolean; data: Product }>("/products", data),
  update: (id: string, data: Partial<CreateProductData>) =>
    api.put<{ success: boolean; data: Product }>(`/products/${id}`, data),
  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/products/${id}`),
};

export const voteAPI = {
  create: (data: CreateVoteData) =>
    api.post<{ success: boolean; data: Vote }>("/votes", data),
  getByProduct: (productId: string) =>
    api.get<{ success: boolean; data: Vote[] }>(`/votes/${productId}`),
  getSentiment: (productId: string) =>
    api.get<{ success: boolean; data: SentimentAnalysis }>(
      `/votes/${productId}/sentiment`
    ),
};

export const adminAPI = {
  signup: (data: {
    name: string;
    username: string;
    email: string;
    contact: string;
    password: string;
    profileURL?: string;
  }) => api.post("/admin/signup", data),
  login: (email: string, password: string) =>
    api.post("/admin/login", { email, password }),
  logout: () => api.post("/admin/logout"),
  getAdmin: () => api.get("/admin/getadmin"),
};

export default api;
