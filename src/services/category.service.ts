import { CategoryFormData } from "@/components/CategoryEditDrawer";
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
  console.log(id, sessionStorage.getItem("accessToken"));
  

  const res = await api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};