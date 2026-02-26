export interface ProductImage {
  _id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  position: number;
  variantId: string;
}

export interface Variant {
  _id: string;
  sku: string;
  color: string;
  metalType: string;
  stoneType: string;
  size: string;
  stock: number;
  price: number;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status: "ACTIVE" | "DRAFT";
  sortOrder: number;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  images: ProductImage[];
  variants: Variant[];
}

export interface Meta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: Meta;
}
