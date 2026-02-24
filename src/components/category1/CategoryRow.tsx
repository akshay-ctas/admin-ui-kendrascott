"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types";
import CategoryEditDrawer from "./CategoryEditDrawer";
import DeleteDrower from "./DeleteDrower";

const paddingMap: Record<number, string> = {
  0: "pl-0",
  1: "pl-7",
  2: "pl-14",
};

export default function CategoryRow({
  category,
  level,
  hidden = false,
}: {
  category: Category;
  level: number;
  hidden?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [openDeleteDrawer, setOpenDeleteDrawer] = useState(false);

  const hasChildren = category.children?.length > 0;
  const shouldRenderChildren = hasChildren && isOpen && !hidden;

  return (
    <>
      <tr className={`hover:bg-gray-50 transition ${hidden ? "hidden" : ""}`}>
        <td className="px-4 py-3 w-10">
          <input type="checkbox" />
        </td>

        <td className="px-4 py-3">
          <div
            className={`flex items-center relative ${paddingMap[level] ?? "pl-0"}`}
          >
            {level === 1 && (
              <span className="absolute left-0 top-0 h-full">#</span>
            )}
            {level === 2 && (
              <span className="absolute left-5 top-0 h-full">#</span>
            )}

            {hasChildren ? (
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 bg-white mr-2 hover:bg-gray-100 transition"
              >
                {isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            ) : (
              <span className="w-5 mr-2 inline-block" />
            )}

            <span className="text-sm font-medium text-gray-800">
              {category.name}
            </span>
          </div>
        </td>

        <td className="px-4 py-3 text-sm text-gray-500">
          {category.metaDescription}
        </td>

        <td className="px-4 py-3">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              category.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {category.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setEditDrawerOpen(true)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setOpenDeleteDrawer(true)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>

      <CategoryEditDrawer
        category={category}
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
      />
      <DeleteDrower
        category={category}
        open={openDeleteDrawer}
        onClose={() => setOpenDeleteDrawer(false)}
      />

      {shouldRenderChildren &&
        category.children.map((child: Category) => (
          <CategoryRow
            key={child._id}
            category={child}
            level={level + 1}
            hidden={!isOpen}
          />
        ))}
    </>
  );
}
