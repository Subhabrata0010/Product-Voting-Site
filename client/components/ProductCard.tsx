import Link from 'next/link';
import { Product } from '@/lib/api';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product._id}`}>
      <div className="card hover:shadow-xl transition-shadow cursor-pointer h-full p-4 rounded-3xl bg-gray-300">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={300}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <span className="inline-block bg-blue-100 text-blue-800 border-2 border-blue-700 px-2 py-1 rounded text-sm font-medium mb-2">
          {product.category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-lg">
            <span className="text-md font-bold text-yellow-500">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-yellow-500 text-md">★</span>
          </div>
          <span className="text-gray-600 text-sm">
            {product.totalVotes} votes
          </span>
        </div>
      </div>
    </Link>
  );
}