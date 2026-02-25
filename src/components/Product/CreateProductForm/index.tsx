"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoryTree } from "@/services/category.service";
import { createProduct } from "@/services/product.service";
import { toast } from "react-toastify";
import { flattenCategories } from "@/components/category/utils/flattenCategories";
import { useProductForm } from "./hooks/useProductForm";
import { useVariants } from "./hooks/useVariants";
import { useProductImages } from "./hooks/useProductImages";
import {  AxiosError } from "axios";
import { ProductDetailsSection } from "./sections/ProductDetailsSection";
import { ProductVariantsSection } from "./sections/ProductVariantsSection";
import { ProductImagesSection } from "./sections/ProductImagesSection";
import { SeoSection } from "./sections/SeoSection";



export function CreateProductForm({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { form, productFormErrors, handleChange, productFormValidate } =
    useProductForm();

  const {
    variants,
    variantsArray,
    variantsErrors,
    handleVariantChange,
    handleAddVariant,
    resetVariant,
    removeVariant,
  } = useVariants(form.title);

  const {
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
  } = useProductImages();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: getCategoryTree,
    staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully!");
      onClose();
    },
    onError: (error: AxiosError<{message:string}>) => {
      toast.error(error?.response?.data?.message || "Failed to create product");
      console.error("Product creation failed:", error);
    },
  });

  const flatCategories = useMemo(() => {
    return data ? flattenCategories(data) : [];
  }, [data]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 200);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productFormValidate(tags, variantsArray, images, imageArray)) return;

    const flatImages = images.flatMap((variantImg) =>
      variantImg.allImages.map((img) => ({
        file: img.file,
        variantSku: img.variantSku,
        isPrimary: img.isPrimary,
        position: img.position,
      })),
    );

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      price: parseFloat(form.price) || 0,
      status: form.status || "DRAFT",
      tags,
      sortOrder: form.sortOrder ? parseInt(form.sortOrder) : 0,
      categories: [form.parentId],
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      variants: variantsArray.map((v) => ({
        sku: v.sku,
        color: v.color,
        metalType: v.metalType,
        stoneType: v.stoneType,
        size: v.size,
        price: parseFloat(v.price) || 0,
        stock: parseInt(v.stock) || 0,
        isAvailable: v.isAvailable,
      })),
      images: flatImages.map((img, index) => ({
        variantSku: img.variantSku,
        isPrimary: img.isPrimary,
        position: img.position,
        altText: "",
        fileIndex: index,
      })),
    };

    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("slug", payload.slug);
    formData.append("description", payload.description);
    formData.append("price", String(payload.price));
    formData.append("status", payload.status);
    formData.append("sortOrder", String(payload.sortOrder));
    formData.append("metaTitle", payload.metaTitle);
    formData.append("metaDescription", payload.metaDescription);
    formData.append("tags", JSON.stringify(payload.tags));
    formData.append("categories", JSON.stringify(payload.categories));
    formData.append("variants", JSON.stringify(payload.variants));
    formData.append("images", JSON.stringify(payload.images));
    flatImages.forEach((img) => formData.append("files", img.file));

    createProductMutation.mutate(formData);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Fill all details to create product
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form
            id="product-form"
            onSubmit={handleSubmit}
            className="p-8 space-y-12"
          >
            <ProductDetailsSection
              form={form}
              tags={tags}
              tagInput={tagInput}
              errors={productFormErrors}
              flatCategories={flatCategories}
              onFormChange={handleChange}
              onTagInputChange={(e) => setTagInput(e.target.value)}
              onTagKeyDown={handleTagKeyDown}
              onRemoveTag={removeTag}
            />

            <ProductVariantsSection
              formTitle={form.title}
              variants={variants}
              variantsArray={variantsArray}
              variantsErrors={variantsErrors}
              formError={productFormErrors.variants}
              onVariantChange={handleVariantChange}
              onAddVariant={handleAddVariant}
              onResetVariant={resetVariant}
              onRemoveVariant={(sku) => removeVariant(sku, setImages)}
            />

            <ProductImagesSection
              formTitle={form.title}
              fileInputRef={fileInputRef}
              imageArray={imageArray}
              images={images}
              selectedVariantSku={selectedVariantSku}
              variantsArray={variantsArray}
              formError={productFormErrors.images}
              onFileInputChange={handleImageChange}
              onSetPrimary={handleSetPrimary}
              onDeleteImage={handleDeleteImage}
              onSelectVariantSku={setSelectedVariantSku}
              onAddImage={() => handleAddImage(variantsArray)}
              onResetImageSection={resetImageSection}
              onRemoveVariantImages={removeVariantImages}
            />

            <SeoSection
              form={form}
              errors={productFormErrors}
              onFormChange={handleChange}
            />
          </form>
        </div>

        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-100 px-8 py-6">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-10 py-3.5 text-sm font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={createProductMutation.isPending}
              className="px-10 py-3.5 text-sm font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createProductMutation.isPending
                ? "Creating..."
                : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
