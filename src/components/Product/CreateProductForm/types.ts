export type FormType = {
  title: string;
  slug: string;
  price: string;
  status: string;
  parentId: string;
  sortOrder: string;
  description: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  variants: VariantType[];
  images: ImagePayload[];
};

export type VariantType = {
  color: string;
  metalType: string;
  stoneType: string;
  price: string;
  size: string;
  stock: string;
  isAvailable: boolean;
  sku: string;
};

export type ImagePayload = {
  file: File;
  variantSku: string;
  isPrimary: boolean;
  position: number;
};

export type ImageArrayItem = {
  file: File;
  preview: string;
  variantSku: string;
  isPrimary: boolean;
  position: number;
};

export type VariantImageEntry = {
  variantSku: string;
  variantDetails: VariantType | undefined;
  primaryImage: ImageArrayItem;
  allImages: ImageArrayItem[];
  totalImages: number;
};
