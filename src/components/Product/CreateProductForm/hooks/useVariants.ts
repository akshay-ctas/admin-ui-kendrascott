import { useState } from "react";
import { VariantType, VariantImageEntry } from "../types";
import { generateSKU } from "@/lib/utils";

export function useVariants(formTitle: string) {
  const [variantsArray, setVariantsArray] = useState<VariantType[]>([]);
  const [variants, setVariants] = useState<VariantType>({
    color: "",
    metalType: "",
    stoneType: "",
    size: "",
    price: "",
    stock: "",
    isAvailable: false,
    sku: "",
  });
  const [variantsErrors, setVariantsErrors] = useState<Record<string, string>>(
    {},
  );

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    setVariants((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (["color", "size"].includes(name)) {
        updated.sku = generateSKU(formTitle, updated);
      }
      return updated;
    });
  };

  const variantsValidate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!variants.color.trim()) newErrors.color = "Color is required";
    if (!variants.metalType.trim())
      newErrors.metalType = "Metal type is required";
    if (!variants.stoneType.trim())
      newErrors.stoneType = "Stone type is required";
    if (!variants.price.trim()) newErrors.price = "Price is required";
    if (!variants.stock.trim()) newErrors.stock = "Stock is required";
    if (!variants.size.trim()) newErrors.size = "Size is required";
    setVariantsErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVariant = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!variantsValidate()) return;

    setVariantsArray((prev) => [
      ...prev,
      {
        color: variants.color,
        metalType: variants.metalType,
        stoneType: variants.stoneType,
        price: variants.price,
        size: variants.size,
        stock: variants.stock,
        isAvailable: variants.isAvailable,
        sku: variants.sku,
      },
    ]);

    setVariants({
      color: "",
      metalType: "",
      stoneType: "",
      size: "",
      price: "",
      stock: "",
      isAvailable: false,
      sku: "",
    });
  };

  const resetVariant = () => {
    setVariants({
      color: "",
      metalType: "",
      stoneType: "",
      size: "",
      price: "",
      stock: "",
      isAvailable: false,
      sku: "",
    });
  };

  const removeVariant = (
    sku: string,
    setImages: React.Dispatch<React.SetStateAction<VariantImageEntry[]>>,
  ) => {
    setVariantsArray((prev) => prev.filter((v) => v.sku !== sku));
    setImages((prev) => prev.filter((img) => img.variantSku !== sku));
  };

  return {
    variants,
    variantsArray,
    variantsErrors,
    handleVariantChange,
    handleAddVariant,
    resetVariant,
    removeVariant,
  };
}
