"use client";

import { Input } from "@/components/ui/Input";
import { FormType } from "../types";

type Props = {
  form: FormType;
  tags: string[];
  tagInput: string;
  errors: Record<string, string>;
  flatCategories: { _id: string; name: string }[];
  onFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
};

export function ProductDetailsSection({
  form,
  tags,
  tagInput,
  errors,
  flatCategories,
  onFormChange,
  onTagInputChange,
  onTagKeyDown,
  onRemoveTag,
}: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
        Product Details
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          name="title"
          label="Product Title"
          value={form.title}
          onChange={onFormChange}
          error={errors.title}
        />
        <Input
          name="slug"
          label="Slug"
          value={form.slug}
          onChange={onFormChange}
          error={errors.slug}
        />
        <Input
          name="price"
          label="Price"
          type="number"
          value={form.price}
          onChange={onFormChange}
          error={errors.price}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Category
          </label>
          <select
            name="parentId"
            value={form.parentId}
            onChange={onFormChange}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
          >
            <option value="">Select Category</option>
            {flatCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.parentId && (
            <p className="text-red-500 text-xs mt-1">{errors.parentId}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={onFormChange}
            rows={4}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all resize-none"
          />
        </div>
        <div>
          <Input
            label="Product Tags"
            name="tagInput"
            value={tagInput}
            onChange={onTagInputChange}
            onKeyDown={onTagKeyDown}
            placeholder="Press Enter to add"
          />
          {errors.tags && (
            <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 p-4 bg-white border border-gray-200 rounded-xl">
              {tags.map((tagItem, index) => (
                <span
                  key={index}
                  className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-full flex items-center shadow-sm"
                >
                  {tagItem}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tagItem)}
                    className="ml-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold transition-all duration-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
