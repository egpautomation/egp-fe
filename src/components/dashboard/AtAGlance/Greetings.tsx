// @ts-nocheck

import useAllTenders from "@/hooks/useAllTenders";
import useUsersCompanyMigration from "@/hooks/useUsersCompanyMigrations";
import { AuthContext } from "@/provider/AuthProvider";
import { CartContext } from "@/provider/CartContext";
import { ChevronRight, Dot, RefreshCw } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";

const Greetings = () => {
  const { user } = useContext(AuthContext);
  const { JobOrderCount } = useContext(CartContext);
  const { tendersCount } = useAllTenders("");
  const { companyMigrations } = useUsersCompanyMigration(user?.email, "");
  const inActiveMigrations = companyMigrations?.filter((item) => item.status === "inactive");

  // Real-time wallet data
  const [walletData, setWalletData] = useState({
    balance: user?.wallet?.balance || 0,
    coins: user?.wallet?.coins || 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real-time wallet data
  // Fetch real-time wallet data
  const fetchWalletData = async () => {
    if (!user?.userId) return;

    setIsRefreshing(true);
    try {
      // Correct endpoint verified from ViewUser.tsx
      const response = await axiosInstance.get(
        `/user/get-single-user-by-userId?userId=${user.userId}`
      );

      // Response structure: { success: true, data: { wallet: { ... } } }
      if (response.data?.success && response.data?.data?.wallet) {
        setWalletData({
          balance: response.data.data.wallet.balance || 0,
          coins: response.data.data.wallet.coins || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="shadow-xl mt-10 border border-gray-50">
      {/* Greetings */}
      <div className="py-5">
        <div className="p-3 md:p-5">
          <h1 className="text-xl md:text-3xl font-semibold">As-Salamu Alaykum, {user?.name}</h1>
          <p className="text-sm md:text-lg mt-2 text-gray-700 font-medium">
            Here's is what happening with your EGP Automation today
          </p>
        </div>
        {/* Balance & coins */}
        <div className="flex md:gap-8 md:mt-8">
          <div className="p-3 md:p-5 ">
            <div className="flex items-center gap-2">
              <p className="md:text-lg font-medium text-gray-600">Current Balance</p>
              <Button
                onClick={fetchWalletData}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                title="Refresh Balance"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-500 hover:text-gray-700 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            <h1 className="text-xl md:text-3xl font-semibold text-gray-700 mt-2">
              {walletData.balance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h1>
          </div>
          <div className="p-3 md:p-5 ml-5 md:ml-10">
            <p className="md:text-lg font-medium text-gray-600">Use Coins</p>
            <h1 className="text-xl md:text-3xl font-semibold text-gray-700 mt-2">
              {walletData.coins || "00"}
            </h1>
          </div>
        </div>
      </div>

      {/* stats */}

      <div className="">
        <div className="flex flex-wrap justify-between py-1.5  px-3 md:p-5 border-b-2 bg-red-200 text-orange-800 font-semibold">
          <p className=" text-sm md:text-base ">
            <Dot className="inline-block" /> {inActiveMigrations?.length} Egp Id did not ready to
            order a job
          </p>
          <Link to={"/dashboard/my-registered-company"} className="text-sm md:text-base w-max">
            <span className=" flex">
              Update Egp Id Information <ChevronRight className="inline-block" />
            </span>
          </Link>
        </div>
        <div className="flex flex-wrap justify-between py-1.5  px-3 md:p-5 border-b-2  text-gray-600 font-semibold">
          <p className=" text-sm md:text-base ">
            <Dot className="inline-block text-blue-700" />{" "}
            {JobOrderCount
              ? `Almost there! Your ${JobOrderCount} job orders are ready for checkout.`
              : "Looks like your cart is empty. Find a job order to add!"}
          </p>
          <Link
            to={"/dashboard/jobOrder-cart"}
            className="text-sm md:text-base w-max text-blue-700"
          >
            <span className=" flex">
              View Checkout <ChevronRight className="inline-block" />
            </span>
          </Link>
        </div>
        <div className="flex flex-wrap justify-between py-1.5  px-3 md:p-5   text-gray-600 font-semibold">
          <p className=" text-sm md:text-base ">
            <Dot className="inline-block text-blue-700" /> {tendersCount} Tenders are live — send us
            your job orders to proceed.
          </p>
          <Link to={"/dashboard/live-tenders"} className="text-sm md:text-base w-max text-blue-700">
            <span className=" flex">
              All Live Tenders <ChevronRight className="inline-block" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Greetings;
