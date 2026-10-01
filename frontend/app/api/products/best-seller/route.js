import { NextResponse } from "next/server";
import { withIds as products } from "@/lib/productCatalog";

export async function GET() {
  const bestSeller = [...products].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  )[0];

  return bestSeller
    ? NextResponse.json(bestSeller)
    : NextResponse.json({ message: "No best seller found" }, { status: 404 });
}
