import UserTable from "@/components/user/Table/UserTable";

const userPage = () => {
  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Users</h1>
          <p className="text-xs text-gray-400">Manage your users</p>
        </div>
      </div>
      <UserTable />
    </div>
  );
};

export default userPage;
