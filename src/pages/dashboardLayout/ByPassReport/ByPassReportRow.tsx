// @ts-nocheck

export default function ByPassReportRow({ item, idx }: any) {
  return (
    <tr key={idx} className="border-b border-gray-200">
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3">{item?.orderId || "N/A"}</td>
      <td className="px-4 py-3">{item?.tenderId || "N/A"}</td>
      <td className="px-4 py-3">{item?.tenderIdNum || "N/A"}</td>
      <td className="px-4 py-3">{item?.userMail || "N/A"}</td>
      <td className="px-4 py-3">{item?.egpMail || "N/A"}</td>
      <td className="px-4 py-3">{item?.companyName || "N/A"}</td>
      <td className="px-4 py-3">{item?.password || "N/A"}</td>
      <td className="px-4 py-3">{item?.bankName || "N/A"}</td>
      <td className="px-4 py-3">{item?.status || "N/A"}</td>
      <td className="px-4 py-3 max-w-[250px] truncate" title={item?.companyAddress}>
        {item?.companyAddress || "N/A"}
      </td>
      <td className="px-4 py-3">{item?.nid || "N/A"}</td>
      <td className="px-4 py-3">{item?.trade || "N/A"}</td>
      <td className="px-4 py-3">{item?.tin || "N/A"}</td>
      <td className="px-4 py-3">{item?.vat || "N/A"}</td>
      <td className="px-4 py-3">{item?.tinReturnCertificate || "N/A"}</td>
      <td className="px-4 py-3">{item?.vatReturnCertificate || "N/A"}</td>
      <td className="px-4 py-3">{item?.whatsApp || "N/A"}</td>
      <td className="px-4 py-3">{item?.manpower || "N/A"}</td>
      <td className="px-4 py-3">{item?.equipment || "N/A"}</td>
      <td className="px-4 py-3">{item?.TentativeStartDate || "N/A"}</td>
      <td className="px-4 py-3">{item?.TentativeCompletionDate || "N/A"}</td>
      <td className="px-4 py-3">{item?.ActivitytotalDays || "N/A"}</td>
      <td className="px-4 py-3">{item?.licenseSL || "N/A"}</td>
      <td className="px-4 py-3">{item?.other1 || "N/A"}</td>
    </tr>
  );
}
