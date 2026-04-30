// @ts-nocheck

export default function ByPassReportRow({ item, idx }: any) {
  return (
    <tr key={idx} className="border-b border-gray-200">
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3">{item?.orderId ?? 0}</td>
      <td className="px-4 py-3">{item?.jobNo ?? 0}</td>
      <td className="px-4 py-3">{item?.userMail ?? 0}</td>
      <td className="px-4 py-3">{item?.tenderId ?? 0}</td>
      <td className="px-4 py-3">{item?.egpMail ?? 0}</td>
      <td className="px-4 py-3">{item?.companyName ?? 0}</td>
      <td className="px-4 py-3">{item?.password ?? 0}</td>
      <td className="px-4 py-3">{item?.bankName ?? 0}</td>
      <td className="px-4 py-3">{item?.liquidAsset ?? 0}</td>
      <td className="px-4 py-3">{item?.activityDate1 ?? 0}</td>
      <td className="px-4 py-3">{item?.activityDate2 ?? 0}</td>
      <td className="px-4 py-3 max-w-[250px] truncate" title={item?.companyAddress}>
        {item?.companyAddress ?? 0}
      </td>
      <td className="px-4 py-3">{item?.author ?? 0}</td>
      <td className="px-4 py-3">{item?.nid ?? 0}</td>
      <td className="px-4 py-3">{item?.trade ?? 0}</td>
      <td className="px-4 py-3">{item?.tin ?? 0}</td>
      <td className="px-4 py-3">{item?.vat ?? 0}</td>
      <td className="px-4 py-3">{item?.ltmLicense ?? 0}</td>
      <td className="px-4 py-3">{item?.whatsApp ?? 0}</td>
      <td className="px-4 py-3">{item?.tinReturnCertificate ?? 0}</td>
      <td className="px-4 py-3">{item?.vatReturnCertificate ?? 0}</td>
      <td className="px-4 py-3">{item?.manpower ?? 0}</td>
      <td className="px-4 py-3">{item?.equipment ?? 0}</td>
      <td className="px-4 py-3">{item?.auditReport ?? 0}</td>
    </tr>
  );
}
