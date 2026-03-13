import { User } from "../types/UserTypes";

const GENDER_STYLES = {
  male: "text-blue-700",
  female: "text-rose-700",
} as const;

export function GenderCell({ user }: { user: User }) {
  const gender = user.gender ?? "female";

  return (
    <td className="px-6 py-4">
      <span className={`px-2 py-1 text-xs rounded ${GENDER_STYLES[gender]}`}>
        {gender}
      </span>
    </td>
  );
}
