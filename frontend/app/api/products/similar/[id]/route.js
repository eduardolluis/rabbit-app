import { NextResponse } from "next/server";
import { withIds as products } from "@/lib/productCatalog";

export async function GET(_request, { params }) {
  const { id } = await params;
  const product = products.find((p) => String(p._id) === String(id));

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const similar = products
    .filter(
      (p) =>
        String(p._id) !== String(id) &&
        p.gender === product.gender &&
        p.category === product.category
    )
    .slice(0, 4);

  return NextResponse.json(similar);
}
