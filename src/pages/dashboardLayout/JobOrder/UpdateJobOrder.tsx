// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAllJobOrders from "@/hooks/useAllJobOrders";
import { AlignJustify, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const UpdateJobOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, setReload } = useAllJobOrders(searchTerm);
 
  return (
    <div>
      <div className="flex justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">Job Orders List</h1>
        </div>
        <div className="flex items-center justify-center gap-2"></div>
      </div>
      {
        <div className="overflow-x-auto ">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  Tender Id
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  OrderId
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  JobId
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 ">Update Status</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                data?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                  >
                    <td className="px-4 py-2">{item?.tenderId}</td>
                    <td className="px-4 py-2">{item?.orderId}</td>
                    <td className="px-4 py-2">{item?.jobId}</td>
                    <td className={`px-4 py-2 `}>
                      <p className="min-w-24 text-center max-w-max">
                        {" "}
                        <span
                          className={`border-none shadow-none rounded inline-block py-0.5 px-1.5 bg-orange-300 w-full font-semibold text-orange-900 ${
                            item?.status === "fulfilled" &&
                            "bg-green-300 text-green-900"
                          } ${
                            item?.status === "canceled" &&
                            "bg-red-400 text-red-900"
                          }`}
                        >
                          {item?.status}
                        </span>
                      </p>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Link
                        to={`/dashboard/job-order/update/${item?._id}`}
                        className="underline font-medium"
                      >
                        {" "}
                        <p>Update Status</p>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default UpdateJobOrder;
