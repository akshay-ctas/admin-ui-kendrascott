"use client"

import { Handbag, LayoutDashboard, Library, ShoppingCart, User2Icon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
 export const NAV_LINKS = [
   {
     id: 1,
     href: "/dashboard",
     title: "Dashboard",
     icon: LayoutDashboard,
   },
   {
     id: 2,
     href: "/products",
     title: "Products",
     icon: Handbag,
   },
   {
     id: 3,
     href: "/users",
     title: "Users",
     icon: User2Icon,
   },
   {
     id: 4,
     href: "/orders",
     title: "Orders",
     icon: ShoppingCart,
   },
   {
     id: 5,
     href: "/category",
     title: "Category",
     icon: Library,
   },
 ];

const Sidenav = () => {
   const pathname = usePathname();
 
  return (
    <div className="">
      <nav className="text-center p-2 my-2">
        <h1 className="text-2xl font-semibold">Kendrascott</h1>
      </nav>

      <span className="w-full flex h-px text-gray-400 border-b"></span>

      <div className='my-3'>
        {NAV_LINKS.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <nav
              key={item.id}
              className={` 
              ${isActive ? "bg-gray-600 text-white" : "hover:bg-gray-400"}`}
            >
              <Link href={item.href} className="flex gap-2 py-2 px-3">
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            </nav>
          );
        })}
      </div>
    </div>
  );
}

export default Sidenav