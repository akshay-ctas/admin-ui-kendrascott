export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  avatar?: string;
  gender: "male" | "female";
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type Column = {
  key:
    | "user"
    | "email"
    | "role"
    | "lastLogin"
    | "gender"
    | "createdAt"
    | "actions";
  label: string;
  align?: "right";
  sortKey?: "createdAt" | "firstName" | "email" | "lastLogin";
  width?: string;
};

export type SortOrder = "asc" | "desc";

export type SortConfig = {
  sortBy: "createdAt" | "firstName" | "email" | "lastLogin";
  sortOrder: SortOrder;
};
