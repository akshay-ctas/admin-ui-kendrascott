"use client"
import { Category } from "@/types";
import CategoryRow from "./CategoryRow";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategoryTree } from "@/services/category.service";

export default function CategoryTable() {
   const { data } = useQuery({
     queryKey: ["category"],
     queryFn: () => getCategoryTree(),
     placeholderData: keepPreviousData,
   });
   
  return (
    <table className="w-full mt-10 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <thead className="bg-gray-100">
        <tr>
          <th></th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">URL</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>

          <th>Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {data?.map((category: Category) => (
          <CategoryRow key={category._id} category={category} level={0} />
        ))}
      </tbody>
    </table>
  );
}
