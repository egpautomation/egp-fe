// @ts-nocheck

const fmt = (v: any) => {
  if (v == null || v === "") return "0";
  const n = Number(v);
  if (!Number.isNaN(n)) return parseFloat(n.toFixed(3)).toString();
  return v;
};

const fmtDate = (v: any) => {
  if (v == null || v === "") return "0";
  const n = Number(v);
  if (!Number.isNaN(n)) return n.toString();
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  return v || "0";
};

export default function LTMBypassReportRow({ item, idx }: any) {
  return (
    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3">{fmt(item?.invoice_no)}</td>
      <td className="px-4 py-3">{fmt(item?.tender_id)}</td>
      <td className="px-4 py-3">{item?.egp_email || "0"}</td>
      <td className="px-4 py-3">{item?.company_name || "0"}</td>
      <td className="px-4 py-3">{item?.password || "0"}</td>
      <td className="px-4 py-3">{item?.bank_name || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.liquid_asset)}</td>
      <td className="px-4 py-3">{fmtDate(item?.active_date1)}</td>
      <td className="px-4 py-3">{fmtDate(item?.active_date2)}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.company_address || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.author || "0"}</td>

      {/* Documents */}
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.nid || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.trade_license || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.tin || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.vat || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.ltm_license || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.tin_return || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.vat_return || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.manpower || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.equipment || "0"}</td>
      <td className="px-4 py-3 whitespace-pre-wrap">{item?.audit_report || "0"}</td>

      {/* Technical */}
      <td className="px-4 py-3">{item?.structural_steel_works || "0"}</td>
      <td className="px-4 py-3">{item?.pavement_asphalt_works || "0"}</td>

      {/* Experience */}
      <td className="px-4 py-3">{fmt(item?.general_exp_year)}</td>
      <td className="px-4 py-3">{item?.specific_contract_no || "0"}</td>
      <td className="px-4 py-3">{item?.specific_contract_name || "0"}</td>
      <td className="px-4 py-3">{item?.specific_contract_role || "0"}</td>
      <td className="px-4 py-3">{item?.specific_award_date || "0"}</td>
      <td className="px-4 py-3">{item?.specific_completion_date || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.specific_contract_value)}</td>
      <td className="px-4 py-3">{item?.specific_entity_details || "0"}</td>
      <td className="px-4 py-3">{item?.specific_description || "0"}</td>

      {/* Financial Turnover */}
      <td className="px-4 py-3">{item?.year01_period || "0"}</td>
      <td className="px-4 py-3">{item?.year01_amount_currency || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.year01_amount_bdt)}</td>
      <td className="px-4 py-3">{item?.year02_period || "0"}</td>
      <td className="px-4 py-3">{item?.year02_amount_currency || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.year02_amount_bdt)}</td>
      <td className="px-4 py-3">{item?.year03_period || "0"}</td>
      <td className="px-4 py-3">{item?.year03_amount_currency || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.year03_amount_bdt)}</td>
      <td className="px-4 py-3">{item?.year04_period || "0"}</td>
      <td className="px-4 py-3">{item?.year04_amount_currency || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.year04_amount_bdt)}</td>
      <td className="px-4 py-3">{item?.year05_period || "0"}</td>
      <td className="px-4 py-3">{item?.year05_amount_currency || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.year05_amount_bdt)}</td>

      {/* LOC and Extra */}
      <td className="px-4 py-3">{item?.loc_no || "0"}</td>
      <td className="px-4 py-3">{item?.loc_source || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.loc_amount)}</td>
      <td className="px-4 py-3">{item?.contact_details || "0"}</td>
      <td className="px-4 py-3">{item?.qualifications_experience || "0"}</td>
      <td className="px-4 py-3">{item?.tender_capacity_period || "0"}</td>
      <td className="px-4 py-3">{fmt(item?.tender_capacity_max_value)}</td>
      <td className="px-4 py-3">{fmt(item?.tender_capacity_remaining_value)}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        {item?.createdAt?.$date ? new Date(item.createdAt.$date).toLocaleDateString() : (item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "0")}
      </td>
    </tr>
  );
}
