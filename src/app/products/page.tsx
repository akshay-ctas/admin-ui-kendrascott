"use client";
import { AddProductButton } from "@/components/Product/AddProductButton";
import ProductTable from "@/components/Product/product-table/ProductTable";
import { getProduct } from "@/services/product.service";
import { useProducts } from "@/services/useProduct";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function productPage() {
  const { data } = useProducts();

  const products = data?.data || [];
  const meta = data?.meta;

  console.log("Products Array:", products);
  console.log("Meta:", meta);
  return (
    <div className="">
      <div className="px-4 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Products</h1>
          <p className="text-xs text-gray-400">Manage your products</p>
        </div>
        <AddProductButton />
      </div>

      <ProductTable products={products} />
    </div>
  );
}
