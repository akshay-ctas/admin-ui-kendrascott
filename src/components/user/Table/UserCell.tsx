import { User } from "../types/UserTypes";

export function UserCell({ user }: { user: User }) {
  return (
    <td className="px-6 py-4 flex items-center gap-3">
      {user.avatar ? (
        <img
          src={user.avatar}
          className="w-9 h-9 rounded-full object-cover"
          alt={`${user.firstName} ${user.lastName}`}
        />
      ) : (
        <span className="flex items-center text-xl justify-center h-9 w-9 rounded-full bg-gray-800 text-white font-semibold uppercase">
          {user.firstName?.charAt(0)}
          {user.lastName?.charAt(0)}
        </span>
      )}
      <p className="font-medium">
        {user.firstName} {user.lastName}
      </p>
    </td>
  );
}
