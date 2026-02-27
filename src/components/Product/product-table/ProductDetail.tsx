"use client";

import React, { useState } from "react";
import { Btn, EditIcon, FieldLabel } from "./dummay";
import { ProductEditPanel } from "./ProductEditPanel";
import type { Product } from "./types";
import { Trash2 } from "lucide-react";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = React.memo(({ product }: ProductDetailProps) => {
  const [editingProduct, setEditingProduct] = useState(false);

  const deleteProduct = () => {};

  if (!product) return null;

  return (
    <div>
      <div className="uppercase flex items-center justify-between text-xs font-bold tracking-wide text-slate-600 mb-3">
        Product Details
        <div className="flex gap-1">
          {!editingProduct && (
            <button
              className="text-xs flex items-center gap-1 border border-purple-600 px-2 py-1 rounded-sm cursor-pointer font-semibold text-indigo-700"
              onClick={() => setEditingProduct(true)}
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
              Edit Product
            </button>
          )}
          <button
            onClick={() => deleteProduct(product._id)}
            className="text-xs flex items-center gap-1 border border-red-600 px-2 py-1 rounded-sm cursor-pointer font-semibold text-red-700"
          >
            <Trash2 size={13} />
            Delete Product
          </button>
        </div>
      </div>

      {!editingProduct ? (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(
            [
              ["Slug", product.slug],
              ["Description", product.description || "—"],
              ["Tags", product.tags?.join(", ") || "—"],
              ["Category", product.categories?.[0]?.name || "—"],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div
              key={k}
              className="bg-white border border-slate-200 rounded-md p-3"
            >
              <FieldLabel>{k}</FieldLabel>
              <div className="text-sm text-slate-700">{v}</div>
            </div>
          ))}
        </div>
      ) : (
        <ProductEditPanel
          product={product}
          onClose={() => setEditingProduct(false)}
        />
      )}
    </div>
  );
});

ProductDetail.displayName = "ProductDetail";

export default ProductDetail;
