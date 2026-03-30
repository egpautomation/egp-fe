// @ts-nocheck

import { AuthContext } from "@/provider/AuthProvider";
import { MoveRight } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Payment = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="">
      <div className="p-3  bg-yellow-200 mt-3 rounded-md border border-yellow-300 sticky top-0 z-30 ">
        <p className="  font-medium">
          রেফানেন্স হিসেবে অবশ্যই আপনার রেজিষ্ট্রেশন মোবাইলের শেষ ৫ ডিজিট {user?.userId} (Last 5
          Digit of Active Phone No) প্রদান করিবেন।
        </p>
      </div>

      <div className="">
        <div className="flex flex-col items-center  gap-10  my-10">
          <div className="p-3 md:p-5 md:py-8 rounded-md bg-pink-600 max-w-xl text-white flex flex-col w-full gap-3 justify-center ">
            <img
              src="/bkashLogo.png"
              alt="bkash logo"
              className="max-h-28 max-w-28 rounded-full mx-auto"
            />
            <Link
              className=" border-b w-max mx-auto"
              to="https://shop.bkash.com/woodart-furniture--decoration0/paymentlink"
            >
              {" "}
              <p className="text-xl lg:text-3xl font-medium text-center flex items-center justify-center gap-2">
                Click Here To Pay BKash <MoveRight className="mt-2" />
              </p>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl lg:text-3xl text-gray-600 font-semibold ">OR</h1>
          </div>

          <div>
            <img src="/bKashScanner.png" alt="" className="" />
          </div>
        </div>

        {/* payment process */}
        <div>
          <div className="p-3 md:p-5">
            <div className="px-3 py-2 bg-pink-600 text-white font-semibold text-2xl rounded-t-md my-5">
              Applicant's Payment Process
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-10 flex-wrap ">
            {/* step -1 */}
            <div className="p-3 md:p-5">
              <div className="p-3 md:p-5 rounded-md flex items-center justify-center border-2 border-pink-600 relative h-60">
                <div className="">
                  <h1 className="text-2xl md:text-4xl font-semibold">*247*</h1>
                </div>
                <div className="rounded-md border-2 border-pink-600 px-2.5 bg-white font-semibold text-gray-600 py-0.5 w-max absolute -top-3 -right-3">
                  1
                </div>
              </div>
              <p className="mt-2  text-gray-600 font-medium">
                Dial *247* on your BKash Activated Mobile Number
              </p>
            </div>

            {/* step -2 */}
            <div className="p-3 md:p-5">
              <div className="p-3 md:p-5 rounded-md border-2 border-pink-600 relative h-60">
                <div className="flex h-full justify-center flex-col gap-2 font-medium">
                  <p>1. Send Money</p>
                  <p>2. Buy Airtime</p>
                  <p className="text-2xl font-semibold text-pink-600">3. Payment</p>
                  <p>4. Cash Out</p>
                  <p className="flex-1">5. My BKash</p>
                  <p className="text-center border-2 border-pink-600 rounded-md">3</p>
                </div>
                <div className="rounded-md border-2 border-pink-600 px-2.5 bg-white font-semibold text-gray-600 py-0.5 w-max absolute -top-3 -right-3">
                  2
                </div>
              </div>
              <p className="mt-2  text-gray-600 font-medium text-center">
                Pres "3" to select Payment
              </p>
            </div>

            {/* step 3 */}
            <div className="p-3 md:p-5">
              <div className="p-3 md:p-5 rounded-md border-2 border-pink-600 relative h-60">
                <div className="flex h-full flex-col flex-auto  gap-2 font-medium">
                  <p className="text-xl font-semibold text-pink-600 flex-1 ">
                    Enter BKash Merchant Number
                  </p>
                  <p className="text-center border-2 border-pink-600 rounded-md">01400959331</p>
                </div>
                <div className="rounded-md border-2 border-pink-600 px-2.5 bg-white font-semibold text-gray-600 py-0.5 w-max absolute -top-3 -right-3">
                  3
                </div>
              </div>
              <p className="mt-2  text-gray-600 font-medium text-center">Enter '01400959331'</p>
            </div>

            {/* step 4 */}
            <div className="p-3 md:p-5">
              <div className="p-3 md:p-5 rounded-md border-2 border-pink-600 relative h-60">
                <div className="flex  flex-col flex-auto h-full gap-2 font-medium">
                  <p className="text-xl font-semibold  flex-1 ">Enter Amount</p>

                  <p className="text-center border-2 border-pink-600 rounded-md">100</p>
                </div>
                <div className="rounded-md border-2 border-pink-600 px-2.5 bg-white font-semibold text-gray-600 py-0.5 w-max absolute -top-3 -right-3">
                  4
                </div>
              </div>
              <p className="mt-2  text-gray-600 font-medium text-center">Enter Amount</p>
            </div>

            {/* step 5 */}
            <div className="p-3 md:p-5">
              <div className="p-3 md:p-5 rounded-md border-2 border-pink-600 relative h-60">
                <div className="flex  flex-col flex-auto h-full gap-2 font-medium">
                  <p className="text-xl font-semibold  flex-1 ">Enter Reference</p>

                  <p className="text-center border-2 border-pink-600 rounded-md">{user?.userId}</p>
                </div>
                <div className="rounded-md border-2 border-pink-600 px-2.5 bg-white font-semibold text-gray-600 py-0.5 w-max absolute -top-3 -right-3">
                  5
                </div>
              </div>
              <p className="mt-2  text-gray-600 font-medium text-center">
                Please Enter Your userId ({user?.userId})
              </p>
            </div>

            {/* step 6 */}
            <div className="p-3 md:p-5">
              <div className="p-3 md:p-5 rounded-md border-2 border-pink-600 relative h-60">
                <div className="flex h-full justify-center flex-col gap-2 font-medium">
                  <p>Payment:</p>
                  <p>01400959331</p>
                  <p>Amount: TK 100</p>
                  <p className="">Reference: Niaz</p>
                  <p className="flex-1">Enter Pin To Confirm</p>
                  <p className="text-center border-2 border-pink-600 rounded-md">xxxxx</p>
                </div>
                <div className="rounded-md border-2 border-pink-600 px-2.5 bg-white font-semibold text-gray-600 py-0.5 w-max absolute -top-3 -right-3">
                  6
                </div>
              </div>
              <p className="mt-2  text-gray-600 font-medium text-center">
                Enter Your BKash Menu To Confirm Payment
              </p>
            </div>

            {/* step 7 */}
            <div className="p-3 md:p-5">
              <div className="p-3 md:p-5 rounded-md border-2 border-pink-600 relative h-60">
                <div className="flex h-full justify-center flex-col  font-medium">
                  <p>Payment Tk 100 To 01400959331</p>
                  <p>Successful.</p>
                  <p>Amount: TK 100</p>
                  <p className="">Reference: Niaz</p>
                  <p className="">Fee Tk 0.00</p>
                  <p className="">Balance Tk xxxx.xx</p>
                  <p className="font-bold">TrxId xxxxxx</p>
                  <p className="">At 25/5/2014 11:35</p>
                </div>
                <div className="rounded-md border-2 border-pink-600 px-2.5 bg-white font-semibold text-gray-600 py-0.5 w-max absolute -top-3 -right-3">
                  7
                </div>
              </div>
              <p className="mt-2  text-gray-600 font-medium text-center">
                Customer will receive a confirmation sms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
