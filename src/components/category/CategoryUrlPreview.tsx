import { Input } from "../ui/Input";

type Props = {
  slug: string;
  url: string;
  level: number;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CategoryUrlPreview({
  slug,
  url,
  level,
  error,
  onChange,
}: Props) {
  return (
    <>
      <Input
        label="Slug"
        name="slug"
        value={slug}
        onChange={onChange}
        placeholder="auto-generated-slug"
        error={error}
      />
      <Input
        label="URL Preview"
        value={url}
        disabled
        readOnly
        className="bg-gray-100 cursor-not-allowed"
      />
      <Input
        label="Level"
        value={level}
        disabled
        readOnly
        className="bg-gray-100 cursor-not-allowed"
      />
    </>
  );
}
