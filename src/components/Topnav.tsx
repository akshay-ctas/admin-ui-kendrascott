/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useAuth } from "@/context/AuthContext";
import { Bell, MessageCircle, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Topnav = () => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted)
    return (
      <header className="flex items...">
        <h1>...</h1>
        <div className="flex items-center gap-2"></div>
      </header>
    );

  return (
    <header className="flex items-center justify-between px-6 py-4.5 shrink-0">
      <h1 className="text-2xl font-extrabold text-gray-900 tracking-[-0.4px] m-0">
        Admin Panal
      </h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-[10px] px-3 py-2 w-52.5">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search stock, order, etc"
            className="w-full bg-transparent outline-none text-[12.5px] text-gray-500 placeholder:text-gray-400"
          />
        </div>

        <button className="w-9 h-9 rounded-[9px] border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <MessageCircle size={18} />
        </button>

        <button className="relative w-9 h-9 rounded-[9px] border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <Bell size={18} />
          <span className="absolute top-1.75 right-1.75 w-1.75 h-1.75 bg-orange-500 rounded-full border-[1.5px] border-white" />
        </button>

        {user ? (
          <div className="flex items-center gap-2 cursor-pointer ml-1">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
              {user && user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.firstName}
                  height={20}
                  width={20}
                />
              ) : (
                <User size={20} className="text-orange-500" />
              )}
            </div>

            <div className="leading-tight">
              <div className="text-[13px] font-bold text-gray-900">
                {user.firstName + " " + user.lastName}
              </div>
              <div className="text-[11px] text-gray-400">{user.role}</div>
            </div>
          </div>
        ) : (
          <Link
            href={"/login"}
            className="border border-gray-200 px-2 py-1 rounded-md bg-white hover:bg-transparent"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Topnav;
