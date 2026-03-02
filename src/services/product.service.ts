import { Variant } from "@/components/Product/product-table/types";
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

export const getProduct = async (params?: {
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

export type ProductDetails = {
  status: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  tags: [];
};

export const editProductVariants = async (
  productId: string,
  variantId: string,
  data: Variant,
) => {
  const res = await api.patch(
    `/product/${productId}/variants/${variantId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    },
  );
  console.log(res);

  return res.data;
};

export const editProductDetails = async (id: string, data: ProductDetails) => {
  const res = await api.patch(`/product/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};

export const addImages = async (
  productId: string,
  variantId: string,
  data: FormData,
) => {
  const res = await api.post(
    `/product/${productId}/variants/${variantId}/images`,
    data,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};

export const setPrimaryImages = async (
  productId: string,
  variantId: string,
  imageId: string,
) => {
  const res = await api.patch(
    `/product/${productId}/variants/${variantId}/images/${imageId}/set-primary`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    },
  );
  return res.data;
};

export const deleteImage = async (
  productId: string,
  variantId: string,
  imageId: string,
) => {
  const res = await api.delete(
    `/product/${productId}/variants/${variantId}/images/${imageId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    },
  );
  return res.data;
};

export const deleteVariant = async (productId: string, variantId: string) => {
  const res = await api.delete(`/product/${productId}/variants/${variantId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};

export const deleteProduct = async (productId: string) => {
  const res = await api.delete(`/product/${productId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};
