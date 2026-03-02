"use client";
import { AddProductButton } from "@/components/Product/AddProductButton";
import ProductTable from "@/components/Product/product-table/ProductTable";
import { useProducts } from "@/services/useProduct";
import { useState } from "react";

export default function productPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useProducts({
    page,
    limit: 10,
  });

  return (
    <div className="">
      <div className="px-4 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Products</h1>
          <p className="text-xs text-gray-400">Manage your products</p>
        </div>
        <AddProductButton />
      </div>

      <ProductTable
        products={data?.data || []}
        meta={data?.meta}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
