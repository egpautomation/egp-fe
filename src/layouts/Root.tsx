// @ts-nocheck

import Navbar from "@/shared/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Root = () => {
    return (
        <div>
            <Navbar />
            <div className="p-5 md:p-10">
            <Outlet />
            </div>
        </div>
    );
};

export default Root;