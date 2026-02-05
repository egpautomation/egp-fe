// @ts-nocheck

import { Input } from "@/components/ui/input";
import useAllTenderIds from "@/hooks/useAllTenderIds";
import { formatDate } from "@/lib/formateDate";
import Pagination from "@/shared/Pagination/Pagination";
import { AlignJustify, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import JsonFileUploader from "./JSONConverter";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

const OTMTenderIds = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    Number(searchParams.get("limit")) || 100
  );

  const { tenders, loading, tendersCount, setReload } = useAllTenderIds(
    searchTerm,
    "OTM",
    currentPage,
    pageLimit
  );
  const skeleton = new Array(pageLimit).fill(Math?.random());

  // const handleDelete = async (id) => {
  //   const url = `https://egp-tender-automation-server.vercel.app/api/v1/tenderIds/delete-tenderId/${id}`;
  //   const toastId = toast.loading("Loading...");
  //   try {
  //     const response = await axios.delete(url, { withCredentials: false });
  //     if (response.status === 200) {
  //       toast.dismiss(toastId);
  //       toast.success("success");
  //       setMessage("Successfully Deleted");
  //     }
  //   } catch (error) {
  //     toast.dismiss(toastId);
  //     toast.error(error.message || "An unexpected error occurred");
  //     console.error("Error:", error);
  //   } finally {
  //     toast.dismiss(toastId);
  //     setReload((prevReload) => prevReload + 1);
  //   }
  // };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", pageLimit);
    setSearchParams(params);
  }, [currentPage, pageLimit]);

  return (
    <div>
      {/* <div className=" my-5 ">
        <div className="flex gap-3 justify-between">
          <JsonFileUploader setReload={setReload} />
        </div>
      </div> */}
      <div
        id="tenderId-delete-message"
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
      <div className="flex items-center gap-2 flex-wrap mt-5 justify-between">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">
            {tendersCount} Tenders Found{" "}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 flex-1 justify-end">
          <Input
            value={searchTerm}
            placeholder="Search by Tender Id or Type"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-[300px]"
          />
          {/* <TenderMethodComboBox setMethod={setMethod} /> */}
        </div>
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                {/* <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  Action
                </th> */}
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  Tender Id
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">Type</th>

                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Method
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  District
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Publication Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  Opening Date
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading ? (
                tenders?.length > 0 ? (
                  tenders?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                    >
                      {/* <td className="px-4 py-2">
                        <Button
                          onClick={() => handleDelete(item?._id)}
                          className="cursor-pointer"
                        >
                          Delete
                        </Button>
                      </td> */}
                      <td className="px-4 py-2">{item?.tenderId}</td>
                      <td className="px-4 py-2">{item?.ProcurementType}</td>
                      <td className="px-4 py-2">{item?.procurementMethod}</td>
                      <td className="px-4 py-2">{item?.locationDistrict || "NOT AVAILABLE"}</td>
                      <td className="px-4 py-2">
                        {formatDate(item?.publicationDateTime, "MM-dd-yyyy")}
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(item?.openingDateTime, "MM-dd-yyyy")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-1">
                      No Data Found
                    </td>
                  </tr>
                )
              ) : (
                skeleton.map((item, idx) => (
                  <tr key={idx}>
                    <td
                      colSpan={6}
                      className={`h-20 ${idx % 2 == 1 ? "bg-gray-300" : "bg-white"
                        }`}
                    ></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      }
      {tenders?.length > 0 && (
        <Pagination
          data={{
            pageLimit,
            setCurrentPage,
            setPageLimit,
            count: tendersCount,
            currentPage,
          }}
        />
      )}
    </div>
  );
};

export default OTMTenderIds;
