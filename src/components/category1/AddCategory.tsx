"use client"
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateCategoryForm from "./CategoryMode";

export default function AddCategory(){
    const [open, setOpen] = useState(false)

    const onClose = () =>{
      setOpen(false)
    }
   
   return (
     <>
       <button
         onClick={() => setOpen((prev) => !prev)}
         className="flex items-center bg-green-100 text-green-900 px-1 py-0.5 rounded text-xs font-semibold"
       >
         <Plus size={14} />
         <p>Add Category</p>
       </button>
       {open && <CreateCategoryForm onClose={onClose} />}
     </>
   );
}