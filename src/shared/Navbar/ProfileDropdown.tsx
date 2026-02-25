// @ts-nocheck
import { AuthContext } from "@/provider/AuthProvider";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ProfileDropdown() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="relative group">
      <button
        type="button"
        className="bg-violet-800 h-10 w-10 flex justify-center items-center rounded-full focus:outline-none"
        aria-label="Open profile menu"
      >
        <h3 className="text-2xl text-white font-semibold">
          {user.email?.slice(0, 1).toUpperCase()}
        </h3>
      </button>

      <div className="absolute right-0 top-full pt-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
        <div className="w-44 rounded-xl border border-slate-200 bg-white shadow-lg p-1.5">
          <Link
            to="/dashboard"
            className="block w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#4874c7] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard/profile"
            className="block w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#4874c7] transition-colors"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
