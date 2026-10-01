import { NextResponse } from "next/server";
import { withIds as products } from "@/lib/productCatalog";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");
  const size = searchParams.get("size");
  const color = searchParams.get("color");
  const gender = searchParams.get("gender");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortBy = searchParams.get("sortBy");
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const material = searchParams.get("material");
  const brand = searchParams.get("brand");
  const limit = searchParams.get("limit");

  let result = [...products];

  if (collection && collection.toLowerCase() !== "all") {
    result = result.filter((p) => p.collections === collection);
  }
  if (category && category.toLowerCase() !== "all") {
    result = result.filter((p) => p.category === category);
  }
  if (gender) result = result.filter((p) => p.gender === gender);
  if (color) result = result.filter((p) => p.colors?.includes(color));
  if (size) {
    const sizes = size.split(",");
    result = result.filter((p) => sizes.some((s) => p.sizes?.includes(s)));
  }
  if (material) {
    const values = material.split(",");
    result = result.filter((p) => values.includes(p.material));
  }
  if (brand) {
    const values = brand.split(",");
    result = result.filter((p) => values.includes(p.brand));
  }
  if (minPrice) result = result.filter((p) => Number(p.price) >= Number(minPrice));
  if (maxPrice) result = result.filter((p) => Number(p.price) <= Number(maxPrice));
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  if (sortBy === "priceAsc") result.sort((a, b) => a.price - b.price);
  if (sortBy === "priceDesc") result.sort((a, b) => b.price - a.price);
  if (sortBy === "popularity") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  if (limit) result = result.slice(0, Number(limit));

  return NextResponse.json(result);
}
