"use client";

import { getCategoryTree } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useMemo } from "react";
import { flattenCategories } from "./utils/flattenCategories";
import { useCreateCategory } from "./hooks/useCreateCategory";
import { CategoryParentSelect } from "./CategoryParentSelect";
import { Input } from "../ui/Input";
import { CategoryUrlPreview } from "./CategoryUrlPreview";
import { CategoryImageUpload } from "./CategoryImageUpload";
import { CategoryMetaFields } from "./CategoryMetaFields";


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

  const flatCategories = useMemo(
    () => (data ? flattenCategories(data) : []),
    [data],
  );

  const {
    form,
    errors,
    preview,
    level,
    url,
    handleChange,
    handleImageUpload,
    handleSubmit,
    isPending,
  } = useCreateCategory(onClose, flatCategories);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Create Category
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CategoryParentSelect
            value={form.parentId}
            onChange={handleChange}
            categories={flatCategories}
          />

          <Input
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Electronics"
            error={errors.name}
          />

          <CategoryUrlPreview
            slug={form.slug}
            url={url}
            level={level}
            error={errors.slug}
            onChange={handleChange}
          />

          <CategoryImageUpload
            preview={preview}
            imageUrl={form.imageUrl}
            onUpload={handleImageUpload}
            onChange={handleChange}
          />

          <Input
            label="Sort Order"
            name="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={handleChange}
            error={errors.sortOrder}
          />

          <CategoryMetaFields
            metaTitle={form.metaTitle}
            metaDescription={form.metaDescription}
            onChange={handleChange}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="accent-blue-600 w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm text-gray-600">
              Active
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
