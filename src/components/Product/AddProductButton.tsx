"use client"

import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateProductForm } from "./CreateProductForm";

export function AddProductButton(){
    const [open, setOpen] = useState(false)
    const onClose = () => {
      setOpen(false);
    };
    return (
      <>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center bg-orange-100 text-orange-900 px-2 py-1 rounded text-xs  hover:bg-orange-200 hover:border hover:border-orange-900 transition-all duration-100"
        >
          <Plus size={14} />
          <p>Add Product</p>
        </button>
        {open && <CreateProductForm onClose={onClose} />}
      </>
    );
}