"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";

type UserTableHeaderProps = {
  search: string;
  isActive: boolean;
  onSearchChange: (value: string) => void;
  onIsActiveChange: (value: boolean) => void;
  onAddUser: () => void;
};

export function UserTableHeader({
  search,
  onSearchChange,
  onIsActiveChange,
  isActive,
  onAddUser,
}: UserTableHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-6 py-4 border-b">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex items-center">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users..."
            style={{ paddingLeft: "2rem" }}
            className="pr-4 py-2 text-sm border rounded bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 w-56"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={onIsActiveChange}
          />
          <Label
            htmlFor="isActive"
            className="text-sm text-gray-600 cursor-pointer"
          >
            {isActive ? "Active Users" : "All Users"}
          </Label>
        </div>
      </div>
      <button
        onClick={onAddUser}
        className="flex cursor-pointer items-center gap-2 bg-gray-800 hover:bg-gray-700 active:scale-95 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
      >
        <UserPlus size={15} />
        Add User
      </button>
    </div>
  );
}
