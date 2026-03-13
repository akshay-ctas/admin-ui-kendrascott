import { Column } from "../types/UserTypes";

export const USER_COLUMNS: Column[] = [
  { key: "user", label: "User", sortKey: "firstName", width: "w-56" },
  { key: "email", label: "Email", sortKey: "email", width: "w-48" },
  { key: "role", label: "Role", width: "w-28" },
  { key: "gender", label: "Gender", width: "w-28" },
  { key: "lastLogin", label: "Last Seen", width: "w-36", sortKey: "lastLogin" },
  { key: "createdAt", label: "Created", sortKey: "createdAt", width: "w-36" },
  { key: "actions", label: "Actions", align: "right", width: "w-24" },
];
