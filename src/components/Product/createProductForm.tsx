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
import { AxiosError } from "axios";
import { generateSKU } from "@/lib/utils";

export type FormType = {
  title: string;
  slug: string;
  price: string;
  status: string;
  parentId: string;
  sortOrder: string;
  description: string;
  tags: never[];
  metaTitle: string;
  metaDescription: string;
  variants: never[];
  images: never[];
};
export function CreateProductForm({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<FormType>({
    title: "",
    slug: "",
    price: "",
    status: "",
    parentId: "",
    sortOrder: "",
    description: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    variants: [],
    images: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [variantsArray, setVariantsArray] = useState([]);
  const [variants, setVariants] = useState({
    color: "",
    metalType: "",
    stoneType: "",
    size: "",
    price: "",
    stock: "",
    isAvailable: false,
    sku: "",
  });

  const [imageArray, setImageArray] = useState([]);
  const [images, setImages] = useState({
    isPrimary: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [variantsErrors, setVariantsErrors] = useState<Record<string, string>>(
    {},
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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
  const createCategoryMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      toast.success("Category created successfully!");
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category",
      );
      console.error("Category creation failed:", error);
      onClose();
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

    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleVariantChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (name === "name") {
      setVariants((prev) => ({
        ...prev,
        name: value,
      }));
      return;
    }

    setVariants((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    setVariants((prev) => {
      const updated = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };

      if (["color", "size"].includes(name)) {
        updated.sku = generateSKU(form.title, updated);
      }

      return updated;
    });
  };
  const variantsValidate = () => {
    const newErrors: Record<string, string> = {};

    if (!variants.color.trim()) {
      newErrors.color = "Color is required";
    }

    if (!variants.metalType.trim()) {
      newErrors.metalType = "metalType is required";
    }

    if (!variants.stoneType.trim()) {
      newErrors.stoneType = "stoneType is required";
    }

    if (!variants.price.trim()) {
      newErrors.price = "price is required";
    }

    if (!variants.stock.trim()) {
      newErrors.stock = "stock is required";
    }

    if (!variants.size.trim()) {
      newErrors.size = "size is required";
    }

    setVariantsErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleAddVerients = (e: React.FormEvent) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...form,
      tags,
      variants: variantsArray,
      images,
    };

    console.log("Final data:", submitData);
  };

  const removeVerient = (sku: string) => {
    const filterVerient = variantsArray.filter((v) => v.sku !== sku);
    setVariantsArray(filterVerient);
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center pt-10 bg-black/50 transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-full rounded-md overflow-y-auto scrollbar-hide container -xl shadow-lg space-y-4 max-h-[90vh] transform transition-all duration-200 ${
          show
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-4 opacity-0 scale-95"
        }`}
      >
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Add Product
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
        <h2 className="text-lg px-6 font-semibold text-gray-800 mb-4">
          Product Details
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-gray-50  py-6 space-y-4  border">
            <div className="grid px-6 md:grid-cols-3 gap-4">
              <Input
                label="Product Name"
                name="title"
                value={form.title}
                onChange={handleChange}
                error={errors.title}
              />
              <Input
                label="Product Slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                error={errors.slug}
              />
              <Input
                label="Product Price"
                name="price"
                value={form.price}
                onChange={handleChange}
                error={errors.price}
              />
            </div>

            <div className="grid px-6 md:grid-cols-3 gap-4">
              <Input
                label="Product status"
                name="status"
                value={form.status}
                onChange={handleChange}
                error={errors.status}
              />

              <div>
                <label className="block text-sm mb-1">Parent Category</label>
                <select
                  name="parentId"
                  onChange={handleChange}
                  className="w-full border -lg px-3 py-2 text-sm"
                >
                  {flatCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                error={errors.sortOrder}
                label="Sort Order"
                placeholder="sort order"
              />
            </div>
            <div className="grid px-6 md:grid-cols-3 ">
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">
                  Product Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  //error={errors.description}
                  placeholder="Product Description"
                  className="w-full border -lg px-3 py-2 text-sm"
                />
              </div>
              <div className="grid px-6 md:grid-cols-1 gap-4">
                <Input
                  label="Product Tags"
                  name="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Press Enter to add tag"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tagItem, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {tagItem}
                        <button
                          type="button"
                          onClick={() => removeTag(tagItem)}
                          className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 ">
            <h2 className="text-lg px-6 font-semibold text-gray-800 mb-4">
              Product Variant
            </h2>
            <div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-6  border">
              <div className="md:col-span-1 border-r pr-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Variant list
                </h3>

                {variantsArray.length > 0 ? (
                  variantsArray.map((variant) => {
                    return (
                      <div key={variant?.sku} className=" space-y-2">
                        <div className="relative p-3 mb-2 bg-white -lg  border  transition cursor-pointer">
                          <p className="text-sm font-medium">
                            {form.title} - Size {variant.size}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock: {variant.stock}
                          </p>
                          <X
                            onClick={() => removeVerient(variant.sku)}
                            className="absolute top-1 right-1 text-gray-700 hover:text-gray-950 cursor-pointer"
                            size={20}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No varient</p>
                )}
              </div>

              <div className="md:col-span-2 bg-white p-6 -xl border">
                <h3 className="text-sm font-medium text-gray-600 mb-4">
                  Add / Edit Variant
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    name="color"
                    label="Color"
                    placeholder="Enter color"
                    value={variants.color}
                    onChange={handleVariantChange}
                    error={variantsErrors.color}
                  />
                  <Input
                    name="metalType"
                    label="Metal Type"
                    placeholder="18K Gold"
                    value={variants.metalType}
                    onChange={handleVariantChange}
                    error={variantsErrors.metalType}
                  />
                  <Input
                    name="stoneType"
                    label="Stone Type"
                    placeholder="Diamond"
                    value={variants.stoneType}
                    onChange={handleVariantChange}
                    error={variantsErrors.stoneType}
                  />
                  <Input
                    name="size"
                    label="Size"
                    placeholder="6"
                    value={variants.size}
                    onChange={handleVariantChange}
                    error={variantsErrors.size}
                  />
                  <Input
                    name="price"
                    label="Price"
                    placeholder="₹45999"
                    value={variants.price}
                    onChange={handleVariantChange}
                    error={variantsErrors.price}
                  />
                  <Input
                    name="stock"
                    label="Stock"
                    placeholder="10"
                    value={variants.stock}
                    onChange={handleVariantChange}
                    error={variantsErrors.stock}
                  />

                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={variants.isAvailable}
                      onChange={handleVariantChange}
                      className="h-4 w-4 accent-black"
                    />
                    <label className="text-sm text-gray-600">Active</label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
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
                    className="px-4 py-2 text-sm border -lg hover:bg-gray-100 transition"
                  >
                    Reset
                  </button>

                  <button
                    onClick={handleAddVerients}
                    className="px-4 py-2 text-sm bg-black text-white -lg hover:bg-gray-800 transition"
                  >
                    Add Variant
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 ">
            <h2 className="text-lg px-6 font-semibold text-gray-800 mb-4">
              Product Images
            </h2>

            <div className="bg-gray-50 border -xl p-6 space-y-4">
              <div className="bg-gray-50 border rounded-xl p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center bg-white hover:bg-gray-100 transition cursor-pointer flex flex-col justify-center items-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      Upload Product Images
                    </p>
                    <p className="text-xs text-gray-400">
                      Recommended: 800x800 px
                    </p>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      // onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  <div className="md:col-span-1 bg-white p-4 rounded-lg border flex flex-col justify-between">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Varients
                      </label>
                      <select
                        name="parentId"
                        // value={images.variantSku}
                        // onChange={handleImageChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        {variantsArray.map((variant) => (
                          <option key={variant.sku} value={variant.sku}>
                            {form.title} - Size {variant.size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        name="isPrimary"
                        className="h-4 w-4 accent-black"
                      />
                      <label className="text-sm text-gray-600">isPrimary</label>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex  justify-center items-center gap-3">
                    <button className="px-4 py-2 max-w-50 text-sm border rounded-lg hover:bg-gray-100 transition">
                      Reset
                    </button>
                    <button className="px-4 py-2 max-w-50 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition">
                      Add Variant
                    </button>
                  </div>
                </div>
              </div>

              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div
                    key={img.altText}
                    className="relative group border -lg overflow-hidden bg-white "
                  >
                    <Image
                      src={"/img.url"}
                      alt={img.altText}
                      className="h-40 w-full object-cover"
                      width={400}
                      height={400}
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                      <div className="flex flex-col text-xs text-white">
                        <span>Position: {img.position}</span>
                        <span>Width: {img.width || "-"}</span>
                        <span>Height: {img.height || "-"}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="bg-green-600 text-white px-2 py-1  text-xs">
                          Primary
                        </button>
                        <button className="bg-red-600 text-white px-2 py-1  text-xs">
                          Delete
                        </button>
                      </div>
                    </div>

                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 ">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg px-6 font-semibold text-gray-800 mb-4">
              Product SEO
            </h2>
            <div className="grid bg-gray-50 border py-6 px-6 md:grid-cols-3 gap-4">
              <Input
                name="metaTitle"
                label="metaTitle"
                placeholder="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
              />
              <Input
                name="metaDescription"
                label="metaDescription"
                placeholder="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          <span className="flex border py-6"></span>
          <div className="mt-6 flex justify-end gap-3 p-6 ">
            <button className="px-4 py-2 text-sm border -lg hover:bg-gray-100 transition">
              Reset
            </button>

            <button className="px-4 py-2 text-sm bg-black text-white -lg hover:bg-gray-800 transition">
              Add Variant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
