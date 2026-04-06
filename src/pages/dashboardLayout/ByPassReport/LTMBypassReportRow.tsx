// @ts-nocheck

export default function LTMBypassReportRow({ item, idx }: any) {
  return (
    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3">{item?.invoice_no || "N/A"}</td>
      <td className="px-4 py-3">{item?.job_no || "N/A"}</td>
      <td className="px-4 py-3">{item?.tender_id || "N/A"}</td>
      <td className="px-4 py-3">{item?.egp_email || "N/A"}</td>
      <td className="px-4 py-3">{item?.company_name || "N/A"}</td>
      <td className="px-4 py-3">{item?.password || "N/A"}</td>
      <td className="px-4 py-3">{item?.bank_name || "N/A"}</td>
      <td className="px-4 py-3">{item?.liquid_asset || "N/A"}</td>
      <td className="px-4 py-3">{item?.active_date1 || "N/A"}</td>
      <td className="px-4 py-3">{item?.active_date2 || "N/A"}</td>
      <td className="px-4 py-3 max-w-[200px] truncate" title={item?.company_address}>
        {item?.company_address || "N/A"}
      </td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.author}>{item?.author || "N/A"}</td>

      {/* Documents */}
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.nid}>{item?.nid || "N/A"}</td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.trade_license}>{item?.trade_license || "N/A"}</td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.tin}>{item?.tin || "N/A"}</td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.vat}>{item?.vat || "N/A"}</td>
      <td className="px-4 py-3">{item?.ltm_license || "N/A"}</td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.tin_return}>{item?.tin_return || "N/A"}</td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.vat_return}>{item?.vat_return || "N/A"}</td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.manpower}>{item?.manpower || "N/A"}</td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.equipment}>{item?.equipment || "N/A"}</td>
      <td className="px-4 py-3 max-w-[150px] truncate" title={item?.audit_report}>{item?.audit_report || "N/A"}</td>

      {/* Technical */}
      <td className="px-4 py-3">{item?.structural_steel_works || "N/A"}</td>
      <td className="px-4 py-3">{item?.pavement_asphalt_works || "N/A"}</td>

      {/* Experience */}
      <td className="px-4 py-3">{item?.general_exp_year || "N/A"}</td>
      <td className="px-4 py-3">{item?.specific_contract_no || "N/A"}</td>
      <td className="px-4 py-3">{item?.specific_contract_name || "N/A"}</td>
      <td className="px-4 py-3">{item?.specific_contract_role || "N/A"}</td>
      <td className="px-4 py-3">{item?.specific_award_date || "N/A"}</td>
      <td className="px-4 py-3">{item?.specific_completion_date || "N/A"}</td>
      <td className="px-4 py-3">{item?.specific_contract_value || "N/A"}</td>
      <td className="px-4 py-3">{item?.specific_entity_details || "N/A"}</td>
      <td className="px-4 py-3">{item?.specific_description || "N/A"}</td>

      {/* Financial Turnover */}
      <td className="px-4 py-3">{item?.year01_period || "N/A"}</td>
      <td className="px-4 py-3">{item?.year01_amount_currency || "N/A"}</td>
      <td className="px-4 py-3">{item?.year01_amount_bdt || "N/A"}</td>
      <td className="px-4 py-3">{item?.year02_period || "N/A"}</td>
      <td className="px-4 py-3">{item?.year02_amount_currency || "N/A"}</td>
      <td className="px-4 py-3">{item?.year02_amount_bdt || "N/A"}</td>
      <td className="px-4 py-3">{item?.year03_period || "N/A"}</td>
      <td className="px-4 py-3">{item?.year03_amount_currency || "N/A"}</td>
      <td className="px-4 py-3">{item?.year03_amount_bdt || "N/A"}</td>
      <td className="px-4 py-3">{item?.year04_period || "N/A"}</td>
      <td className="px-4 py-3">{item?.year04_amount_currency || "N/A"}</td>
      <td className="px-4 py-3">{item?.year04_amount_bdt || "N/A"}</td>
      <td className="px-4 py-3">{item?.year05_period || "N/A"}</td>
      <td className="px-4 py-3">{item?.year05_amount_currency || "N/A"}</td>
      <td className="px-4 py-3">{item?.year05_amount_bdt || "N/A"}</td>

      {/* LOC and Extra */}
      <td className="px-4 py-3">{item?.loc_no || "N/A"}</td>
      <td className="px-4 py-3">{item?.loc_source || "N/A"}</td>
      <td className="px-4 py-3">{item?.loc_amount || "N/A"}</td>
      <td className="px-4 py-3">{item?.contact_details || "N/A"}</td>
      <td className="px-4 py-3">{item?.qualifications_experience || "N/A"}</td>
      <td className="px-4 py-3">{item?.tender_capacity_period || "N/A"}</td>
      <td className="px-4 py-3">{item?.tender_capacity_max_value || "N/A"}</td>
      <td className="px-4 py-3">{item?.tender_capacity_remaining_value || "N/A"}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        {item?.createdAt?.$date ? new Date(item.createdAt.$date).toLocaleDateString() : (item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A")}
      </td>
    </tr>
  );
}
