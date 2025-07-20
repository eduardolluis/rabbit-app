
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProductsByFilters } from "@/lib/features/todos/productsSlice";
import { Product } from "@/lib/types";

import Hero from "../layout/Hero";
import FeaturedCollection from "../products/FeaturedCollection";
import FeaturesSeccion from "../products/FeaturesSeccion";
import GenderCollectionSection from "../products/GenderCollectionSection";
import NewArrivals from "../products/NewArrivals";
import ProductDetails from "../products/ProductDetails";
import ProductGrid from "../products/ProductGrid";

const Home = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  const [bestSellerProduct, setBestSellerProduct] = useState<Product | null>(
    null
  );

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: "8",
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best seller product...</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <ProductGrid products={products} loading={loading} error={error} />
        )}
      </div>

      <FeaturedCollection />
      <FeaturesSeccion />
    </div>
  );
};

export default Home;
