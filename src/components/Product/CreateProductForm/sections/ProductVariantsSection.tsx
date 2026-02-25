"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { VariantType } from "../types";

type Props = {
  formTitle: string;
  variants: VariantType;
  variantsArray: VariantType[];
  variantsErrors: Record<string, string>;
  formError?: string;
  onVariantChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddVariant: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onResetVariant: () => void;
  onRemoveVariant: (sku: string) => void;
};

export function ProductVariantsSection({
  formTitle,
  variants,
  variantsArray,
  variantsErrors,
  formError,
  onVariantChange,
  onAddVariant,
  onResetVariant,
  onRemoveVariant,
}: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
        Product Variants
      </h2>
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div className="grid lg:grid-cols-4 gap-8 p-8 bg-gray-50/50 rounded-2xl border border-gray-100">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Variants List
          </h3>
          {variantsArray.length > 0 ? (
            variantsArray.map((variant) => (
              <div
                key={variant.sku}
                className="group relative p-5 mb-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <p className="text-base font-semibold text-gray-900 mb-1">
                  {formTitle} - Size {variant.size}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Stock: {variant.stock}
                </p>
                <X
                  onClick={() => onRemoveVariant(variant.sku)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer"
                  size={20}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 text-lg">No variants added</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-8">
            Add New Variant
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Input
              name="color"
              label="Color"
              value={variants.color}
              onChange={onVariantChange}
              error={variantsErrors.color}
            />
            <Input
              name="metalType"
              label="Metal Type"
              value={variants.metalType}
              onChange={onVariantChange}
              error={variantsErrors.metalType}
            />
            <Input
              name="stoneType"
              label="Stone Type"
              value={variants.stoneType}
              onChange={onVariantChange}
              error={variantsErrors.stoneType}
            />
            <Input
              name="size"
              label="Size"
              value={variants.size}
              onChange={onVariantChange}
              error={variantsErrors.size}
            />
            <Input
              name="price"
              label="Price"
              type="number"
              value={variants.price}
              onChange={onVariantChange}
              error={variantsErrors.price}
            />
            <Input
              name="stock"
              label="Stock"
              type="number"
              value={variants.stock}
              onChange={onVariantChange}
              error={variantsErrors.stock}
            />
            <div className="col-span-3 flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <input
                type="checkbox"
                name="isAvailable"
                checked={variants.isAvailable}
                onChange={onVariantChange}
                className="w-5 h-5 rounded accent-gray-900"
              />
              <label className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>
          <div className="mt-10 flex justify-end gap-4">
            <button
              type="button"
              onClick={onResetVariant}
              className="px-8 py-3 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onAddVariant}
              className="px-8 py-3 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Add Variant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
