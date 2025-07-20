import Link from "next/link";
import React from "react";
import { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/product/${product._id}`}
          className="block"
        >
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="w-full h-96 mb-4">
              {product.images &&
              product.images.length > 0 &&
              product.images[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Sin imagen</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {product.name}
            </h3>
            {product.price && (
              <p className="text-gray-500 font-medium text-sm tracking-tighter">
                ${product.price}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
