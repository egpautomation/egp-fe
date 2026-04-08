// @ts-nocheck

import useByPassReport from "@/hooks/useByPassReport";
import { AuthContext } from "@/provider/AuthProvider";
import Pagination from "@/shared/Pagination/Pagination";
import { useContext, useState } from "react";
import ByPassReportRow from "./ByPassReportRow";

const ByPassReport = () => {
  const { loading: authLoading } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  const { data, count, loading, error } = useByPassReport(currentPage, pageLimit);

  const skeleton = new Array(pageLimit).fill(0).map((_, i) => i);

  return (
    <div className="mx-auto py-5 px-2">
      {!authLoading && !error && (
        <div className="overflow-x-auto overflow-y-hidden border-t">
          <table className="w-full text-[13px] text-left border-collapse min-w-max">
            <thead className="bg-[#1a1a1a] text-white">
              <tr className="uppercase font-bold">
                <th className="px-4 py-3 whitespace-nowrap">SL</th>
                <th className="px-4 py-3 whitespace-nowrap">InvoiceNo</th>
                <th className="px-4 py-3 whitespace-nowrap">JobNo</th>
                <th className="px-4 py-3 whitespace-nowrap">ReLogin</th>
                <th className="px-4 py-3 whitespace-nowrap">TenderId</th>
                <th className="px-4 py-3 whitespace-nowrap">EGP-Email</th>
                <th className="px-4 py-3 whitespace-nowrap">CompanyName</th>
                <th className="px-4 py-3 whitespace-nowrap">Password</th>
                <th className="px-4 py-3 whitespace-nowrap">BankName</th>
                <th className="px-4 py-3 whitespace-nowrap">LiquidAsset</th>
                <th className="px-4 py-3 whitespace-nowrap">ActiveDate1</th>
                <th className="px-4 py-3 whitespace-nowrap">ActiveDate2</th>
                <th className="px-4 py-3 whitespace-nowrap">CompanyAddress</th>
                <th className="px-4 py-3 whitespace-nowrap">Author</th>
                <th className="px-4 py-3 whitespace-nowrap">NID</th>
                <th className="px-4 py-3 whitespace-nowrap">Trade</th>
                <th className="px-4 py-3 whitespace-nowrap">Tin</th>
                <th className="px-4 py-3 whitespace-nowrap">Vat</th>
                <th className="px-4 py-3 whitespace-nowrap">Ltm_License</th>
                <th className="px-4 py-3 whitespace-nowrap">Other_1_Map</th>
                <th className="px-4 py-3 whitespace-nowrap">SLNoLineOfCredit</th>
                <th className="px-4 py-3 whitespace-nowrap">Other_2_Map</th>
                <th className="px-4 py-3 whitespace-nowrap">Whats_app</th>
                <th className="px-4 py-3 whitespace-nowrap">TinReturn</th>
                <th className="px-4 py-3 whitespace-nowrap">VatReturn</th>
                <th className="px-4 py-3 whitespace-nowrap">Manpower</th>
                <th className="px-4 py-3 whitespace-nowrap">Equipment</th>
                <th className="px-4 py-3 whitespace-nowrap">AuditReport</th>
              </tr>
            </thead>
            <tbody className="bg-[#fbfcff]">
              {loading ? (
                skeleton.map((idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 29 }).map((_, i) => (
                      <td key={i} className="px-4 py-4">
                        <div className="h-4 bg-muted rounded w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data && data.length > 0 ? (
                data.map((item, idx) => (
                  <ByPassReportRow key={item._id || idx} item={item} idx={idx} />
                ))
              ) : (
                <tr>
                  <td colSpan={29} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">No professional bypass reports found</p>
                      <p className="text-sm max-w-xs mx-auto mt-1">
                        Completed and non-canceled jobs will appear here once processed.
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
        <div className="mt-6 border-t border-border pt-4">
          <Pagination
            data={{
              pageLimit,
              setCurrentPage,
              setPageLimit,
              count,
              currentPage,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ByPassReport;

