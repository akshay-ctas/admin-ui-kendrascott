"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { ImageArrayItem, VariantImageEntry, VariantType } from "../types";

type Props = {
  formTitle: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imageArray: ImageArrayItem[];
  images: VariantImageEntry[];
  selectedVariantSku: string;
  variantsArray: VariantType[];
  formError?: string;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetPrimary: (preview: string) => void;
  onDeleteImage: (preview: string) => void;
  onSelectVariantSku: (sku: string) => void;
  onAddImage: () => void;
  onResetImageSection: () => void;
  onRemoveVariantImages: (idx: number) => void;
};

export function ProductImagesSection({
  formTitle,
  fileInputRef,
  imageArray,
  images,
  selectedVariantSku,
  variantsArray,
  formError,
  onFileInputChange,
  onSetPrimary,
  onDeleteImage,
  onSelectVariantSku,
  onAddImage,
  onResetImageSection,
  onRemoveVariantImages,
}: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">
        Product Images
      </h2>
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
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
              <p className="text-sm text-gray-500">Recommended: 800x800 px</p>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={onFileInputChange}
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
                        onClick={() => onSetPrimary(image.preview)}
                        className="bg-white text-gray-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        Primary
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteImage(image.preview)}
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
                onChange={(e) => onSelectVariantSku(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
              >
                <option value="">-- Select Variant --</option>
                {variantsArray.map((variant) => (
                  <option key={variant.sku} value={variant.sku}>
                    {formTitle} - Size {variant.size} ({variant.color})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onResetImageSection}
                className="flex-1 px-6 py-4 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onAddImage}
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
                    onClick={() => onRemoveVariantImages(idx)}
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
  );
}
