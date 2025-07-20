// lib/types.ts

export interface ProductImage {
  url: string;
  altText?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category?: string;
  size?: string;
  color?: string;
  gender?: string;
  brand?: string;
  material?: string;
  collection?: string;
  images: ProductImage[];
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  sku: string;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  collections: string;
  material: string;
  gender: string;
  images: { url: string }[];
}

interface CartProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface CartContentProps {
  cart: {
    products: CartProduct[];
  };
  userId?: string;
  guestId?: string;
}
