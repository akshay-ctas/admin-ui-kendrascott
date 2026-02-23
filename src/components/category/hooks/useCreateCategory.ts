"use client";

import { generateSlug } from "@/lib/slugify";
import { createCategory } from "@/services/category.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";

type FlatCategory = {
  _id: string;
  name: string;
  level: number;
  url: string;
};

type FormState = {
  name: string;
  slug: string;
  parentId: string;
  isActive: boolean;
  sortOrder: number;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
};

export function useCreateCategory(
  onClose: () => void,
  flatCategories: FlatCategory[],
) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    parentId: "",
    isActive: true,
    sortOrder: 0,
    imageUrl: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const selectedParent = useMemo(
    () => flatCategories.find((c) => c._id === form.parentId),
    [form.parentId, flatCategories],
  );

  const level = selectedParent ? selectedParent.level + 1 : 0;

  const url = useMemo(() => {
    if (!form.slug) return "";
    return selectedParent
      ? `${selectedParent.url}/${form.slug}`
      : `/${form.slug}`;
  }, [form.slug, selectedParent]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (name === "name") {
      setForm((prev) => ({ ...prev, name: value, slug: generateSlug(value) }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (name === "imageUrl") {
      setPreview(value);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setForm((prev) => ({ ...prev, imageUrl: previewUrl }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Category name is required";
    if (!form.slug.trim()) newErrors.slug = "Slug is required";
    if (!/^([a-z0-9]+-)*[a-z0-9]+$/.test(form.slug))
      newErrors.slug = "Slug must be lowercase and hyphen separated";
    if (form.sortOrder < 0)
      newErrors.sortOrder = "Sort order cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      toast.success("Category created successfully!");
      onClose();
    },
    onError: (error: AxiosError<{message:string}>) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category",
      );
      console.error("Category creation failed:", error);
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalData = { ...form, level, url };
    const formData = new FormData();

    for (const key in finalData) {
      const value = finalData[key as keyof typeof finalData];
      formData.append(key, String(value));
    }

    if (imageFile) {
      formData.append("imageUrl", imageFile);
    }

    mutation.mutate(formData);
  };

  return {
    form,
    errors,
    preview,
    level,
    url,
    handleChange,
    handleImageUpload,
    handleSubmit,
    isPending: mutation.isPending,
  };
}
