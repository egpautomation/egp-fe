// @ts-nocheck

export default function ByPassReportRow({ item, idx }: any) {
  // activityDate2 can be 0 (a valid number), so only fallback if undefined/null
  const activityDate2Display =
    item?.activityDate2 !== null && item?.activityDate2 !== undefined
      ? item.activityDate2
      : "N/A";

  return (
    <tr key={idx} className="border-b border-gray-200">
      <td className="px-4 py-3">{idx + 1}</td>
      {/* InvoiceNo = orderId (parent order ID) */}
      <td className="px-4 py-3">{item?.orderId || "N/A"}</td>
      {/* JobNo = jobId (individual job within the order) */}
      <td className="px-4 py-3">{item?.jobNo || "N/A"}</td>
      {/* ReLogin = userMail (the platform login email) */}
      <td className="px-4 py-3">{item?.userMail || "N/A"}</td>
      <td className="px-4 py-3">{item?.tenderId || "N/A"}</td>
      <td className="px-4 py-3">{item?.egpMail || "N/A"}</td>
      <td className="px-4 py-3">{item?.companyName || "N/A"}</td>
      <td className="px-4 py-3">{item?.password || "N/A"}</td>
      <td className="px-4 py-3">{item?.bankName || "N/A"}</td>
      {/* LiquidAsset = liquidAssetsTenderAmount entered at job-order time */}
      <td className="px-4 py-3">{item?.liquidAsset || "N/A"}</td>
      {/* ActiveDate1 is always 3 (fixed value from backend) */}
      <td className="px-4 py-3">{item?.activityDate1 ?? "N/A"}</td>
      {/* ActiveDate2 = (TentativeCompletionDate - TentativeStartDate) - 3 */}
      <td className="px-4 py-3">{activityDate2Display}</td>
      <td className="px-4 py-3 max-w-[250px] truncate" title={item?.companyAddress}>
        {item?.companyAddress || "N/A"}
      </td>
      {/* Author = autho field from EgpListedCompany */}
      <td className="px-4 py-3">{item?.author || "N/A"}</td>
      <td className="px-4 py-3">{item?.nid || "N/A"}</td>
      <td className="px-4 py-3">{item?.trade || "N/A"}</td>
      <td className="px-4 py-3">{item?.tin || "N/A"}</td>
      <td className="px-4 py-3">{item?.vat || "N/A"}</td>
      {/* Ltm_License = departmentLicenses matched by LtmLicenseNameCode (fallback: LGED) */}
      <td className="px-4 py-3">{item?.ltmLicense || "N/A"}</td>
      <td className="px-4 py-3">{item?.other1 || "N/A"}</td>
      {/* SLNoLineOfCredit = SLOfCredit from job order */}
      <td className="px-4 py-3">{item?.slNoLineOfCredit || "N/A"}</td>
      {/* Other_2_Map = other2Map from job order */}
      <td className="px-4 py-3">{item?.other2 || "N/A"}</td>
      <td className="px-4 py-3">{item?.whatsApp || "N/A"}</td>
      <td className="px-4 py-3">{item?.tinReturnCertificate || "N/A"}</td>
      <td className="px-4 py-3">{item?.vatReturnCertificate || "N/A"}</td>
      <td className="px-4 py-3">{item?.manpower || "N/A"}</td>
      <td className="px-4 py-3">{item?.equipment || "N/A"}</td>
      {/* AuditReport = updateAuditReportFileName from EgpListedCompany */}
      <td className="px-4 py-3">{item?.auditReport || "N/A"}</td>
    </tr>
  );
}
