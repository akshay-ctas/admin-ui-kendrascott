import { useState } from "react";
import {
  FormType,
  VariantType,
  ImagePayload,
  VariantImageEntry,
} from "../types";
import { generateSlug } from "@/lib/slugify";

export const INITIAL_FORM: Omit<FormType, "variants" | "images"> & {
  variants: VariantType[];
  images: ImagePayload[];
} = {
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
};

export function useProductForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [productFormErrors, setProductFormErrors] = useState<
    Record<string, string>
  >({});

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

  const productFormValidate = (
    tags: string[],
    variantsArray: VariantType[],
    images: VariantImageEntry[],
    imageArray: { file: File }[],
  ): boolean => {
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

  return {
    form,
    productFormErrors,
    handleChange,
    productFormValidate,
  };
}
