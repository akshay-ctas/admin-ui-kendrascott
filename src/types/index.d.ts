export interface Category {
  _id: string;
  name: string;
  slug: string;
  url: string;

  parentId: string | null;
  level: number;

  sortOrder: number;

  metaTitle: string;
  metaDescription: string;

  imageUrl: string;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  children: Category[]; 
}
