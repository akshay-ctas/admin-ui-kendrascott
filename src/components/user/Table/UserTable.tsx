"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/user.service";
import { Column, SortConfig, User } from "../types/UserTypes";
import { USER_COLUMNS } from "../constants/UserConstants";
import { UserRow } from "./UserRow";
import { Pagination } from "./Pagination";
import { UserTableHeader } from "./UserTableHeader";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

const LIMIT = 10;

export default function UserTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleSort = (sortKey: SortConfig["sortBy"]) => {
    setSortConfig((prev) => ({
      sortBy: sortKey,
      sortOrder:
        prev.sortBy === sortKey && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const { data } = useQuery({
    queryKey: ["users", page, LIMIT, debouncedSearch, isActive, sortConfig],
    queryFn: () =>
      getUser({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        isActive,
        ...sortConfig,
      }),
    staleTime: 3600,
    placeholderData: keepPreviousData,
  });
  const onAddUser = () => {};

  return (
    <div className="p-6">
      <div className="bg-white rounded overflow-hidden">
        <UserTableHeader
          search={search}
          onSearchChange={setSearch}
          isActive={isActive}
          onIsActiveChange={setIsActive}
          onAddUser={onAddUser}
        />

        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {USER_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortKey && handleSort(col.sortKey)}
                  className={`px-6 py-4 ${col.width ?? ""} ${
                    col.align === "right" ? "text-right" : ""
                  } ${
                    col.sortKey
                      ? "cursor-pointer hover:bg-gray-200 transition-colors select-none"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {col.label}
                    {col.sortKey && (
                      <SortIcon column={col} sortConfig={sortConfig} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.data.map((user: User) => (
              <UserRow key={user._id} user={user} />
            ))}
          </tbody>
        </table>

        {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
      </div>
    </div>
  );
}

function SortIcon({
  column,
  sortConfig,
}: {
  column: Column;
  sortConfig: SortConfig;
}) {
  if (sortConfig.sortBy !== column.sortKey) {
    return <ChevronsUpDown size={18} className="text-gray-400" />;
  }
  return sortConfig.sortOrder === "asc" ? (
    <ChevronUp size={18} className="text-gray-800" />
  ) : (
    <ChevronDown size={18} className="text-gray-800" />
  );
}
