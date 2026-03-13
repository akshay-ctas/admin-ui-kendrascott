import { Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsCell({ userId }: { userId: string }) {
  const handleView = () => console.log("View", userId);
  const handleEdit = () => console.log("Edit", userId);
  const handleDelete = () => console.log("Delete", userId);

  const btnBase =
    "p-1.5 cursor-pointer hover:scale-150 duration-300 ease-in-out transition-colors";

  return (
    <td className="px-6 py-4 text-right">
      <button
        onClick={handleView}
        className={`${btnBase} text-gray-600`}
        title="View"
      >
        <Eye size={14} />
      </button>
      <button
        onClick={handleEdit}
        className={`${btnBase} text-blue-600`}
        title="Edit"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={handleDelete}
        className={`${btnBase} text-red-500`}
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </td>
  );
}
