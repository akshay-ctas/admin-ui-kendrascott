import AddCategoryButton from "@/components/category/AddCategoryButton";
import AddCategory from "@/components/category1/AddCategory";
import CategoryTable from "@/components/category1/CategoryTable";

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
        <AddCategory />
      </div>

      <CategoryTable />
    </div>
  );
}
