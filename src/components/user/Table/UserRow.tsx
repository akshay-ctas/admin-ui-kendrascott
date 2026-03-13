import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { UserCell } from "./UserCell";
import { RoleCell } from "./RoleCell";
import { ActionsCell } from "./ActionsCell";
import { User } from "../types/UserTypes";
import { Column } from "../types/UserTypes";
import { USER_COLUMNS } from "../constants/UserConstants";
import { GenderCell } from "./GenderCell";

export function UserRow({ user }: { user: User }) {
  const cellMap: Record<Column["key"], React.ReactNode> = {
    user: <UserCell user={user} />,
    email: <td className="px-6 py-4 text-gray-600">{user.email}</td>,
    role: <RoleCell role={user.role} />,
    lastLogin: (
      <td className="px-6 py-4 text-gray-500">
        {formatDistanceToNow(user.lastLogin, { addSuffix: true })}
      </td>
    ),
    gender: <GenderCell user={user} />,
    createdAt: (
      <td className="px-6 py-4 text-gray-500">
        {format(user.createdAt, "d MMM yyyy")}
      </td>
    ),
    actions: <ActionsCell userId={user._id} />,
  };

  return (
    <tr className="hover:bg-gray-50">
      {USER_COLUMNS.map((col) => (
        <React.Fragment key={col.key}>{cellMap[col.key]}</React.Fragment>
      ))}
    </tr>
  );
}
