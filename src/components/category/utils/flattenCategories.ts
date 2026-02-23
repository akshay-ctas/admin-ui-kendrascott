export type Category = {
  _id: string;
  name: string;
  level: number;
  children?: Category[];
  url: string;
};

export type FlatCategory = {
  _id: string;
  name: string;
  level: number;
  url: string;
};

export function flattenCategories(
  categories: Category[],
  depth = 0,
): FlatCategory[] {
  let result: FlatCategory[] = [];

  categories.forEach((cat) => {
    result.push({
      _id: cat._id,
      name: `${"— ".repeat(depth)}${cat.name}`,
      level: cat.level,
      url: cat.url,
    });

    if (cat.children?.length) {
      result = result.concat(flattenCategories(cat.children, depth + 1));
    }
  });

  return result;
}
