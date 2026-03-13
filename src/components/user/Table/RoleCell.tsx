export function RoleCell({ role }: { role?: string }) {
  return (
    <td className="px-6 py-4">
      <span className="px-2 py-1 text-xs bg-gray-100 rounded">
        {role || "User"}
      </span>
    </td>
  );
}
