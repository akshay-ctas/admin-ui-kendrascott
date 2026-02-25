import { api } from "@/lib/axios";

export const createProduct = async (data: FormData) => {
  const res = await api.post(`/product`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getProduct = async (params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  order?: string;
}) => {
  const res = await api.get(`/product`, { params });
  return res.data;
};