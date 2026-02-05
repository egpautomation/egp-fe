// @ts-nocheck
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/provider/AuthProvider";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import NavbarSmallDevice from "./NavbarSmallDevice";
import { ProfileDropdown } from "./ProfileDropdown";

const Navbar = () => {
  const routes = [
   
  
  ];
  const { user } = useContext(AuthContext);
  return (
    <div className="border-b">
      <div className="flex justify-between py-3 items-center">
        <div className=" flex-1">
          <h3 className=" md:text-2xl font-semibold">E-GP Tender Automation</h3>
        </div>
        <div className="flex gap-2.5 flex-1 justify-center">
          {routes?.map((item, idx) => (
            <Link className="font-semibold underline" key={idx} to={item?.href}>
              {item?.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-2.5  flex-1 justify-end">
          {user ? (
            <ProfileDropdown />
          ) : (
           ""
          )}

          <NavbarSmallDevice />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
