import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { ImageArrayItem, VariantImageEntry, VariantType } from "../types";

export function useProductImages() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageArray, setImageArray] = useState<ImageArrayItem[]>([]);
  const [selectedVariantSku, setSelectedVariantSku] = useState("");
  const [images, setImages] = useState<VariantImageEntry[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (!selectedVariantSku) {
      toast.warn("Pehle variant select karein phir image add karein");
      return;
    }

    const startIndex = imageArray.length;
    const newImages: ImageArrayItem[] = Array.from(files).map(
      (file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        variantSku: selectedVariantSku,
        isPrimary: imageArray.length === 0 && index === 0,
        position: startIndex + index,
      }),
    );

    setImageArray((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const handleDeleteImage = (preview: string) => {
    setImageArray((prev) => {
      const filtered = prev.filter((img) => img.preview !== preview);
      const reordered = filtered.map((img, index) => ({
        ...img,
        position: index,
      }));
      if (reordered.length > 0 && !reordered.some((i) => i.isPrimary)) {
        reordered[0].isPrimary = true;
      }
      return reordered;
    });
  };

  const handleSetPrimary = (preview: string) => {
    setImageArray((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.preview === preview })),
    );
  };

  const handleAddImage = (variantsArray: VariantType[]) => {
    if (!selectedVariantSku) {
      toast.warn("Pehle variant select karein!");
      return;
    }
    if (imageArray.length === 0) {
      toast.warn("Pehle images upload karein!");
      return;
    }

    const primaryImage =
      imageArray.find((img) => img.isPrimary) || imageArray[0];
    const selectedVariant = variantsArray.find(
      (v) => v.sku === selectedVariantSku,
    );

    const variantImageEntry: VariantImageEntry = {
      variantSku: selectedVariantSku,
      variantDetails: selectedVariant,
      primaryImage,
      allImages: imageArray,
      totalImages: imageArray.length,
    };

    setImages((prev) => {
      const exists = prev.find((v) => v.variantSku === selectedVariantSku);
      if (exists) {
        return prev.map((v) =>
          v.variantSku === selectedVariantSku ? variantImageEntry : v,
        );
      }
      return [...prev, variantImageEntry];
    });

    setImageArray([]);
    setSelectedVariantSku("");
    toast.success(`${imageArray.length} images saved for variant!`);
  };

  const resetImageSection = () => {
    setImageArray([]);
    setSelectedVariantSku("");
  };

  const removeVariantImages = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return {
    fileInputRef,
    imageArray,
    images,
    setImages,
    selectedVariantSku,
    setSelectedVariantSku,
    handleImageChange,
    handleDeleteImage,
    handleSetPrimary,
    handleAddImage,
    resetImageSection,
    removeVariantImages,
  };
}
