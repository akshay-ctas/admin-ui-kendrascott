"use client";

import { generateSlug } from "@/lib/slugify";
import { createCategory, getCategoryTree } from "@/services/category.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  AxiosError } from "axios";
import { X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "../ui/Input";

type Category = {
  _id: string;
  name: string;
  level: number;
  children?: Category[];
  url: string;
};

function flattenCategories(
  categories: Category[],
  depth = 0,
): { _id: string; name: string; level: number; url: string }[] {
  let result: { _id: string; name: string; level: number; url: string }[] = [];

  categories.forEach((cat) => {
    result.push({
      _id: cat._id,
      name: `${"— ".repeat(depth)}${cat.name}`,
      level: cat.level,
      url: cat.url,
    });

    if (cat.children?.length) {
      result = result.concat(flattenCategories(cat.children, depth + 1));
    }
  });

  return result;
}

export default function CreateCategoryForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: getCategoryTree,
    staleTime: 1000 * 60 * 5,
  });

  const flatCategories = useMemo(() => {
    return data ? flattenCategories(data) : [];
  }, [data]);

  const [form, setForm] = useState({
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


  const selectedParent = useMemo(() => {
    return flatCategories.find((c) => c._id === form.parentId);
  }, [form.parentId, flatCategories]);

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
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
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

  setForm((prev) => ({
    ...prev,
    imageUrl: previewUrl,
  }));
};
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!form.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (!/^([a-z0-9]+-)*[a-z0-9]+$/.test(form.slug)) {
      newErrors.slug = "Slug must be lowercase and hyphen separated";
    }

    if (form.sortOrder < 0) {
      newErrors.sortOrder = "Sort order cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const queryClient = useQueryClient()
const createCategoryMutation = useMutation({
  mutationFn: createCategory,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["category"] });
    toast.success("Category created successfully!");
    onClose()
  },
  onError: (error: AxiosError<{message:string}>) => {
toast.error(error?.response?.data?.message || "Failed to create category"); 
   console.error("Category creation failed:", error);
    onClose();
  },
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  const finalData = {
    ...form,
    level,
    url,
  };

  const formData = new FormData();
  for (const key in finalData) {
    const value = finalData[key as keyof typeof finalData];
    formData.append(key, String(value)); 
  }

  if (imageFile) {
    formData.append("imageUrl", imageFile); 
  }

  createCategoryMutation.mutate(formData);
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/5 z-50">
      <div className="relative w-full max-w-3xl">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-6"
        >
          <h2 className="text-xl font-semibold">Create Category</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Category Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label="Category Slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              error={errors.slug}
              disabled
            />

            <Input label="Category URL" value={url} disabled />

            <Input
              label="Category Level"
              type="number"
              value={level}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Parent Category</label>
            <select
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">No Parent</option>
              {flatCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Category Image</label>
            <div className="flex gap-4">
              <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Sort Order"
              name="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={handleChange}
              error={errors.sortOrder}
            />

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <label className="text-sm">Active</label>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <Input
              label="Meta Title"
              name="metaTitle"
              value={form.metaTitle}
              onChange={handleChange}
            />

            <textarea
              name="metaDescription"
              value={form.metaDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Meta Description"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}


