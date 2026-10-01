import { NextResponse } from "next/server";
import { withIds as products } from "@/lib/productCatalog";

export async function GET() {
  return NextResponse.json([...products].slice(-8).reverse());
}
