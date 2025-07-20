// ✅ Correcto para Next.js 15+
import ProductDetails from "@/components/products/ProductDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetails productId={id} />;
}
