import { NextResponse } from "next/server";
import { withIds as products } from "@/lib/productCatalog";

export async function GET(_request, { params }) {
  const { id } = await params;
  const product = products.find((p) => String(p._id) === String(id));

  return product
    ? NextResponse.json(product)
    : NextResponse.json({ message: "Product not found" }, { status: 404 });
}
