import Image from "next/image";

type Props = {
  preview: string | null;
  imageUrl: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CategoryImageUpload({
  preview,
  imageUrl,
  onUpload,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm mb-1 text-gray-600">Category Image</label>

      <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
        {preview ? (
          <Image
            src={preview}
            alt="Category preview"
            width={160}
            height={160}
            className="object-cover h-full w-full"
          />
        ) : (
          <p className="text-sm text-gray-400">No Image</p>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <input
        type="text"
        name="imageUrl"
        value={imageUrl.startsWith("blob:") ? "" : imageUrl}
        onChange={onChange}
        placeholder="Or paste image URL"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
