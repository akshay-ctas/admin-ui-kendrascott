import { Input } from "../ui/Input";

type Props = {
  metaTitle: string;
  metaDescription: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

export function CategoryMetaFields({
  metaTitle,
  metaDescription,
  onChange,
}: Props) {
  return (
    <>
      <Input
        label="Meta Title"
        name="metaTitle"
        value={metaTitle}
        onChange={onChange}
        placeholder="SEO title"
      />
      <div>
        <label className="block text-sm mb-1 text-gray-600">
          Meta Description
        </label>
        <textarea
          name="metaDescription"
          value={metaDescription}
          onChange={onChange}
          rows={3}
          placeholder="SEO description"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
        />
      </div>
    </>
  );
}
