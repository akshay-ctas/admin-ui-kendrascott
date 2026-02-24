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