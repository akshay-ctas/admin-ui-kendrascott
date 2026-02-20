/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Category } from "@/types";
import { useEffect, useState } from "react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "@/services/category.service";

type CategoryEditDrawerProps = {
  category: Category;
  open: boolean;
  onClose: () => void;
};
export type CategoryFormData = {
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
};type UpdateCategoryInput = {
  id: string;
  data: CategoryFormData;
};
const CategoryEditDrawer = ({
  category,
  open,
  onClose,
}: CategoryEditDrawerProps) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription,
    isActive: category.isActive,
  });

 useEffect(() => {
   setFormData({
     name: category.name,
     slug: category.slug,
     metaTitle: category.metaTitle,
     metaDescription: category.metaDescription,
     isActive: category.isActive,
   });
 }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    let newValue: string | boolean = value;

    if (type === "checkbox" && "checked" in e.target) {
      newValue = e.target.checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

   const { mutate: updateMutation } = useMutation<
     void,
     Error,
     UpdateCategoryInput
   >({
     mutationFn: ({ id, data }) => updateCategory(id, data),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["category"] });
     },
   });

  const handleSubmit = () => {
    updateMutation({ id: category._id, data: formData });    
       
    onClose();
  };
  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit {category?.name}</DrawerTitle>
          <DrawerDescription>
            Make changes to this category below.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit}>Edit</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryEditDrawer;
