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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/services/category.service"; 

type CategoryDeleteDrawerProps = {
  category: Category;
  open: boolean;
  onClose: () => void;
};

const DeleteDrawer = ({
  category,
  open,
  onClose,
}: CategoryDeleteDrawerProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation<
    void,
    Error,
    string
  >({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      onClose(); 
    },
  });

  const handleDelete = () => {
   deleteMutation(category._id);
   onClose()
  };

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delete {category?.name}</DrawerTitle>
          <DrawerDescription>
            This action is irreversible. Are you sure you want to delete this
            category?
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="flex justify-end gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>

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

export default DeleteDrawer;
