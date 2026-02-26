"use client";

import { getProduct } from "@/services/product.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useProducts = (filters?: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  order?: string;
}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProduct(filters),
    placeholderData: keepPreviousData,
  });
};
