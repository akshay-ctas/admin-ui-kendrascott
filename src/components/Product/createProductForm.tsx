"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/Input";
import { flattenCategories } from "../category/utils/flattenCategories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoryTree } from "@/services/category.service";
import Image from "next/image";
import { createProduct } from "@/services/product.service";
import { toast } from "react-toastify";
import { generateSKU } from "@/lib/utils";
import { generateSlug } from "@/lib/slugify";
import { AxiosError } from "axios";

export type FormType = {
  title: string;
  slug: string;
  price: string;
  status: string;
  parentId: string;
  sortOrder: string;
  description: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  variants: VariantType[];
  images: ImagePayload[];
};

type VariantType = {
  color: string;
  metalType: string;
  stoneType: string;
  price: string;
  size: string;
  stock: string;
  isAvailable: boolean;
  sku: string;
};

type ImagePayload = {
  file: File;
  variantSku: string;
  isPrimary: boolean;
  position: number;
};

type ImageArrayItem = {
  file: File;
  preview: string;
  variantSku: string;
  isPrimary: boolean;
  position: number;
};

type VariantImageEntry = {
  variantSku: string;
  variantDetails: VariantType | undefined;
  primaryImage: ImageArrayItem;
  allImages: ImageArrayItem[];
  totalImages: number;
};

export function CreateProductFormDummy({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    status: "",
    parentId: "",
    sortOrder: "",
    description: "",
    tags: [] as string[],
    metaTitle: "",
    metaDescription: "",
    variants: [] as VariantType[],
    images: [] as ImagePayload[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [productFormErrors, setProductFormErrors] = useState<
    Record<string, string>
  >({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageArray, setImageArray] = useState<ImageArrayItem[]>([]);
  const [selectedVariantSku, setSelectedVariantSku] = useState("");
  const [images, setImages] = useState<VariantImageEntry[]>([]);

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
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to create product");
      console.error("Product creation failed:", error);
    },
  });

  const flatCategories = useMemo(() => {
    return data ? flattenCategories(data) : [];
  }, [data]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && { slug: generateSlug(value) }),
    }));
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    setVariants((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (["color", "size"].includes(name)) {
        updated.sku = generateSKU(form.title, updated);
      }
      return updated;
    });
  };

  const productFormValidate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (form.title.trim().length > 200) {
      newErrors.title = "Title too long (max 200 characters)";
    }

    if (!form.slug.trim()) {
      newErrors.slug = "Product slug is required";
    } else if (!/^[a-z0-9-]{3,}$/.test(form.slug.trim())) {
      newErrors.slug =
        "Invalid slug format (min 3 chars, lowercase, hyphen only)";
    }

    if (!form.price.trim() || parseFloat(form.price) <= 0) {
      newErrors.price = "Product price is required";
    }

    if (!form.parentId) {
      newErrors.parentId = "At least one category is required";
    }

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    if (variantsArray.length === 0) {
      newErrors.variants = "At least one variant is required";
    }

    if (images.length === 0 && imageArray.length === 0) {
      newErrors.images = "At least one image is required";
    }

    if (form.metaTitle && form.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title too long (max 60 chars)";
    }

    if (form.metaDescription && form.metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description too long (max 160 chars)";
    }

    setProductFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productFormValidate()) return;

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
      status: form.status || "ACTIVE",
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

  const removeVariant = (sku: string) => {
    setVariantsArray((prev) => prev.filter((v) => v.sku !== sku));
    setImages((prev) => prev.filter((img) => img.variantSku !== sku));
  };

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

  const handleAddImage = () => {
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
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
                Product Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  name="title"
                  label="Product Title"
                  value={form.title}
                  onChange={handleChange}
                  error={productFormErrors.title}
                />
                <Input
                  name="slug"
                  label="Slug"
                  value={form.slug}
                  onChange={handleChange}
                  error={productFormErrors.slug}
                />
                <Input
                  name="price"
                  label="Price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  error={productFormErrors.price}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category
                  </label>
                  <select
                    name="parentId"
                    value={form.parentId}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
                  >
                    <option value="">Select Category</option>
                    {flatCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {productFormErrors.parentId && (
                    <p className="text-red-500 text-xs mt-1">
                      {productFormErrors.parentId}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all resize-none"
                  />
                </div>
                <div>
                  <Input
                    label="Product Tags"
                    name="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Press Enter to add"
                  />
                  {productFormErrors.tags && (
                    <p className="text-red-500 text-xs mt-1">
                      {productFormErrors.tags}
                    </p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 p-4 bg-white border border-gray-200 rounded-xl">
                      {tags.map((tagItem, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-full flex items-center shadow-sm"
                        >
                          {tagItem}
                          <button
                            type="button"
                            onClick={() => removeTag(tagItem)}
                            className="ml-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold transition-all duration-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
                Product Variants
              </h2>
              {productFormErrors.variants && (
                <p className="text-red-500 text-sm">
                  {productFormErrors.variants}
                </p>
              )}
              <div className="grid lg:grid-cols-4 gap-8 p-8 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Variants List
                  </h3>
                  {variantsArray.length > 0 ? (
                    variantsArray.map((variant) => (
                      <div
                        key={variant.sku}
                        className="group relative p-5 mb-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer"
                      >
                        <p className="text-base font-semibold text-gray-900 mb-1">
                          {form.title} - Size {variant.size}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Stock: {variant.stock}
                        </p>
                        <X
                          onClick={() => removeVariant(variant.sku)}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer"
                          size={20}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-gray-500 text-lg">No variants added</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-8">
                    Add New Variant
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Input
                      name="color"
                      label="Color"
                      value={variants.color}
                      onChange={handleVariantChange}
                      error={variantsErrors.color}
                    />
                    <Input
                      name="metalType"
                      label="Metal Type"
                      value={variants.metalType}
                      onChange={handleVariantChange}
                      error={variantsErrors.metalType}
                    />
                    <Input
                      name="stoneType"
                      label="Stone Type"
                      value={variants.stoneType}
                      onChange={handleVariantChange}
                      error={variantsErrors.stoneType}
                    />
                    <Input
                      name="size"
                      label="Size"
                      value={variants.size}
                      onChange={handleVariantChange}
                      error={variantsErrors.size}
                    />
                    <Input
                      name="price"
                      label="Price"
                      value={variants.price}
                      onChange={handleVariantChange}
                      error={variantsErrors.price}
                    />
                    <Input
                      name="stock"
                      label="Stock"
                      value={variants.stock}
                      onChange={handleVariantChange}
                      error={variantsErrors.stock}
                    />
                    <div className="col-span-3 flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={variants.isAvailable}
                        onChange={handleVariantChange}
                        className="w-5 h-5 rounded accent-gray-900"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="mt-10 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setVariants({
                          color: "",
                          metalType: "",
                          stoneType: "",
                          size: "",
                          price: "",
                          stock: "",
                          isAvailable: false,
                          sku: "",
                        })
                      }
                      className="px-8 py-3 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-8 py-3 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Add Variant
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
                Product Images
              </h2>
              {productFormErrors.images && (
                <p className="text-red-500 text-sm">
                  {productFormErrors.images}
                </p>
              )}
              <div className="p-8 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl group-hover:bg-gray-200 transition-colors" />
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        Upload Images
                      </p>
                      <p className="text-sm text-gray-500">
                        Recommended: 800x800 px
                      </p>
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {imageArray.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {imageArray.map((image, index) => (
                          <div
                            key={image.preview}
                            className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <Image
                              src={image.preview}
                              alt={`preview-${index}`}
                              className="w-full h-48 object-cover"
                              width={400}
                              height={400}
                            />
                            {image.isPrimary && (
                              <span className="absolute top-3 left-3 bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                                Primary
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(image.preview)}
                                className="bg-white text-gray-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm hover:shadow-md transition-all"
                              >
                                Primary
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(image.preview)}
                                className="bg-white text-gray-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm hover:shadow-md transition-all"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-white hover:border-gray-300 transition-all duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Variant
                      </label>
                      <select
                        value={selectedVariantSku}
                        onChange={(e) => setSelectedVariantSku(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
                      >
                        <option value="">-- Select Variant --</option>
                        {variantsArray.map((variant) => (
                          <option key={variant.sku} value={variant.sku}>
                            {form.title} - Size {variant.size} ({variant.color})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setImageArray([]);
                          setSelectedVariantSku("");
                        }}
                        className="flex-1 px-6 py-4 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="flex-1 px-6 py-4 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Add Images
                      </button>
                    </div>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">
                      Saved Images ({images.length} variants)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((variantImg, idx) => (
                        <div
                          key={variantImg.variantSku}
                          className="group relative bg-white p-3 border rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
                        >
                          <Image
                            src={variantImg.primaryImage.preview}
                            alt="primary"
                            width={200}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="mt-2 space-y-1">
                            <span className="block text-xs font-semibold text-gray-800">
                              Size: {variantImg.variantDetails?.size} |{" "}
                              {variantImg.variantDetails?.color}
                            </span>
                            <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-full">
                              SKU: {variantImg.variantSku}
                            </span>
                            <span className="block text-xs text-gray-500 mt-1">
                              📷 {variantImg.totalImages} image
                              {variantImg.totalImages > 1 ? "s" : ""}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setImages(images.filter((_, i) => i !== idx))
                            }
                            className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
                SEO Settings
              </h2>
              <div className="grid md:grid-cols-2 gap-6 p-8 bg-gray-50/50 rounded-2xl border border-gray-100">
                <Input
                  name="metaTitle"
                  label="Meta Title"
                  value={form.metaTitle}
                  onChange={handleChange}
                  error={productFormErrors.metaTitle}
                />
                <Input
                  name="metaDescription"
                  label="Meta Description"
                  value={form.metaDescription}
                  onChange={handleChange}
                  error={productFormErrors.metaDescription}
                />
              </div>
            </section>
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
