// @ts-nocheck

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarNew } from "@/components/ui/app-sidebar-new";
import { Outlet } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CartProvider from "@/provider/CartContext";
import { NotificationProvider } from "@/provider/NotificationContext";
import { useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <NotificationProvider>
      <CartProvider userEmail={user?.email}>
        <SidebarProvider>
          <AppSidebarNew />

          <main className=" w-full overflow-x-auto pt-16 md:pt-0">
            <DashboardHeader />
            <div className=" px-5">
              <Outlet />
              {/* dont remove this div, it's for the bottom navigation space issue */}
              <div className="md:hidden min-h-20" />
            </div>
          </main>
        </SidebarProvider>
      </CartProvider>
    </NotificationProvider>
  );
};

export default Dashboard;
