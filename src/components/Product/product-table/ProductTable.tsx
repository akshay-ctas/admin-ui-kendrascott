"use client";
import { useEffect, useState } from "react";
import { fmt, fmtDate, initialData } from "./dummay";
import ExpandedRow from "./ExpandedRow";
import type { Product, Variant } from "./types";

export default function ProductTable({ products }: { products: Product[] }) {
  const [rows, setRows] = useState<Product[]>(products);
  useEffect(() => {
    setRows(products);
  }, [products]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleProductSave = (updated: Product) => {
    setRows((prev) =>
      prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)),
    );
  };

  const handleVariantSave = (productId: string, updatedVariant: Variant) => {
    setRows((prev) =>
      prev.map((p) =>
        p._id !== productId
          ? p
          : {
              ...p,
              variants: p.variants.map((v) =>
                v._id === updatedVariant._id ? updatedVariant : v,
              ),
            },
      ),
    );
  };

  return (
    <div className="min-h-screen px-4">
      <div className="w-full bg-white border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr] px-6 py-3 bg-slate-50 text-xs uppercase tracking-wider font-semibold text-slate-500">
          <div></div>
          <div>Product</div>
          <div>Price</div>
          <div>Status</div>
          <div>Variants</div>
          <div>Updated</div>
          <div>Action</div>
        </div>

        {rows.map((product) => {
          const isOpen = !!expanded[product._id];

          return (
            <div key={product._id}>
              <div
                onClick={() => toggle(product._id)}
                className={`grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr] px-6 py-4 items-center cursor-pointer transition-all duration-100
                  ${
                    isOpen
                      ? "bg-indigo-50 border-l-4 border-indigo-500"
                      : "hover:bg-slate-50"
                  }
                `}
              >
                <div className="text-slate-400">{isOpen ? "▾" : "▸"}</div>

                <div>
                  <div className="font-semibold text-base text-slate-600">
                    {product.title}
                  </div>
                  <div className="text-xs text-slate-400">/{product.slug}</div>
                </div>

                <div className="text-sm text-emerald-600">
                  {fmt(product.price)}
                </div>

                <div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <div className="text-indigo-600 font-semibold">
                  {product.variants.length}
                </div>

                <div className="text-slate-400 text-sm">
                  {fmtDate(product.updatedAt)}
                </div>

                <div />
              </div>

              {isOpen && (
                <ExpandedRow
                  product={product}
                  onProductSave={handleProductSave}
                  onVariantSave={handleVariantSave}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
