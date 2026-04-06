import { useState } from "react";
import useSingleData from "@/hooks/useSingleData";
import { config } from "@/lib/config";
import LTMBypassReportRow from "./LTMBypassReportRow";

const LTMBypassReport = () => {
  const [pageLimit] = useState(20);

  // Fetch real bypass report data from API
  const { data: bypassReports, loading } = useSingleData(`${config.apiBaseUrl}/otm-bypass-report`);

  const reportData = Array.isArray(bypassReports)
    ? bypassReports
    : (bypassReports as any)?.data || [];

  const error = null;

  const skeleton = new Array(pageLimit).fill(Math?.random());

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-primary">OTM By Pass Report</h2>

      {/* Error State */}
      {error && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 font-semibold">Error loading bypass report</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {!error && (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a1a] text-white text-left uppercase text-xs font-bold tracking-wider">
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">SL</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Invoice No</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Job No</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Tender Id</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">EGP Email</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Company Name</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Password</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Bank Name</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Liquid Asset</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Active Date 1</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Active Date 2</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Company Address</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Author</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">NID</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Trade License</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">TIN</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">VAT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">LTM License</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">TIN Return</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">VAT Return</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Manpower</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Equipment</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Audit Report</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Structural Steel</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Pavement Asphalt</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Gen Exp Year</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec Contract No</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec Contract Name</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec Contract Role</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Award Date</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Completion Date</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec Contract Value</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Entity Details</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec Description</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 1 Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 1 Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 1 BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 2 Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 2 Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 2 BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 3 Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 3 Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 3 BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 4 Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 4 Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 4 BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 5 Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 5 Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year 5 BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">LOC No</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">LOC Source</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">LOC Amount</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Contact Details</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Qual & Exp</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Cap Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Cap Max</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Cap Rem</th>
                <th className="whitespace-nowrap px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                skeleton.map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={58} className="h-12 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : reportData && reportData.length > 0 ? (
                reportData.map((item: any, idx: number) => (
                  <LTMBypassReportRow key={item._id || idx} item={item} idx={idx} />
                ))
              ) : (
                <tr>
                  <td colSpan={58} className="px-4 py-12 text-center text-gray-500">
                    <p className="text-lg font-medium">No bypass report data found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LTMBypassReport;

