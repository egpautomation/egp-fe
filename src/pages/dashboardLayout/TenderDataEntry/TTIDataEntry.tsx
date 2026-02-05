// @ts-nocheck

import { Button } from "@/components/ui/button";
import useFormattedTendersTTI from "@/hooks/useFormattedTendersTTI";
import { createData } from "@/lib/createData";
import { formatDate } from "@/lib/formateDate";
import Pagination from "@/shared/Pagination/Pagination";
import { AlignJustify, SendHorizontal, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const TTITenderDataEntry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [message, setMessage] = useState("");
  const { tenders, loading, setReload, count } = useFormattedTendersTTI(
    currentPage,
    pageLimit
  );

  const resetForm = () => {
    setMessage("Tenders submitted successfully."); // show success message
  };

  const handleSendAllTenders = async () => {
    const updatedTenders = tenders?.map((tender) => ({
      ...tender,
    }));
    const tenderIds = tenders?.map((tender) => ({
      tenderId: tender?.tenderId,
    }));
    console.log(updatedTenders);
    // https://server.tendertradinginc.com
    try {
      const response = await fetch(
        " https://server.tendertradinginc.com/api/v1/tenders/create-multiple-tender",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(updatedTenders),
        }
      );

      const res = await response.json();
      
      if (res.success || res.message == "Error: No New Tenders To Insert") {
        const url =
          "https://egpserver.jubairahmad.com/api/v1/tti-dataEntry/create-tenderId";
        createData(url, tenderIds, setReload, resetForm);
        // toast.success("Successfully Create Tenders");
        return res;
      } else {
        toast.error(res.message || "Failed to Create");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      console.log("");
    }
  };
  const skeleton = new Array(20).fill(Math?.random());
  return (
    <div>
      <div>
        <Button
          className="cursor-pointer"
          onClick={() => handleSendAllTenders()}
        >
          Send All
          <SendHorizontal />
        </Button>
        <div
          id="tender-entry-message"
          className="text-green-600  mt-4 font-medium"
        >
          {message && message}{" "}
          {message && (
            <X
              size={16}
              className="inline-block cursor-pointer"
              onClick={() => setMessage("")}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between my-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">All Tenders</h1>
        </div>
        <h1 className="text-xl font-semibold mb-1">{count} Data Found</h1>
      </div>

      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full table-fixed">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Tender Id
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Sub Categories
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  TDS 01
                </th>

                {/* <th className="whitespace-nowrap px-4 py-2  rounded-tr text-start ">
                  Details
                </th> */}
              </tr>
            </thead>

            <tbody>
              {!loading
                ? tenders?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                    >
                      <td className="px-4 py-2 align-top">{item?.tenderId}</td>

                      <td className="px-4 py-2 align-top">
                        {item?.tender_subCategories}
                      </td>
                      <td className="px-4 py-2 align-top">{item?.tds_01}</td>
                    </tr>
                  ))
                : skeleton.map((item, idx) => (
                    <tr key={idx}>
                      <td
                        colSpan={3}
                        className={`h-20 ${
                          idx % 2 == 1 ? "bg-gray-300" : "bg-white"
                        }`}
                      ></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      }
      {tenders.length > 0 && (
        <Pagination
          data={{
            pageLimit,
            setCurrentPage,
            setPageLimit,
            count,
            currentPage,
          }}
        />
      )}
    </div>
  );
};

export default TTITenderDataEntry;
