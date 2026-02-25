import { AddProductButton } from "@/components/Product/AddProductButton";
import { ProductTable } from "@/components/Product/ProductTable";

export default function productPage() {
  return (
    <div className="">
      <div className="px-4 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Products</h1>
          <p className="text-xs text-gray-400">Manage your products</p>
        </div>
        <AddProductButton />
      </div>

      <ProductTable />
    </div>
  );
}
