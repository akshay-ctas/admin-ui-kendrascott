"use client";

import React, { useState } from "react";
import { Btn, EditIcon, FieldLabel } from "./dummay";
import { ProductEditPanel } from "./ProductEditPanel";
import type { Product } from "./types";

interface ProductDetailProps {
  product: Product;
  onSave?: (updated: Product) => void;
}

const ProductDetail = React.memo(({ product, onSave }: ProductDetailProps) => {
  const [editingProduct, setEditingProduct] = useState(false);

  if (!product) return null;

  return (
    <div>
      {/* Header */}
      <div className="uppercase flex items-center justify-between text-xs font-bold tracking-wide text-slate-600 mb-3">
        Product Details
        {!editingProduct && (
          <Btn outline onClick={() => setEditingProduct(true)}>
            <EditIcon /> Edit Product
          </Btn>
        )}
      </div>

      {/* View mode OR Edit panel */}
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
          onSave={(updated) => {
            onSave?.(updated);
            setEditingProduct(false);
          }}
          onClose={() => setEditingProduct(false)}
        />
      )}
    </div>
  );
});

ProductDetail.displayName = "ProductDetail";

export default ProductDetail;
