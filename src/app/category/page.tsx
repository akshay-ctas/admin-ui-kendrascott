import { CATEGORIES } from "@/data/category";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CategoryPage() {
  
  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Categories</h1>
          <p className="text-xs text-gray-400">
            Manage your product categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-56 shadow-sm">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              placeholder="Search category..."
              className="w-full bg-transparent outline-none text-[13px] text-gray-600 placeholder:text-gray-400"
            />
          </div>

          <Link
            href="/add-category"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            className="
              inline-flex items-center gap-2
              bg-green-600 text-white
              px-4 py-2 rounded-lg
              text-sm font-medium
              shadow-sm
              hover:bg-green-700
              active:scale-95
              transition-all duration-150
            "
          >
            <Plus size={16} />
            Add Category
          </Link>
        </div>
      </div>

      <table className="w-full mt-10 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              URL
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Description
            </th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {CATEGORIES.map((category) => (
            <tr key={category._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm  font-medium text-gray-900">
                {category.name}
              </td>

              <td className="px-6 py-4 text-sm  text-blue-600 underline">
                {category.url}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1  text-xs rounded-full font-medium ${
                    category.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-6 py-4 text-sm  text-gray-600 max-w-xs truncate">
                {category.metaDescription}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href={`/edit-category/${category._id}`}
                    className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button className="p-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
