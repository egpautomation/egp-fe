// @ts-nocheck
import { useState } from "react";
import ByPassReportRow from "./ByPassReportRow";

const LTMBypassReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  // Mock data for initial UI demonstration
  const mockData = [
    {
      _id: "mock1",
      orderId: 1001,
      jobId: 10011,
      tenderId: "789456",
      egpMail: "company1@example.com",
      companyName: "Mock LTM Company A",
      password: "pass123",
      bankName: "Example Bank Ltd",
      liquidAssetsTenderAmount: "1,500,000",
      activityDate1: "2024-04-01",
      activityDate2: "2024-04-30",
      companyAddress: "123 Mock Street, Dhaka",
      autho: "John Doe",
      nid: "1234567890",
      trade: "TR-999",
      tin: "TIN-888",
      vat: "VAT-777",
      licenseSL: "LTM-001",
      other1: "Yes",
      SLOfCredit: "LC-100",
      other2Map: "No",
      whatsApp: "01700000000",
      tinReturnCertificate: "Yes",
      vatReturnCertificate: "Yes",
      manpower: "10",
      equipment: "5",
      updateAuditReportFileName: "audit_2023.pdf",
    },
    {
      _id: "mock2",
      orderId: 1002,
      jobId: 10021,
      tenderId: "654321",
      egpMail: "company2@example.com",
      companyName: "Mock LTM Company B",
      password: "pass456",
      bankName: "Global Trust Bank",
      liquidAssetsTenderAmount: "2,000,000",
      activityDate1: "2024-05-15",
      activityDate2: "2024-06-15",
      companyAddress: "456 Fake Road, Chittagong",
      autho: "Jane Smith",
      nid: "0987654321",
      trade: "TR-111",
      tin: "TIN-222",
      vat: "VAT-333",
      licenseSL: "LTM-002",
      other1: "No",
      SLOfCredit: "LC-200",
      other2Map: "Yes",
      whatsApp: "01800000000",
      tinReturnCertificate: "Yes",
      vatReturnCertificate: "No",
      manpower: "15",
      equipment: "8",
      updateAuditReportFileName: "audit_2023_v2.pdf",
    },
  ];

  const loading = false;
  const error = null;
  const count = mockData.length;

  const skeleton = new Array(pageLimit).fill(Math?.random());

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-primary">LTM By Pass Report (Mock)</h2>

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
                <th className="whitespace-nowrap px-4 py-3">SL</th>
                <th className="whitespace-nowrap px-4 py-3">InvoiceNo</th>
                <th className="whitespace-nowrap px-4 py-3">JobNo</th>
                <th className="whitespace-nowrap px-4 py-3">ReLogin</th>
                <th className="whitespace-nowrap px-4 py-3">TenderId</th>
                <th className="whitespace-nowrap px-4 py-3">EGP-Email</th>
                <th className="whitespace-nowrap px-4 py-3">CompanyName</th>
                <th className="whitespace-nowrap px-4 py-3">Password</th>
                <th className="whitespace-nowrap px-4 py-3">BankName</th>
                <th className="whitespace-nowrap px-4 py-3">LiquidAsset</th>
                <th className="whitespace-nowrap px-4 py-3">ActiveDate1</th>
                <th className="whitespace-nowrap px-4 py-3">ActiveDate2</th>
                <th className="whitespace-nowrap px-4 py-3">CompanyAddress</th>
                <th className="whitespace-nowrap px-4 py-3">Author</th>
                <th className="whitespace-nowrap px-4 py-3">NID</th>
                <th className="whitespace-nowrap px-4 py-3">Trade</th>
                <th className="whitespace-nowrap px-4 py-3">Tin</th>
                <th className="whitespace-nowrap px-4 py-3">Vat</th>
                <th className="whitespace-nowrap px-4 py-3">Ltm_License</th>
                <th className="whitespace-nowrap px-4 py-3">Other_1_Map</th>
                <th className="whitespace-nowrap px-4 py-3">SLNoLineOfCredit</th>
                <th className="whitespace-nowrap px-4 py-3">Other_2_Map</th>
                <th className="whitespace-nowrap px-4 py-3">Whats_app</th>
                <th className="whitespace-nowrap px-4 py-3">TinReturn</th>
                <th className="whitespace-nowrap px-4 py-3">VatReturn</th>
                <th className="whitespace-nowrap px-4 py-3">Manpower</th>
                <th className="whitespace-nowrap px-4 py-3">Equipment</th>
                <th className="whitespace-nowrap px-4 py-3">AuditReport</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                skeleton.map((item, idx) => (
                  <tr key={idx} className="animate-pulse border-b">
                    <td
                      colSpan={28}
                      className={`h-12 ${idx % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    ></td>
                  </tr>
                ))
              ) : mockData && mockData.length > 0 ? (
                mockData.map((item, idx) => (
                  <ByPassReportRow key={item._id || idx} item={item} idx={idx} data={mockData} />
                ))
              ) : (
                <tr>
                  <td colSpan={28} className="px-4 py-12 text-center text-gray-500 bg-gray-50">
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
