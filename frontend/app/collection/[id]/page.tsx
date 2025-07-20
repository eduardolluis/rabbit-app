"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProductsByFilters } from "@/lib/features/todos/productsSlice";
import { RootState } from "@/lib/store";

import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import SortOptions from "@/components/products/SortOptions";

const CollectionsPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { products, loading, error } = useAppSelector(
    (state: RootState) => state.products
  );

  const collection = params?.collection as string;

  useEffect(() => {
    const queryParams = Object.fromEntries(searchParams.entries());
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent): void => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 border flex justify-center items-center"
        type="button"
        aria-label="Toggle filters"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      {/* Filter sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform ease-in-out duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collections</h2>
        <SortOptions />
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionsPage;
