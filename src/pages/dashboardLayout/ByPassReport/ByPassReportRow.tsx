// @ts-nocheck

import { config } from "@/lib/config";
import useSingleData from "@/hooks/useSingleData";

export default function ByPassReportRow({ item, idx, data }: any) {
  const { data: egpListendCompany, loading } = useSingleData(
    `${config.apiBaseUrl}/egp-listed-company/get-by-mail?mail=${item?.egp_email}`
  );
  console.log(egpListendCompany);
  const bankName = egpListendCompany?.bankName || "NILL";

  const { data: tenderData } = useSingleData(
    `${config.apiBaseUrl}/tenders/tenderId/${item?.tender_id}`
  );
  console.log(tenderData);
  const liquidAssets = tenderData?.liquidAssets || 1;

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
    <tr key={idx} className={`border ${idx % 2 == 1 && "bg-gray-100"}`}>
      {/* General Info */}
      <td className="px-4 py-2">{item?.sl || idx + 1}</td>
      <td className="px-4 py-2">{item?.invoice_no || "N/A"}</td>
      <td className="px-4 py-2">{item?.job_no || "N/A"}</td>
      <td className="px-4 py-2">
        {idx > 0 && item?.egp_email === data[idx - 1]?.egp_email ? 1 : 2}
      </td>
      <td className="px-4 py-2">{item?.tender_id || "N/A"}</td>
      <td className="px-4 py-2">{item?.egp_email || "N/A"}</td>
      <td className="px-4 py-2">{item?.company_name || "N/A"}</td>
      <td className="px-4 py-2">{item?.password || "N/A"}</td>
      <td className="px-4 py-2">
        {item?.bank_name ? item?.bank_name : loading ? "..." : bankName}
      </td>
      <td className="px-4 py-2">{item?.liquid_asset || liquidAssets || "N/A"}</td>
      <td className="px-4 py-2">{item?.active_date1 || "N/A"}</td>
      <td className="px-4 py-2">{item?.active_date2 || "N/A"}</td>
      <td className="px-4 py-2">{item?.company_address || "N/A"}</td>
      <td className="px-4 py-2">{item?.author || "N/A"}</td>

      {/* Documents & Mappings */}
      <td className="px-4 py-2">{item?.nid || "N/A"}</td>
      <td className="px-4 py-2">{item?.trade_license || "N/A"}</td>
      <td className="px-4 py-2">{item?.tin || "N/A"}</td>
      <td className="px-4 py-2">{item?.vat || "N/A"}</td>
      <td className="px-4 py-2">{item?.ltm_license || "N/A"}</td>
      <td className="px-4 py-2">{item?.other1_map || "N/A"}</td>
      <td className="px-4 py-2">{item?.slno_line_credit || "N/A"}</td>
      <td className="px-4 py-2">{item?.other2_map || "N/A"}</td>
      <td className="px-4 py-2">{item?.whatsapp || "N/A"}</td>
      <td className="px-4 py-2">{item?.tin_return || "N/A"}</td>
      <td className="px-4 py-2">{item?.vat_return || "N/A"}</td>
      <td className="px-4 py-2">{item?.manpower || "N/A"}</td>
      <td className="px-4 py-2">{item?.equipment || "N/A"}</td>
      <td className="px-4 py-2">{item?.audit_report || "N/A"}</td>

      {/* Additional Technical */}
      <td className="px-4 py-2">{item?.structural_steel_works || "N/A"}</td>
      <td className="px-4 py-2">{item?.pavement_asphalt_works || "N/A"}</td>

      {/* Specific Experience */}
      <td className="px-4 py-2">{item?.general_exp_year || "N/A"}</td>
      <td className="px-4 py-2">{item?.specific_contract_no || "N/A"}</td>
      <td className="px-4 py-2">{item?.specific_contract_name || "N/A"}</td>
      <td className="px-4 py-2">{item?.specific_contract_role || "N/A"}</td>
      <td className="px-4 py-2">{item?.specific_award_date || "N/A"}</td>
      <td className="px-4 py-2">{item?.specific_completion_date || "N/A"}</td>
      <td className="px-4 py-2">{item?.specific_contract_value || "N/A"}</td>
      <td className="px-4 py-2">{item?.specific_entity_details || "N/A"}</td>
      <td className="px-4 py-2">{item?.specific_description || "N/A"}</td>

      {/* Financial Turnover */}
      <td className="px-4 py-2">{item?.year01_period || "N/A"}</td>
      <td className="px-4 py-2">{item?.year01_amount_currency || "N/A"}</td>
      <td className="px-4 py-2">{item?.year01_amount_bdt || "N/A"}</td>
      <td className="px-4 py-2">{item?.year02_period || "N/A"}</td>
      <td className="px-4 py-2">{item?.year02_amount_currency || "N/A"}</td>
      <td className="px-4 py-2">{item?.year02_amount_bdt || "N/A"}</td>
      <td className="px-4 py-2">{item?.year03_period || "N/A"}</td>
      <td className="px-4 py-2">{item?.year03_amount_currency || "N/A"}</td>
      <td className="px-4 py-2">{item?.year03_amount_bdt || "N/A"}</td>
      <td className="px-4 py-2">{item?.year04_period || "N/A"}</td>
      <td className="px-4 py-2">{item?.year04_amount_currency || "N/A"}</td>
      <td className="px-4 py-2">{item?.year04_amount_bdt || "N/A"}</td>
      <td className="px-4 py-2">{item?.year05_period || "N/A"}</td>
      <td className="px-4 py-2">{item?.year05_amount_currency || "N/A"}</td>
      <td className="px-4 py-2">{item?.year05_amount_bdt || "N/A"}</td>

      {/* LOC and Extra Info */}
      <td className="px-4 py-2">{item?.loc_no || "N/A"}</td>
      <td className="px-4 py-2">{item?.loc_source || "N/A"}</td>
      <td className="px-4 py-2">{item?.loc_amount || "N/A"}</td>
      <td className="px-4 py-2">{item?.contact_details || "N/A"}</td>
      <td className="px-4 py-2">{item?.qualifications_experience || "N/A"}</td>
      <td className="px-4 py-2">{item?.tender_capacity_period || "N/A"}</td>
      <td className="px-4 py-2">{item?.tender_capacity_max_value || "N/A"}</td>
      <td className="px-4 py-2">{item?.tender_capacity_remaining_value || "N/A"}</td>
      <td className="px-4 py-2 whitespace-nowrap">
        {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
      </td>
    </tr>
  );
}
