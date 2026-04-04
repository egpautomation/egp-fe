import { useState } from "react";
import useSingleData from "@/hooks/useSingleData";
import { config } from "@/lib/config";
import ByPassReportRow from "./ByPassReportRow";

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
              <tr className="bg-primary text-primary-foreground text-left">
                {/* General Info */}
                <th className="whitespace-nowrap px-4 py-3">SL</th>
                <th className="whitespace-nowrap px-4 py-3">Invoice No</th>
                <th className="whitespace-nowrap px-4 py-3">ReLogin</th>
                <th className="whitespace-nowrap px-4 py-3">Tender Id</th>
                <th className="whitespace-nowrap px-4 py-3">EGP Email</th>
                <th className="whitespace-nowrap px-4 py-3">Company Name</th>
                <th className="whitespace-nowrap px-4 py-3">Password</th>
                <th className="whitespace-nowrap px-4 py-3">Bank Name</th>
                <th className="whitespace-nowrap px-4 py-3">Liquid Asset</th>
                <th className="whitespace-nowrap px-4 py-3">Active Date 1</th>
                <th className="whitespace-nowrap px-4 py-3">Active Date 2</th>
                <th className="whitespace-nowrap px-4 py-3">Company Address</th>
                <th className="whitespace-nowrap px-4 py-3">Author</th>

                {/* Documents & Mappings */}
                <th className="whitespace-nowrap px-4 py-3">NID</th>
                <th className="whitespace-nowrap px-4 py-3">Trade License</th>
                <th className="whitespace-nowrap px-4 py-3">TIN</th>
                <th className="whitespace-nowrap px-4 py-3">VAT</th>
                <th className="whitespace-nowrap px-4 py-3">LTM License</th>
                <th className="whitespace-nowrap px-4 py-3">TIN Return</th>
                <th className="whitespace-nowrap px-4 py-3">VAT Return</th>
                <th className="whitespace-nowrap px-4 py-3">Manpower</th>
                <th className="whitespace-nowrap px-4 py-3">Equipment</th>
                <th className="whitespace-nowrap px-4 py-3">Audit Report</th>

                {/* Additional Technical */}
                <th className="whitespace-nowrap px-4 py-3">Structural Steel Works</th>
                <th className="whitespace-nowrap px-4 py-3">Pavement Asphalt Works</th>

                {/* Specific Experience */}
                <th className="whitespace-nowrap px-4 py-3">General Exp Year</th>
                <th className="whitespace-nowrap px-4 py-3">Specific Contract No</th>
                <th className="whitespace-nowrap px-4 py-3">Specific Contract Name</th>
                <th className="whitespace-nowrap px-4 py-3">Specific Contract Role</th>
                <th className="whitespace-nowrap px-4 py-3">Specific Award Date</th>
                <th className="whitespace-nowrap px-4 py-3">Specific Completion Date</th>
                <th className="whitespace-nowrap px-4 py-3">Specific Contract Value</th>
                <th className="whitespace-nowrap px-4 py-3">Specific Entity Details</th>
                <th className="whitespace-nowrap px-4 py-3">Specific Description</th>

                {/* Financial Turnover */}
                <th className="whitespace-nowrap px-4 py-3">Year 1 Period</th>
                <th className="whitespace-nowrap px-4 py-3">Year 1 Curr</th>
                <th className="whitespace-nowrap px-4 py-3">Year 1 BDT</th>
                <th className="whitespace-nowrap px-4 py-3">Year 2 Period</th>
                <th className="whitespace-nowrap px-4 py-3">Year 2 Curr</th>
                <th className="whitespace-nowrap px-4 py-3">Year 2 BDT</th>
                <th className="whitespace-nowrap px-4 py-3">Year 3 Period</th>
                <th className="whitespace-nowrap px-4 py-3">Year 3 Curr</th>
                <th className="whitespace-nowrap px-4 py-3">Year 3 BDT</th>
                <th className="whitespace-nowrap px-4 py-3">Year 4 Period</th>
                <th className="whitespace-nowrap px-4 py-3">Year 4 Curr</th>
                <th className="whitespace-nowrap px-4 py-3">Year 4 BDT</th>
                <th className="whitespace-nowrap px-4 py-3">Year 5 Period</th>
                <th className="whitespace-nowrap px-4 py-3">Year 5 Curr</th>
                <th className="whitespace-nowrap px-4 py-3">Year 5 BDT</th>

                {/* LOC and Extra Info */}
                <th className="whitespace-nowrap px-4 py-3">LOC No</th>
                <th className="whitespace-nowrap px-4 py-3">LOC Source</th>
                <th className="whitespace-nowrap px-4 py-3">LOC Amount</th>
                <th className="whitespace-nowrap px-4 py-3">Contact Details</th>
                <th className="whitespace-nowrap px-4 py-3">Qual & Exp</th>
                <th className="whitespace-nowrap px-4 py-3">Tender Cap Period</th>
                <th className="whitespace-nowrap px-4 py-3">Tender Cap Max</th>
                <th className="whitespace-nowrap px-4 py-3">Tender Cap Rem</th>
                <th className="whitespace-nowrap px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                skeleton.map((_, idx) => (
                  <tr key={idx} className="animate-pulse border-b">
                    <td
                      colSpan={58}
                      className={`h-12 ${idx % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    ></td>
                  </tr>
                ))
              ) : reportData && reportData.length > 0 ? (
                reportData.map((item: any, idx: number) => (
                  <ByPassReportRow key={item._id || idx} item={item} idx={idx} data={reportData} />
                ))
              ) : (
                <tr>
                  <td colSpan={58} className="px-4 py-12 text-center text-gray-500 bg-gray-50">
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
