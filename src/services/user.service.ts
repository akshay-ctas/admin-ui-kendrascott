import { api } from "@/lib/axios";
type UserParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  isActive?: boolean;
  sortOrder?: "asc" | "desc";
};
export const getUser = async (query: UserParams) => {
  const res = await api.get(`/users`, { params: query });
  return res.data;
};
