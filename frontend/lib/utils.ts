export interface Filters {
  category: string;
  gender: string;
  color: string;
  size: string[];
  material: string[];
  brand: string[];
  minPrice: number;
  maxPrice: number;
}

export interface SearchParams {
  category?: string;
  gender?: string;
  color?: string;
  size?: string;
  material?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}

export const CATEGORIES: string[] = ["Top Wear", "Bottom Wear"];

export const COLORS: string[] = [
  "Red",
  "Blue",
  "Black",
  "Green",
  "Yellow",
  "Gray",
  "White",
  "Pink",
  "Beige",
  "Navy",
];

export const SIZES: string[] = ["XS", "S", "M", "L", "XL", "XXL"];

export const MATERIALS: string[] = [
  "Cotton",
  "Wool",
  "Denim",
  "Polyester",
  "Silk",
  "Linen",
  "Viscose",
  "Fleece",
];

export const BRANDS: string[] = [
  "Urban Threads",
  "Modern Fit",
  "Street Style",
  "Beach Breeze",
  "Fashionista",
  "ChichStyle",
];

export const GENDERS: string[] = ["Men", "Women"];

export const DEFAULT_FILTERS: Filters = {
  category: "",
  gender: "",
  color: "",
  size: [],
  material: [],
  brand: [],
  minPrice: 0,
  maxPrice: 100,
};

export const parseSearchParams = (searchParams: URLSearchParams): Filters => {
  const params: SearchParams = Object.fromEntries([...searchParams]);

  return {
    category: params.category || "",
    gender: params.gender || "",
    color: params.color || "",
    size: params.size ? params.size.split(",") : [],
    material: params.material ? params.material.split(",") : [],
    brand: params.brand ? params.brand.split(",") : [],
    minPrice: params.minPrice ? parseInt(params.minPrice, 10) : 0,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : 100,
  };
};
