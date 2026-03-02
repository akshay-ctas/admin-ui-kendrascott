import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProduct } from "./product.service";

export const useProducts = (filters?: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  order?: string;
}) => {
  return useQuery({
    queryKey: [
      "product",
      filters?.page,
      filters?.limit,
      filters?.search,
      filters?.status,
      filters?.sortBy,
      filters?.order,
    ],
    queryFn: () => getProduct(filters),
    placeholderData: keepPreviousData,
  });
};
