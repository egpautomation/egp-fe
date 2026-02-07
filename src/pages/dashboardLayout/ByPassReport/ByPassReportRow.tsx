// @ts-nocheck

import { config } from "@/lib/config";
import useSingleData from "@/hooks/useSingleData";

export default function ByPassReportRow({ item, idx, data }) {
  const { data: egpListendCompany, loading } = useSingleData(`${config.apiBaseUrl}/egp-listed-company/get-by-mail?mail=${item?.egpMail}`);
  console.log(egpListendCompany)
  const bankName = egpListendCompany?.bankName || "NILL";

  const { data: tenderData } = useSingleData(`${config.apiBaseUrl}/tenders/tenderId/${item?.tenderIdNum}`);
  console.log(tenderData)
  const liquidAssets = tenderData?.liquidAssets || 1

  // helper function
  const getActivityDays = (startDate, endDate) => {

    if (!startDate || !endDate) {
      return 30; // default
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return 30; // fallback if date parsing fails
    }

    const diffTime = end - start; // in ms
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
    return diffDays - 3; // subtract 3
  };


  return (
    <tr
      key={idx}
      className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
    >
      <td className="px-4 py-2">{idx + 1}</td>
      <td className="px-4 py-2">{item?.orderId}</td>
      <td className="px-4 py-2">{item?.jobId ? item?.jobId : "NILL"}</td>
      <td className="px-4 py-2">{idx > 0 && item?.egpMail === data[idx - 1]?.egpMail ? 1 : 2}</td>
      <td className="px-4 py-2">{item?.tenderId}</td>
      <td className="px-4 py-2">{item?.egpMail}</td>
      <td className="px-4 py-2">{item?.companyName}</td>
      <td className="px-4 py-2">{item?.password || "Null"}</td>
      <td className="px-4 py-2">{item?.bankName ? item?.bankName : loading ? "loading..." : bankName}</td>
      <td className="px-4 py-2">{item?.liquidAssetsTenderAmount ? item?.liquidAssetsTenderAmount : liquidAssets}</td>
      <td className="px-4 py-2">{item?.activityDate1 || 3}</td>
      <td className="px-4 py-2">{item?.activityDate2 || getActivityDays(item?.TentativeStartDate, item?.TentativeCompletionDate)}</td>
      <td className="px-4 py-2">{item?.companyAddress || "N/A"}</td>
      <td className="px-4 py-2">{item?.autho}</td>
      <td className="px-4 py-2">{item?.nid}</td>
      <td className="px-4 py-2">{item?.trade}</td>
      <td className="px-4 py-2">{item?.tin}</td>
      <td className="px-4 py-2">{item?.vat}</td>
      <td className="px-4 py-2">{item?.licenseSL || "N/A"}</td>
      <td className="px-4 py-2">{item?.other1 || 1}</td>
      <td className="px-4 py-2">{item?.SLOfCredit || 1}</td>
      <td className="px-4 py-2">{item?.other2Map ? item?.other2Map : 1}</td>
      <td className="px-4 py-2">{item?.whatsApp ? item?.whatsApp : "NILL"}</td>
      <td className="px-4 py-2">{item?.tinReturnCertificate || "N/A"}</td>
      <td className="px-4 py-2">{item?.vatReturnCertificate || "N/A"}</td>
      <td className="px-4 py-2">{item?.manpower || "N/A"}</td>
      <td className="px-4 py-2">{item?.equipment || "N/A"}</td>
      <td className="px-4 py-2">{item?.updateAuditReportFileName || "N/A"}</td>
    </tr>
  )
}
