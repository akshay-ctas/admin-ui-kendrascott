"use client";
import { useState } from "react";
import { EInput, FieldLabel, fmt } from "./dummay";
import ProductDetail from "./ProductDetail";
import type { Product, Variant } from "./types";
import VariantImages from "./VariantImages";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVariant } from "@/services/product.service";
import { toast } from "react-toastify";

const FIELDS: {
  label: string;
  key: keyof Variant;
  type?: string;
  isPrice?: boolean;
}[] = [
  { label: "Color", key: "color" },
  { label: "Metal", key: "metalType" },
  { label: "Stone", key: "stoneType" },
  { label: "Size", key: "size" },
  { label: "Stock", key: "stock", type: "number" },
  { label: "Price", key: "price", type: "number", isPrice: true },
];

interface ExpandedRowProps {
  product: Product;
  onVariantSave?: (productId: string, variant: Variant) => void;
}

export default function ExpandedRow({
  product,
  onVariantSave,
}: ExpandedRowProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Variant | null>(null);

  const handleEdit = (variant: Variant) => {
    setEditingId(variant._id);
    setFormData({ ...variant });
  };

  const handleChange = (key: keyof Variant, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: key === "stock" || key === "price" ? Number(value) : value,
      };
    });
  };

  const handleSave = () => {
    if (formData) {
      onVariantSave?.(product._id, formData);
    }

    setEditingId(null);
    setFormData(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(null);
  };
  const queryClient = useQueryClient();
  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: string) => deleteVariant(product._id, variantId),
    onSuccess: (res, variantId) => {
      toast.success(`Variant deleted successfully`);

      queryClient.invalidateQueries({
        queryKey: ["product", product._id],
      });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete variant");
    },
  });
  const handleDeleteVariant = (variantId: string) => {
    deleteVariantMutation.mutate(variantId);
  };

  return (
    <div className="border-b border-slate-200  bg-slate-50 p-5 animate-[fade_.2s_ease]">
      <ProductDetail product={product} />

      <div className="uppercase text-[11px] font-bold tracking-wide text-slate-600 mb-3">
        Variants ({product.variants.length})
      </div>

      {product.variants.map((v) => {
        const isEditing = editingId === v._id;

        return (
          <div
            key={v._id}
            className={`border rounded-lg p-4 mb-3 transition-all duration-200 ${
              isEditing
                ? "bg-violet-50 border-indigo-300"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">
                SKU: {v.sku}
              </span>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex gap-1">
                    <button
                      onClick={handleSave}
                      className="text-xs hover:border hover:border-purple-800 bg-purple-200 text-purple-400 hover:text-purple-600 hover:font-semibold px-2 py-1 rounded transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-xs text-purple-400 hover:text-purple-600 hover:font-semibold px-2 py-1 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-xs flex items-center gap-1 border border-purple-600 px-2 py-1 rounded-sm cursor-pointer font-semibold text-indigo-700"
                    onClick={() => handleEdit(v)}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Variant
                  </button>
                )}
                <button
                  onClick={() => handleDeleteVariant(v._id)}
                  className="text-xs flex items-center gap-1 border border-red-600 px-2 py-1 rounded-sm cursor-pointer font-semibold text-red-700"
                >
                  <Trash2 size={13} />
                  Delete Variant
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 text-sm mb-3">
              {FIELDS.map((field) => (
                <div
                  key={field.key}
                  className={field.isPrice ? "font-bold text-green-600" : ""}
                >
                  <FieldLabel>{field.label}</FieldLabel>

                  {isEditing && formData ? (
                    <EInput
                      value={formData[field.key] as string | number}
                      onChange={(val) => handleChange(field.key, val)}
                      type={field.type ?? "text"}
                    />
                  ) : field.isPrice ? (
                    fmt(v[field.key] as number)
                  ) : (
                    String(v[field.key] ?? "—")
                  )}
                </div>
              ))}
            </div>

            <FieldLabel>Linked Images</FieldLabel>
            <VariantImages
              images={product.images}
              productId={product._id}
              variantId={v._id}
            />
          </div>
        );
      })}

      <style>{`
        @keyframes fade {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
