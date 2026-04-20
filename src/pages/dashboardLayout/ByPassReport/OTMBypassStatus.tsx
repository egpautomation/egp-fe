// @ts-nocheck
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RefreshCw } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { patchData } from "@/lib/updateData"
import { toast } from "react-hot-toast"

const STATUS_OPTIONS = ["pending", "waiting", "processing", "fulfilled", "canceled"]

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  waiting: "bg-blue-100 text-blue-800 border-blue-300",
  processing: "bg-purple-100 text-purple-800 border-purple-300",
  fulfilled: "bg-green-100 text-green-800 border-green-300",
  canceled: "bg-red-100 text-red-800 border-red-300",
}

const OTMBypassStatus = () => {
  const [allReports, setAllReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get("/otm-bypass-report")
        const data = response.data?.data || response.data || []
        setAllReports(Array.isArray(data) ? data : [])
      } catch {
        toast.error("Failed to fetch reports")
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [reload])

  const filteredReports = useMemo(() => {
    let result = allReports

    if (filterStatus) {
      result = result.filter((r) => r.status === filterStatus)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      result = result.filter(
        (r) =>
          (r.tender_id || "").toLowerCase().includes(term) ||
          (r.invoice_no || "").toLowerCase().includes(term) ||
          (r.company_name || "").toLowerCase().includes(term) ||
          (r.egp_email || "").toLowerCase().includes(term) ||
          (r.job_no || "").toLowerCase().includes(term),
      )
    }

    return result
  }, [allReports, searchTerm, filterStatus])

  const handleStatusUpdate = async (reportId, newStatus) => {
    if (!reportId) {
      toast.error("Report ID not found")
      return
    }
    setUpdatingId(reportId)
    await patchData(
      "/otm-bypass-report/update-status",
      { reportId, status: newStatus },
      () => setReload((prev) => prev + 1),
      null,
    )
    setUpdatingId(null)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">OTM Bypass Status</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReload((prev) => prev + 1)}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700">Search</Label>
              <input
                type="text"
                placeholder="Search by Tender ID, Invoice No, Company, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4874c7] focus:outline-none focus:ring-1 focus:ring-[#4874c7]"
              />
            </div>
            <div className="sm:w-48">
              <Label className="text-sm font-medium text-gray-700">Filter by Status</Label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4874c7] focus:outline-none focus:ring-1 focus:ring-[#4874c7]"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a1a1a] text-white text-left uppercase text-xs font-bold tracking-wider">
              <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">SL</th>
              <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Invoice_No</th>
              <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Tender_Id</th>
              <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Company_Name</th>
              <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">EGP_Email</th>
              {/* Job_No column hidden */}
              <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Status</th>
              <th className="whitespace-nowrap px-4 py-3 border-r border-gray-700">Update_Status</th>
              <th className="whitespace-nowrap px-4 py-3">Created_At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td colSpan={9} className="h-12 bg-gray-50/50"></td>
                </tr>
              ))
            ) : filteredReports.length > 0 ? (
              filteredReports.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border-r border-gray-100 font-medium text-gray-700">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-100 text-gray-600">
                    {item?.invoice_no || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-100 text-gray-600">
                    {item?.tender_id || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-100 text-gray-600">
                    {item?.company_name || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-100 text-gray-600">
                    {item?.egp_email || "N/A"}
                  </td>
                  {/* Job_No column hidden */}
                  <td className="px-4 py-3 border-r border-gray-100">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
                        STATUS_COLORS[item?.status] || STATUS_COLORS.pending
                      }`}
                    >
                      {item?.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-100">
                    <select
                      value={item?.status || "pending"}
                      disabled={updatingId === item?._id}
                      onChange={(e) => handleStatusUpdate(item?._id, e.target.value)}
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-[#4874c7] focus:outline-none focus:ring-1 focus:ring-[#4874c7] disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {item?.createdAt
                      ? new Date(
                          typeof item.createdAt === "object" && item.createdAt.$date
                            ? item.createdAt.$date
                            : item.createdAt,
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                  <p className="text-lg font-medium">No reports found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {!loading && allReports.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {STATUS_OPTIONS.map((status) => {
            const count = allReports.filter((r) => r.status === status).length
            return (
              <div
                key={status}
                className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                  STATUS_COLORS[status]
                }`}
              >
                {status}: {count}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OTMBypassStatus
