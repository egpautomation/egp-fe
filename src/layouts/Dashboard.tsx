// @ts-nocheck

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppSidebarNew } from "@/components/ui/app-sidebar-new"; // NEW SIDEBAR - UNCOMMENT TO USE
import { Outlet } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CartProvider from "@/provider/CartContext";
import { useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <CartProvider userEmail={user?.email}>
      <SidebarProvider>
        {/* OLD SIDEBAR - COMMENT OUT TO USE NEW SIDEBAR */}
        {/* <AppSidebar /> */}

        {/* NEW SIDEBAR - UNCOMMENT TO USE */}
        <AppSidebarNew />

        <main className=" w-full overflow-x-auto ">
          <DashboardHeader />
          <div className=" px-5">
            <Outlet />
            {/* dont remove this div, it's for the bottom navigation space issue */}
            <div className="md:hidden min-h-20" />
          </div>
        </main>
      </SidebarProvider>
    </CartProvider>
  );
};

export default Dashboard;
