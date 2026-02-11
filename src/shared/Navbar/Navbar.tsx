// @ts-nocheck
// EGP-style navbar for root layout. When user is logged in, show ProfileDropdown instead of Login/Registration.

import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/provider/AuthProvider";
import { ProfileDropdown } from "./ProfileDropdown";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "এটি কিভাবে কাজ করে", to: "/#how-it-works" },
    { label: "সেবা সমূহ", to: "/#services" },
    { label: "STL Calculation", to: "/#stl-calculation" },
    { label: "About Us", to: "/#about" },
    { label: "Contact Us", to: "/#contact-us" },
    { label: "Blog", to: "/#blogs" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#4874c7]">ই-টেন্ডার বিডি</span>
            </Link>
          </div>

          <div className="hidden xl:flex xl:items-center xl:gap-1">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to}>
                {({ isActive }) => (
                  <div
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? "text-[#4874c7] bg-blue-50"
                        : "text-gray-700 hover:text-[#4874c7] hover:bg-blue-50"
                    }`}
                  >
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden xl:flex xl:items-center xl:gap-2">
            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="text-sm border-[#4874c7] text-[#4874c7] hover:bg-blue-50 hover:scale-102 hover:shadow-md transition-all duration-200"
                >
                  <Link to="/login">লগ ইন</Link>
                </Button>
                <Button
                  asChild
                  className="text-sm text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-102 hover:shadow-lg transition-all duration-200"
                >
                  <Link to="/registration">রেজিস্ট্রেশন করুন</Link>
                </Button>
              </>
            )}
          </div>

          <div className="xl:hidden flex items-center gap-2">
            {user && (
              <div className="flex items-center">
                <ProfileDropdown />
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#4874c7] hover:bg-blue-50 focus:outline-none transition-colors"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? <HiMenu className="h-7 w-7" /> : <HiX className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`xl:hidden bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-4 pb-3 space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 transform hover:translate-x-1 ${
                  isActive
                    ? "text-[#4874c7] bg-gradient-to-r from-blue-50 to-indigo-50"
                    : "text-gray-700 hover:text-[#4874c7] hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                }`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                <span className="text-[#4874c7] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </NavLink>
          ))}
        </div>
        {!user && (
          <div className="pt-4 pb-4 px-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full h-11 border-2 border-[#4874c7] text-[#4874c7] hover:bg-blue-50 font-medium hover:scale-102 hover:shadow-md transition-all duration-200 active:scale-95"
              >
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>লগ ইন</Link>
              </Button>
              <Button
                asChild
                className="w-full h-11 text-white bg-gradient-to-r from-[#4874c7] to-[#3a5da8] hover:from-[#3a5da8] hover:to-[#2d4987] font-medium shadow-lg hover:scale-102 hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                <Link to="/registration" onClick={() => setIsMobileMenuOpen(false)}>রেজিস্ট্রেশন করুন</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
