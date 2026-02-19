
import { Bell, ChevronDown, MessageCircle, Search, User } from 'lucide-react';

const Topnav = () => {

 
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

        <div className="flex items-center gap-2 cursor-pointer ml-1">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
            <User size={20} className="text-orange-500" />
          </div>

          <div className="leading-tight">
            <div className="text-[13px] font-bold text-gray-900">
              Marcus George
            </div>
            <div className="text-[11px] text-gray-400">Admin</div>
          </div>

          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
}

export default Topnav