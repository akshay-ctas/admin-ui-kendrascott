import CategoryTable from "@/components/CategoryTable";

export default async function CategoryPage() {
  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Categories</h1>
          <p className="text-xs text-gray-400">
            Manage your product categories
          </p>
        </div>
      </div>

      <CategoryTable />
    </div>
  );
}
