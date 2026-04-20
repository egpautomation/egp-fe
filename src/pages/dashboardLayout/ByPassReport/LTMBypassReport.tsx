import { useState } from "react";
import useSingleData from "@/hooks/useSingleData";
import { config } from "@/lib/config";
import LTMBypassReportRow from "./LTMBypassReportRow";

const LTMBypassReport = () => {
  const [pageLimit] = useState(20);

  // Fetch real bypass report data from API
  const { data: bypassReports, loading } = useSingleData(`${config.apiBaseUrl}/otm-bypass-report`);

  const reportData = (Array.isArray(bypassReports)
    ? bypassReports
    : (bypassReports as any)?.data || []
  ).filter((item: any) => item?.status !== "fulfilled");

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
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Invoice_No</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Tender_Id</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">EGP_Email</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Company_Name</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Password</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Bank_Name</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Liquid_Asset</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Active_Date_1</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Active_Date_2</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Company_Address</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Author</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">NID</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Trade_License</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">TIN</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">VAT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">LTM_License</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">TIN_Return</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">VAT_Return</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Manpower</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Equipment</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Audit_Report</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Structural_Steel</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Pavement_Asphalt</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Gen_Exp_Year</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec_Contract_No</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec_Contract_Name</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec_Contract_Role</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Award_Date</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Completion_Date</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec_Contract_Value</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Entity_Details</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Spec_Description</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_1_Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_1_Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_1_BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_2_Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_2_Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_2_BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_3_Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_3_Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_3_BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_4_Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_4_Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_4_BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_5_Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_5_Curr</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Year_5_BDT</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">LOC_No</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">LOC_Source</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">LOC_Amount</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Contact_Details</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Qual_&_Exp</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Cap_Period</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Cap_Max</th>
                <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Cap_Rem</th>
                <th className="whitespace-nowrap px-4 py-3">Created_At</th>
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

