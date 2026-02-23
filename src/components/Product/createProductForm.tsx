import { X } from "lucide-react";

export  function CreateProductForm({ onClose }: { onClose :() => void}) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 transition-all duration-100">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Add Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}