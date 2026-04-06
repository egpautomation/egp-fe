// @ts-nocheck
import { Checkbox } from "@/components/ui/checkbox";
import useRecentOtmBypassReports from "@/hooks/useRecentOtmBypassReports";
import { formatDate } from "@/lib/formateDate";
import { AuthContext } from "@/provider/AuthProvider";
import { ExternalLink, Plus } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RecentOtmBypassOrder = () => {
  const { user } = useContext(AuthContext);
  const { reports, loading } = useRecentOtmBypassReports(user?.email, 5);

  return (
    <div className="shadow-xl overflow-x-scroll bg-white mt-10 md:mt-16">
      <div className="p-3 md:py-3 md:px-5 flex justify-between gap-5 max-md:flex-col items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-600 text-nowrap">
            Recent OTM Order
          </h1>
        </div>
        <div className="flex max-md:flex-col items-center gap-3">
          <Link to="/dashboard/otm-bypass-report/create" className="max-md:w-full">
            <button className="border w-full rounded px-5 py-1.5 cursor-pointer shadow-md text-gray-600 font-semibold whitespace-nowrap">
              <Plus size={16} className="inline-block" /> Order OTM
            </button>
          </Link>
          <Link to="/dashboard/otm-bypass-report" className="max-md:w-full">
            <button className="border w-full rounded px-5 py-1.5 shadow-md text-gray-600 font-semibold whitespace-nowrap cursor-pointer">
              <ExternalLink size={16} className="inline-block" /> View All OTM
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full mt-3 overflow-x-auto">
          <thead className="p-3 md:py-3 md:px-5 bg-blue-100">
            <tr>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                <Checkbox className="text-white bg-white" />
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                Company Name
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                Tender Id
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                Egp Email
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                Status
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : reports?.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="text-nowrap p-3 md:py-4 md:px-5 text-start text-gray-600">
                    <Checkbox className="text-white bg-white" />
                  </td>
                  <td className="text-nowrap p-3 md:py-3 md:px-5 text-start text-blue-600 font-medium">
                    {report.company_name}
                  </td>
                  <td className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                    {report.tender_id}
                  </td>
                  <td className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                    {report.egp_email}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded inline-block w-max py-1 px-3 text-sm font-semibold 
                        ${report.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${report.status === "waiting" ? "bg-orange-100 text-orange-800" : ""}
                        ${report.status === "processing" ? "bg-blue-100 text-blue-800" : ""}
                        ${report.status === "fulfilled" ? "bg-green-100 text-green-800" : ""}
                        ${report.status === "canceled" ? "bg-red-100 text-red-800" : ""}
                      `}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                    {formatDate(report.createdAt, "yyyy-MM-dd")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center font-semibold py-10 text-gray-500">
                  No OTM reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOtmBypassOrder;
