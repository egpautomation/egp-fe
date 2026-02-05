// @ts-nocheck


import LtmLicenseSL from "@/components/dashboard/ByPassReport/LtmLicenseSL";
import useByPassReport from "@/hooks/useByPassReport";
import useSingleData from "@/hooks/useSingleData";
import { AuthContext } from "@/provider/AuthProvider";
import Pagination from "@/shared/Pagination/Pagination";
import { useContext, useState } from "react";
import ByPassReportRow from "./ByPassReportRow";

const ByPassReport = () => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  // Backend automatically extracts user email from JWT token
  // All roles (including admin) can only see their own bypass report
  const { data, count, loading, error } = useByPassReport(currentPage, pageLimit);


  // const getEgpListedCompany = async (email) => {
  //   try {
  //     const url = `https://egpserver.jubairahmad.com/api/v1/egp-listed-company/get-by-mail/${email}`;
  //     const res = await fetch(url);
  //     const json = await res.json();
  //     return json?.data?.bankName || "NILL";
  //   } catch (err) {
  //     console.error("Error fetching EGP listed company:", err);
  //     return "NILL";
  //   }
  // };


  const skeleton = new Array(pageLimit).fill(Math?.random());

  return (
    <div>
      {/* Error State */}
      {error && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 font-semibold">Error loading bypass report</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {!authLoading && !error && (
        <div className="overflow-x-auto">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  SL
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  InvoiceNo
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  JobNo
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  ReLogin
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  TenderId
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  EGP-Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  CompanyName
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Password
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  BankName
                </th>
                <th className="whitespace-nowrap px-4 py-2">LiquidAsset</th>
                <th className="whitespace-nowrap px-4 py-2">ActiveDate1</th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  ActiveDate2
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  CompanyAddress
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Author
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  NID
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Trade
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Tin
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Vat
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Ltm_License
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Other_1_Map
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  SLNoLineOfCredit
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Other_2_Map
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Whats_app
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  TinReturn
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  VatReturn
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Manpower
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  Equipment
                </th>
                <th className="whitespace-nowrap px-4 py-2  ">
                  AuditReport
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading State: Show skeleton loaders
                skeleton.map((item, idx) => (
                  <tr key={idx}>
                    <td
                      colSpan={27}
                      className={`h-20 ${idx % 2 == 1 ? "bg-gray-300" : "bg-white"}`}
                    ></td>
                  </tr>
                ))
              ) : data && data.length > 0 ? (
                // Data Available: Render bypass report rows
                data.map((item, idx) => (
                  <ByPassReportRow key={item._id || idx} item={item} idx={idx} data={data} />
                ))
              ) : (
                // Empty State: No data found
                <tr>
                  <td colSpan={22} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-medium mb-2">No bypass report data found</p>
                      <p className="text-sm text-gray-400">
                        {count === 0
                          ? "You haven't completed any job orders yet. Complete job orders to see bypass reports here."
                          : "No data available for the current page."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      )}
      {!authLoading && !error && data && data.length > 0 && (
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

export default ByPassReport;
