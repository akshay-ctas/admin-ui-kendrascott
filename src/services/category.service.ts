import { CategoryFormData } from "@/components/category1/CategoryEditDrawer";
import { api } from "@/lib/axios";

export const getCategoryTree = async () => {
  const { data } = await api.get("/categories/tree");
  return data.data;
};

export const updateCategory = async (id: string, data: CategoryFormData) => {
  const res = await api.put(`/categories/${id}`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};

export const createCategory = async (data: FormData) => {
  const res = await api.post(`/categories`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
