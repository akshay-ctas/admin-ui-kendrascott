import { FlatCategory } from "./utils/flattenCategories";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  categories: FlatCategory[];
};

export function CategoryParentSelect({ value, onChange, categories }: Props) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-600">
        Parent Category
      </label>
      <select
        name="parentId"
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">No Parent</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
