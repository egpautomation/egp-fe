// @ts-nocheck

import { Bell, Search, ShoppingCart } from "lucide-react";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import { ProfileDropdown } from "@/shared/Navbar/ProfileDropdown";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "@/provider/CartContext";
import { NotificationContext } from "@/provider/NotificationContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DashboardHeader = () => {
  const { JobOrderCount } = useContext(CartContext);
  const { unreadCount } = useContext(NotificationContext) as any;

  return (
    <div className="md:sticky md:top-0 fixed top-0 left-0 right-0 md:relative py-0.5 border-b flex justify-between items-center pr-6 bg-white z-40">
      <div className="size-16 md:hidden bg-transparent -z-10"></div>

      <div className="px-5">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-[#4874c7]">ই-টেন্ডার বিডি</span>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-3 min-h-16">
        <Link className="relative max-md:hidden" to={"/dashboard/jobOrder-cart"}>
          <ShoppingCart size={32} />
          <p className="rounded-full text-[10px] h-5 w-5 text-white flex justify-center items-center bg-red-500 absolute -top-1 -right-2">
            {JobOrderCount}
          </p>
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <button className="relative max-md:hidden cursor-pointer">
              <Bell size={32} />
              {unreadCount > 0 && (
                <span className="rounded-full text-[10px] h-5 min-w-5 px-1 text-white flex justify-center items-center bg-red-500 absolute -top-1 -right-2">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <Link
                  to="/dashboard/notifications"
                  className="text-xs text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-4 text-center text-sm text-slate-500">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                : "No new notifications"}
            </div>
          </PopoverContent>
        </Popover>

        <ProfileDropdown />
      </div>
    </div>
  );
};

export default DashboardHeader;
