// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSingleData from "@/hooks/useSingleData";
import { createData } from "@/lib/createData";
import { AuthContext } from "@/provider/AuthProvider";
import { CartContext } from "@/provider/CartContext";
import axios from "axios";
import { SquareX, RefreshCw } from "lucide-react";
import { use, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Link, useLocation } from "react-router-dom";

const JobOrderCart = () => {
  const { user, setUser } = useContext(AuthContext);
  const [code, setCode] = useState(null);
  const { userJobOrderCart, totalPrice, setReload } = useContext(CartContext);
  const location = useLocation();
  const promoCodeUrl = code
    ? `https://egpserver.jubairahmad.com/api/v1/promoCode/findByCode/${code}`
    : `https://egpserver.jubairahmad.com/api/v1/promoCode/findByCode/${null}`;
  const { data: promoCode, setReload: refetchPromo } = useSingleData(promoCodeUrl);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  const fetchWalletData = useCallback(async () => {
    if (!user?.userId) return;

    setIsRefreshing(true);
    try {
      const response = await axiosInstance.get(`/user/get-single-user-by-userId?userId=${user.userId}`);

      if (response.data?.success && response.data?.data?.wallet) {
        setUser({
          ...user,
          wallet: response.data.data.wallet
        });
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [user?.userId, setUser]);

  const handleUniversalRefresh = useCallback(async () => {
    setIsRefreshingAll(true);
    try {
      await fetchWalletData(); // Fetches wallet and manages isRefreshing state
      setReload((prev) => prev + 1); // Reloads cart data
      refetchPromo((prev) => prev + 1); // Reloads promo code data
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setTimeout(() => setIsRefreshingAll(false), 500);
    }
  }, [fetchWalletData, setReload, refetchPromo]);

  // Auto refresh when page loads or when navigating to this page
  useEffect(() => {
    if (location.pathname === "/dashboard/jobOrder-cart") {
      handleUniversalRefresh();
    }
  }, [location.pathname, handleUniversalRefresh]);



  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://egp-tender-automation-server.vercel.app/api/v1/jobOrder-cart/${id}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setReload((prevReload) => prevReload + 1);
    }
  };




  const handleDownloadFile = async (id) => {
    const api = `https://egpserver.jubairahmad.com/api/v1/jobOrder-cart/jobOrderCart/${id}/file`
    console.log(api)
    try {

      const link = document.createElement("a");
      link.href = api;
      link.setAttribute("download", ""); // let backend set filename
      link.style.display = "none";       // keep it hidden
      document.body.appendChild(link);

      // ✅ Trigger download without reload
      link.click();

      document.body.removeChild(link);

    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };



  const handleCheckout = () => {
    const grandTotal = promoCode
      ? totalPrice - (promoCode.percent / 100) * Number(totalPrice)
      : Number(totalPrice);
    const createOrder = {
      jobOrders: userJobOrderCart,
      totalPrice: grandTotal,
      user: user?.email,
      remainingBalance: user?.wallet?.balance - grandTotal,
    };

    const updatedUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: createOrder.remainingBalance
      }
    };
    // https://egpserver.jubairahmad.com
    const url = "https://egpserver.jubairahmad.com/api/v1/jobOrder/create-jobOrder";
    createData(url, createOrder, setReload);
    setReload((prevReload) => prevReload + 1);
    setUser(updatedUser)
    setCode("")
  };
  const grandTotal = promoCode
    ? totalPrice - (promoCode.percent / 100) * totalPrice
    : totalPrice;

  return (
    <div className="min-h-lvh p-5">
      <div className="flex justify-between items-center mb-5">
        <div className=""></div>
        <Button onClick={handleUniversalRefresh} disabled={isRefreshingAll || isRefreshing} className="cursor-pointer">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshingAll ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-3 lg:col-span-2 grid gap-5 h-max">
          {userJobOrderCart?.length > 0 ? (
            userJobOrderCart?.map((item, idx) => (
              <div key={idx}>
                <div

                  className="rounded-md shadow-md border p-2 md:p-5 md:px-10 relative"
                >
                  <h1 className="text-xl font-semibold mb-2">
                    {item?.serviceName}
                  </h1>
                  <h1>
                    <span className="font-semibold">E-GP Email:</span>{" "}
                    {item?.egpMail}
                  </h1>
                  <h1>
                    <span className="font-semibold mt-2">Tender Id:</span>{" "}
                    {item?.tenderId}
                  </h1>
                  <h1>
                    <span className="font-semibold mt-2">Service Price:</span>{" "}
                    {item?.servicePrice}
                  </h1>
                  <button
                    onClick={() => handleDelete(item?._id)}
                    className="text-gray-500 absolute top-3 right-3 cursor-pointer"
                  >
                    <SquareX size={18} />
                  </button>
                </div>

                {/* {item?.file && <Button onClick={() => handleDownloadFile(item?._id)}>Download File</Button>} */}
              </div>
            ))
          ) : (
            <h1 className="text-3xl font-semibold">Your Cart Is Empty!</h1>
          )}
        </div>
        <div className=" col-span-3 lg:col-span-1 flex flex-col justify-between h-max">
          <div className="mt-2 rounded-md shadow-lg border p-2 md:p-5 ">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Available Balance</h1>

            </div>
            <h1 className="text-2xl font-semibold">
              {user?.wallet?.balance || "00"}
            </h1>
          </div>
          <div className="mt-2 rounded-md shadow-lg border p-2 md:p-5 ">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Order Summery</h1>

            </div>
            <h1>
              <span className="font-semibold mt-2">Total Price: </span>{" "}
              {totalPrice}
            </h1>
            <h1>
              <span className="font-semibold mt-2">Discount: </span>{" "}
              {code && promoCode
                ? `${(promoCode?.percent / 100) * totalPrice}`
                : `00`}
            </h1>
            <h1>
              <span className="font-semibold mt-2">Grand Total: </span>{" "}
              {promoCode
                ? totalPrice - (promoCode.percent / 100) * totalPrice
                : totalPrice}
            </h1>
            <div className="mt-5">
              <Label className="font-bold">Do You Have Coupon?</Label>
              <Input
                type="text"
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Promo Code"
                className="mt-2"
              />
              {code && (
                <div className="mt-1 font-semibold text-sm">
                  {promoCode ? (
                    <p className="text-green-700">Applied Successfully</p>
                  ) : (
                    <p className="text-red-700">
                      Promo Code Not Found Or Invalid!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            {

              (userJobOrderCart?.length === 0 || grandTotal > user?.wallet?.balance) ? (
                <Button disabled className="w-full cursor-pointer mt-5">
                  {userJobOrderCart?.length === 0 ? "Cart Is Empty" : "Not Enough Balance"}
                </Button>
              ) : (
                <Button
                  onClick={handleCheckout}
                  className="w-full cursor-pointer mt-5"
                >
                  Proceed To Checkout
                </Button>
              )}
            <Link to={"/dashboard/payment"}><Button variant={"outline"} className="w-full mt-3 cursor-pointer">
              Payment
            </Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOrderCart;
