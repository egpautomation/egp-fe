// @ts-nocheck

import Navbar from "@/shared/Navbar/Navbar";
import Footer from "@/shared/Footer/Footer";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Root;
