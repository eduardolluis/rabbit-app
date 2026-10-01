import demoProducts from "@/lib/demoProducts";

const withIds = demoProducts.map((product, index) => ({
  ...product,
  _id: product._id || product.sku || `product-${index + 1}`,
}));

export { withIds };
