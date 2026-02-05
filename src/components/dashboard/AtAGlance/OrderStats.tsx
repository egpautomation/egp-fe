// @ts-nocheck

import useMyJobOrdersCounts from "@/hooks/useMyJobOrderCount";
import { AuthContext } from "@/provider/AuthProvider";
import { ChevronUp } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

const OrderStats = () => {
  const {user} = useContext(AuthContext)
  const {data} = useMyJobOrdersCounts(user?.email)
  return (
    <div className="my-10 md:my-16 shadow-xl ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* New Order */}
        <div className="p-3 md:p-5 py-6 md:py-10 border-b">
          <h3 className="md:text-xl font-semibold text-gray-600">New Order</h3>
          <h1 className=" text-2xl md:text-3xl font-semibold text-gray-600 my-2">{data?.newOrders}</h1>
          <div>
            <p className="font-semibold text-sm md:text-base text-gray-500">
              {" "}
              Go To{" "}
              <Link className="text-blue-700 text-sm md:text-base">
                <ChevronUp className="inline-block" />
                View More
              </Link>
            </p>
          </div>
        </div>

        {/* Order Fulfilled */}
        <div className="p-3 md:p-5 py-6 md:py-10 border-b md:border-l lg:border-r">
          <h3 className="md:text-xl font-semibold text-gray-600"> Order Fulfilled</h3>
          <h1 className=" text-2xl md:text-3xl font-semibold text-gray-600 my-2">{data?.fulfilled}</h1>
          <div>
            <p className="font-semibold text-sm md:text-base text-gray-500">
              {" "}
              Go To{" "}
              <Link className="text-blue-700 text-sm md:text-base">
                <ChevronUp className="inline-block" />
                View More
              </Link>
            </p>
          </div>
        </div>
        
        {/* Working */}
        <div className="p-3 md:p-5 py-6 md:py-10 border-b md:border-r lg:border-r-0">
          <h3 className="md:text-xl font-semibold text-gray-600">Working</h3>
          <h1 className=" text-2xl md:text-3xl font-semibold text-gray-600 my-2">{data?.working}</h1>
          <div>
            <p className="font-semibold text-sm md:text-base text-gray-500">
              {" "}
              Go To{" "}
              <Link className="text-blue-700 text-sm md:text-base">
                <ChevronUp className="inline-block" />
                View More
              </Link>
            </p>
          </div>
        </div>
        
        {/* Waiting */}
        <div className="p-3 md:p-5 py-6 md:py-10 border-b">
          <h3 className="md:text-xl font-semibold text-gray-600">Waiting</h3>
          <h1 className=" text-2xl md:text-3xl font-semibold text-gray-600 my-2">{data?.waiting}</h1>
          <div>
            <p className="font-semibold text-sm md:text-base text-gray-500">
              {" "}
              Go To{" "}
              <Link className="text-blue-700 text-sm md:text-base">
                <ChevronUp className="inline-block" />
                View More
              </Link>
            </p>
          </div>
        </div>

        {/* Order Canceled */}
        <div className="p-3 md:p-5 py-6 md:py-10 border-b  md:border-l md:border-r">
          <h3 className="md:text-xl font-semibold text-gray-600"> Order Canceled</h3>
          <h1 className=" text-2xl md:text-3xl font-semibold text-gray-600 my-2">{data?.canceled}</h1>
          <div>
            <p className="font-semibold text-sm md:text-base text-gray-500">
              {" "}
              Go To{" "}
              <Link className="text-blue-700 text-sm md:text-base">
                <ChevronUp className="inline-block" />
                View More
              </Link>
            </p>
          </div>
        </div>
        
        {/* Total */}
        <div className="p-3 md:p-5 py-6 md:py-10 border-b">
          <h3 className="md:text-xl font-semibold text-gray-600">Total Order</h3>
          <h1 className=" text-2xl md:text-3xl font-semibold text-gray-600 my-2">{data?.total}</h1>
          <div>
            <p className="font-semibold text-sm md:text-base text-gray-500">
              {" "}
              Go To{" "}
              <Link className="text-blue-700 text-sm md:text-base">
                <ChevronUp className="inline-block" />
                View More
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderStats;
