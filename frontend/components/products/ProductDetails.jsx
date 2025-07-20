"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "@/lib/features/todos/productsSlice";
import { addToCart } from "@/lib/features/todos/cartSlice";

export default function ProductDetails({ productId }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux state
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  // Local state - solo para UI
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const productFetchId = productId || id;

  // Fetch product data
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // Set main image when product loads
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0]?.url || "");
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.");
      return;
    }

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart!", {
          duration: 1500,
        });
      })
      .catch((err) => {
        toast.error("Failed to add product to cart");
        console.error(err);
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const handleColorSelect = (color) => {
    if (selectedColor === color) {
      toast("You already selected this color.", {
        duration: 1200,
      });
      return;
    }
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    if (selectedSize === size) {
      toast("You already selected this size.", {
        duration: 1200,
      });
      return;
    }
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="animate-pulse">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">No product data available.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Desktop thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition-all duration-300 ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={selectedProduct.name || "Product"}
                    className="w-full h-auto object-cover rounded-lg transition-opacity duration-300 ease-in-out"
                  />
                )}
              </div>
            </div>

            {/* Mobile thumbnails */}
            <div className="md:hidden flex overflow-x-auto space-x-4 mb-4">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border transition-all duration-300 ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Product details */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>

              {selectedProduct.originalPrice && (
                <p className="text-lg text-gray-600 mb-1 line-through">
                  ${selectedProduct.originalPrice}
                </p>
              )}

              <p className="text-xl text-gray-900 mb-2 font-semibold">
                ${selectedProduct.price}
              </p>

              <p className="text-gray-600 mb-6">
                {selectedProduct.description}
              </p>

              {/* Color selection */}
              {selectedProduct.colors?.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">Color:</p>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-full border transition-all duration-300 transform hover:scale-105  cursor-pointer ${
                          selectedColor === color
                            ? "border-4 border-black shadow"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor: color.toLowerCase(),
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {selectedProduct.sizes?.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">Size:</p>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-2 rounded border transition-all duration-300 transform hover:scale-105  cursor-pointer ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-gray-100 border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-gray-700 mb-3">Quantity:</p>
                <div className="flex items-center space-x-4">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded text-lg transition-all duration-300 transform  hover:scale-105 hover:bg-gray-300 disabled:opacity-50 cursor-pointer "
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded text-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-300 cursor-pointer "
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-3 px-6 rounded w-full mb-6 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>

              {/* Product characteristics */}
              {(selectedProduct.brand || selectedProduct.material) && (
                <div className="mt-8 text-gray-700">
                  <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                  <table className="w-full text-left text-sm text-gray-600">
                    <tbody>
                      {selectedProduct.brand && (
                        <tr>
                          <td className="py-2 pr-4 font-medium">Brand</td>
                          <td className="py-2">{selectedProduct.brand}</td>
                        </tr>
                      )}
                      {selectedProduct.material && (
                        <tr>
                          <td className="py-2 pr-4 font-medium">Material</td>
                          <td className="py-2">{selectedProduct.material}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Similar products */}
          {similarProducts?.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl text-center font-medium mb-8">
                You May Also Like
              </h2>
              <ProductGrid products={similarProducts} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
