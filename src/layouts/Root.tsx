// @ts-nocheck

import Navbar from "@/shared/Navbar/Navbar";
import Footer from "@/shared/Footer/Footer";
import { Outlet } from "react-router-dom";

const Root = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 p-5 md:p-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Root;