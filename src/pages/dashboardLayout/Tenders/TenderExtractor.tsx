// @ts-nocheck
import { config } from "@/lib/config";
import { useState } from "react";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formateDate";
import { updateData } from "@/lib/updateData";

const TenderExtractor = ({ data, setReload }) => {
  // const [tenderText, setTenderText] = useState("");

  const tenderText = `${data?.tenderId} ${data?.procurementMethod} ${formatDate(
    data?.publishDate,
    "MM-dd-yyyy"
  )} ${data?.selectedTenderCategory} ${
    data?.tds ||
    data?.tds_experience_title ||
    data?.tds_experience_details ||
    data?.tds_financial_title ||
    data?.tds_turnover_requirement ||
    data?.tds_liquid_assets_requirement ||
    data?.tds_capacity_formula
      ? [
          data?.tds,
          data?.tds_experience_title,
          data?.tds_experience_details,
          data?.tds_financial_title,
          data?.tds_turnover_requirement,
          data?.tds_liquid_assets_requirement,
          data?.tds_capacity_formula,
        ]
          .filter(Boolean)
          .join(", ")
      : "Not Applicable"
  } ${
    data?.identificationOfLot ? data?.identificationOfLot : "Not Available"
  } ${data?.qualityCriteria ? data?.qualityCriteria : "Not Available"}`;

  const parseAmount = (text) => {
    text = text.toLowerCase().replace(/,/g, "");
    let amount = parseFloat(text.replace(/[^0-9.]/g, "")) || 0;

    if (text.includes("crore")) amount *= 10000000;
    else if (text.includes("lakh")) amount *= 100000;

    return Math.floor(amount);
  };

  const numberToWords = (number) => {
    const ones = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (number < 20) return ones[number];
    if (number < 100)
      return (
        tens[Math.floor(number / 10)] +
        (number % 10 ? " " + ones[number % 10] : "")
      );
    if (number < 1000)
      return (
        ones[Math.floor(number / 100)] +
        " Hundred" +
        (number % 100 ? " " + numberToWords(number % 100) : "")
      );
    return "";
  };

  const convertAmountToWords = (amount) => {
    if (isNaN(amount) || amount <= 0) return "N/A";

    const crore = Math.floor(amount / 10000000);
    const lakh = Math.floor((amount % 10000000) / 100000);
    const thousand = Math.floor((amount % 100000) / 1000);
    const rest = amount % 1000;

    let words = "";
    if (crore) words += numberToWords(crore) + " Crore ";
    if (lakh) words += numberToWords(lakh) + " Lakh ";
    if (thousand && !words) words += numberToWords(thousand) + " Thousand ";
    if (rest && !words) words += numberToWords(rest);

    return words.trim() + " Only";
  };

  const extractTenderData = (text) => {
    text = text.replace(/\s+/g, " ").replace(/\u00A0/g, " ");

    const getMatch = (regex) => (text.match(regex) || [])[1];

    const data = {
      tender_id: getMatch(/Tender\s*ID\s*[:\-]?\s*(\d{5,})/i) || "Not found",
      general_experience: getMatch(
        /general experience.*?(\d+)\s*(?:\(.*\))?\s*years/i
      )
        ? `${getMatch(
            /general experience.*?(\d+)\s*(?:\(.*\))?\s*years/i
          )} Years`
        : "Not found",
      similar_work_amount: (() => {
        const match = getMatch(
          /similar nature.*?value of at least.*?((?:Tk|Taka)[\s\.]*[\d,\.]+\s*(?:Lakh|Crore)?)/i
        );
        return match ? convertAmountToWords(parseAmount(match)) : "Not found";
      })(),
      turnover_amount: (() => {
        const match = getMatch(
          /turnover shall be greater than.*?((?:Tk|Taka)[\s\.]*[\d,\.]+\s*(?:Lakh|Crore)?)/i
        );
        return match ? convertAmountToWords(parseAmount(match)) : "Not found";
      })(),
      credit_line: (() => {
        const match = getMatch(
          /(?:liquid assets|credit facilities|credit line).*?((?:Tk|Taka)[\s\.]*[\d,\.]+\s*(?:Lakh|Crore)?)/i
        );
        return match ? convertAmountToWords(parseAmount(match)) : "Not found";
      })(),
      tender_capacity: (() => {
        const match = getMatch(
          /(?:minimum capacity|Tender Capacity) shall be.*?((?:Tk|Taka)[\s\.]*[\d,\.]+\s*(?:Lakh|Crore)?)/i
        );
        return match
          ? convertAmountToWords(parseAmount(match))
          : "Not explicitly mentioned.";
      })(),
      jvca_allowed: /\b(JVCA|Joint Venture|JV)\b/i.test(text) ? "YES" : "NO",
      similar_work_types:
        getMatch(
          /specific experience.*?in (construction works of .*?)\s*successfully completed/i
        ) || "Not specified",
      required_documents: (() => {
        const docs = [];
        if (/Experience certificate/i.test(text))
          docs.push("Experience Certificate");
        if (/Turnover certificate/i.test(text))
          docs.push("Turnover Certificate");
        if (/work order\/NOA/i.test(text)) docs.push("Work Order/NOA");
        if (/completion certificate/i.test(text))
          docs.push("Completion Certificate");
        if (/Payment certificate/i.test(text)) docs.push("Payment Certificate");
        return docs.length ? docs.join("; ") : "Refer to tender document";
      })(),
      category_list: (() => {
        const categories = [];
        const title = getMatch(/^\d+\s(.*?)(?=Not Available)/s) || text;
        if (/road|highway/i.test(title)) categories.push("Road Construction");
        if (/building|floor|Armory/i.test(title))
          categories.push("Building Construction");
        if (/Piped Water Supply|Pump House|Water Tank/i.test(title))
          categories.push("Water Supply Works");
        if (/Civil/i.test(title)) categories.push("Civil Works");
        if (/Sanitary/i.test(title)) categories.push("Sanitary Works");
        if (/Electric|Electrical/i.test(title))
          categories.push("Electrical Works");
        return categories.length
          ? [...new Set(categories)].join("; ")
          : "General Construction";
      })(),
      financial_criteria: (() => {
        const matches = text.match(
          /[^.!?]*?(turnover|credit|liquid assets|capacity)[^.!?]*[.!?]/gi
        );
        return matches
          ? matches.map((m) => m.trim()).join(" ")
          : "Not specified.";
      })(),
    };

    const formatted = Object.entries(data).map(([field, value]) => ({
      Field: field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      Value: value,
    }));

    return { TenderData: formatted };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const extracted = extractTenderData(tenderText);

    const categoryItem = extracted.TenderData.find(
      (item) => item.Field === "Category List"
    );

    const simplified = {
      tender_subCategories: categoryItem ? categoryItem.Value : "Not found",
      selectedTenderCategory: categoryItem ? categoryItem.Value : "Not found",
    };

    const url = `${config.apiBaseUrlAlt}/tenders/tenderId/${data?.tenderId}`;
    await updateData(url, simplified, setReload);

    // const blob = new Blob([JSON.stringify(simplified, null, 2)], {
    //   type: "application/json",
    // });

    // saveAs(blob, "tender_subcategories.json");
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <textarea
          value={tenderText}
          readOnly
          placeholder="Enter full tender text here..."
          required
          className=" sr-only  p-4 border border-gray-300 rounded-lg text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-green-400 "
        ></textarea>
        <Button type="submit" className="mt-4  transition duration-200 ">
          Update Category
        </Button>
      </form>
    </div>
  );
};

export default TenderExtractor;
