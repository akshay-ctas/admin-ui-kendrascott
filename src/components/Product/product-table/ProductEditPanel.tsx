"use client";
import { useState } from "react";
import { FieldLabel } from "./dummay";
import type { Product } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProductDetails } from "@/services/product.service";
import { toast } from "react-toastify";

interface ProductEditPanelProps {
  product: Product;
  onClose: () => void;
  onSave?: (updated: Product) => void;
}

export const ProductEditPanel = ({
  product,
  onClose,
  onSave,
}: ProductEditPanelProps) => {
  const [form, setForm] = useState({
    id: product._id,
    title: product.title,
    status: product.status,
    description: product.description ?? "",
    tags: product.tags ?? [],
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => editProductDetails(product._id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("product details update.");
      onClose();
    },
  });

  const f = (key: keyof typeof form) => (val: string | string[]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    mutate(form);
    onClose();
  };

  const addTag = () => {
    const input = document.getElementById("tag-input") as HTMLInputElement;
    if (input && input.value.trim()) {
      const newTags = [...form.tags, input.value.trim()];
      f("tags")(newTags);
      input.value = "";
    }
  };

  const removeTag = (tagToRemove: string) => {
    f("tags")(form.tags.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <span className="uppercase text-[11px] font-bold tracking-wide text-purple-800">
          Edit Product
        </span>
        <div className="flex gap-1">
          <button
            disabled={isPending}
            onClick={handleSave}
            className="text-xs hover:border hover:border-purple-800 bg-purple-200 text-purple-400 hover:text-purple-600 hover:font-semibold px-2 py-1 rounded transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="text-xs text-purple-400 hover:text-purple-600 hover:font-semibold px-2 py-1 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <FieldLabel>Title</FieldLabel>
          <input
            placeholder="Enter product title"
            value={form.title}
            onChange={(e) => f("title")(e.target.value)}
            className="w-full border border-purple-200 hover:border-slate-300 focus:border-slate-400 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all duration-200"
          />
        </div>

        <div>
          <FieldLabel>Status</FieldLabel>
          <select
            value={form.status}
            onChange={(e) => f("status")(e.target.value)}
            className="w-full border border-purple-200 hover:border-slate-300 focus:border-slate-400 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all duration-200"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>
        <div>
          <FieldLabel>Tags</FieldLabel>
          <div className="flex gap-2 mb-1">
            <input
              id="tag-input"
              placeholder="luxury, diamond & Enter"
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              className="flex-1 border border-purple-200 hover:border-slate-300 focus:border-slate-400 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all duration-200"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {form?.tags?.map((tag: string, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-purple-500 hover:text-purple-700 text-[10px] font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-3">
          <FieldLabel>Description</FieldLabel>
          <textarea
            placeholder="Product description"
            rows={2}
            value={form.description}
            onChange={(e) => f("description")(e.target.value)}
            className="w-full border border-purple-200 hover:border-slate-300 focus:border-slate-400 bg-white rounded-md px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all duration-200"
          />
        </div>
        <div className="col-span-1">
          <FieldLabel>Meta Title</FieldLabel>
          <input
            placeholder="SEO title"
            value={form.metaTitle}
            onChange={(e) => f("metaTitle")(e.target.value)}
            className="w-full border border-purple-200 hover:border-slate-300 focus:border-slate-400 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all duration-200"
          />
        </div>
        <div className="col-span-2">
          <FieldLabel>Meta Description</FieldLabel>
          <textarea
            placeholder="SEO description"
            rows={2}
            value={form.metaDescription}
            onChange={(e) => f("metaDescription")(e.target.value)}
            className="w-full border border-purple-200 hover:border-slate-300 focus:border-slate-400 bg-white rounded-md px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};
