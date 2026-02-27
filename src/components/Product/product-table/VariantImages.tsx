"use client";
import { Plus } from "lucide-react";
import { ProductImage } from "./types";
import { ChangeEvent, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addImages,
  deleteImage,
  setPrimaryImages,
} from "@/services/product.service";
import { toast } from "react-toastify";

interface VariantImagesProps {
  images: ProductImage[];
  variantId: string;
  productId: string;
}

const VariantImages = ({
  images,
  variantId,
  productId,
}: VariantImagesProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imgs =
    images
      ?.filter((i) => i.variantId === variantId)
      ?.sort((a, b) => a.position - b.position) ?? [];

  const queryClient = useQueryClient();

  const { mutate: uploadMutate } = useMutation<
    { count: number },
    any,
    FormData
  >({
    mutationFn: (formData: FormData) =>
      addImages(productId, variantId, formData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`${res.count} images uploaded successfully`);
    },
  });

  const { mutate: setPrimaryMutate } = useMutation<
    { success: boolean; message: string; count: number },
    any,
    string
  >({
    mutationFn: (imageId: string) =>
      setPrimaryImages(productId, variantId, imageId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`${res.count} images uploaded successfully`);
    },
  });

  const { mutate: deleteImageMutation } = useMutation<
    { success: boolean; message: string },
    any,
    string
  >({
    mutationFn: (imageId: string) => deleteImage(productId, variantId, imageId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(res.message);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    formData.append("variantId", variantId);

    uploadMutate(formData);
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleSetPrimary = (imageId: string) => {
    setPrimaryMutate(imageId);
  };

  const handleDeleteImage = (imageId: string) => {
    deleteImageMutation(imageId);
  };
  if (!imgs.length)
    return (
      <span className="text-slate-300 text-xs italic">No images linked</span>
    );

  return (
    <div className="flex gap-2 flex-wrap mt-2">
      <button
        onClick={handleClick}
        className="w-14 h-14 bg-gray-200 flex items-center justify-center rounded-md cursor-pointer"
      >
        <Plus size={32} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />

      {imgs.map((img) => (
        <div key={img._id} className="relative group">
          <img
            src={img.url}
            alt={img.altText}
            onClick={() => handleSetPrimary(img._id)}
            className={`w-14 h-14 object-cover rounded-md border-2 cursor-pointer ${
              img.isPrimary ? "border-indigo-500" : "border-slate-200"
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          {img.isPrimary ? (
            <span className="absolute bottom-1 right-1 bg-indigo-500 text-white text-[8px] px-1 rounded font-bold">
              P
            </span>
          ) : (
            <span className="absolute bottom-1 right-1 bg-gray-500 text-white text-[8px] px-1 rounded font-bold">
              {img.position}
            </span>
          )}

          <button
            type="button"
            onClick={() => handleDeleteImage(img._id)}
            className="absolute top-0.5 right-0.5 w-5 h-5 bg-white text-red-500 rounded-full
                 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200
                 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-1 focus:ring-red-300
                 flex items-center justify-center text-[12px] font-bold border border-gray-200"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default VariantImages;
