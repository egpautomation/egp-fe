// src/components/TenderTabs/TendererFormPreview.tsx

// @ts-nocheck
import React, { useMemo, useState } from 'react';
import subCategoriesData from "@/lib/subCategories.json";
import { formatDate } from "@/lib/formateDate";
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Assuming lucide-react is available, or use text "Prev/Next"
import { Button } from "@/components/ui/button"

// --- নমুনা ডেটা (এটি পরে API থেকে আসবে) ---
const mockTendererFormData = {
  part1: {
    nameOfTenderer: "MAX Infrastructure Ltd.",
    emailOfTenderer: "contact@maxinfra.com"
  },
  part2: [
    {
      contractNo: "CN-101",
      nameOfContract: "Construction of Padma Bridge Approach Road",
      roleInContract: "Prime Contractor",
      awardDate: "2022-01-15",
      completionDate: "2024-12-31",
      totalContractValue: 500000000,
      peName: "Bangladesh Bridge Authority",
      peAddress: "Setu Bhaban, New Airport Road, Banani, Dhaka-1212",
      peTelFax: "880-2-55040404",
      peEmail: "info@bba.gov.bd",
      description: "Construction of 4-lane approach road including culverts and minor bridges."
    }
  ],
  part3: [
    { financialYear: "2022-2023", amount: 180000000 }
  ],
  part4: [
    { no: 1, sourceOfFinancing: "Internal Bank Loan", amountAvailable: 100000000 },
    { no: 2, sourceOfFinancing: "Credit Line from AB Bank", amountAvailable: 150000000 }
  ],
  part5: {
    completedWorks: [
      { slNo: 1, nameOfWork: "Dhaka-Mymensingh Highway Upgrade", valueOfWork: 120000000, completionDate: "2023-05-20", certificateFile: "completion_cert_1.pdf" }
    ],
    ongoingWorks: [
      { slNo: 1, nameOfWork: "Matarbari Power Plant Civil Works", valueOfWork: 800000000, awardDate: "2023-02-10", peName: "CPGCBL", agreementFile: "agreement_matarbari.pdf" }
    ]
  },
  activities: [
    { activity: "Mobilization", startDays: 7, durationDays: 30 },
    { activity: "Earthworks", startDays: 37, durationDays: 90 }
  ]
};

// --- সেকশনের জন্য একটি সাহায্যকারী কম্পোনেন্ট ---
const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 className="text-xl font-bold text-gray-700 border-b pb-3 mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const normalizeKey = (s) => String(s || "").trim().toLowerCase();

const extractSubCategoryFromTypesOfSimilarNature = (typesOfSimilarNature) => {
  if (!typesOfSimilarNature) return "";
  const str = String(typesOfSimilarNature);
  // Common format: "Sub Category : Value"
  if (str.includes(" : ")) return str.split(" : ")[0].trim();
  return str.trim();
};

const roleLabel = (roleCode) => {
  const v = String(roleCode || "").trim();
  if (v === "1") return "Prime Contractor";
  if (v === "2") return "Subcontractor";
  if (v === "3") return "Management Contractor";
  return v || "N/A";
};

const pickFirstTruthy = (...values) => values.find(Boolean) || "";

const formatDateSafe = (value) => {
  if (!value) return "N/A";
  const formatted = formatDate(value, "dd MMM yyyy");
  return formatted === "Invalid Date" ? "N/A" : formatted;
};

const formatMoney = (value) => {
  const num = typeof value === "number" ? value : Number(String(value || "").replace(/,/g, ""));
  if (!Number.isFinite(num)) return "N/A";
  return num.toLocaleString("en-IN");
};

// --- মূল প্রিভিউ কম্পোনেন্ট ---
export const TendererFormPreview = ({
  liveTender,
  completedContracts,
  allHistoryContracts, // New prop: Raw unfiltered list
  minYears, // New prop: Validation rule
  companyData,
  averageTurnover,
  assessedCapacity,
  maxFinancialYear,
  savedContractId, // New Prop
  onSave, // New Prop
  financialInfo // New Prop
}) => {
  const data = mockTendererFormData;

  // ... (existing memoized values: similarNatureSubCategory, similarNatureMainCategory) ...

  const similarNatureSubCategory = useMemo(
    () => extractSubCategoryFromTypesOfSimilarNature(liveTender?.typesOfSimilarNature),
    [liveTender?.typesOfSimilarNature]
  );

  const similarNatureMainCategory = useMemo(() => {
    if (!similarNatureSubCategory) return "";
    const lookup = new Map(
      (Array.isArray(subCategoriesData) ? subCategoriesData : []).map((x) => [
        normalizeKey(x?.sub_cat_name),
        x?.cat_name,
      ])
    );
    return lookup.get(normalizeKey(similarNatureSubCategory)) || "";
  }, [similarNatureSubCategory]);

  const filteredSimilarContracts = useMemo(() => {
    // ... (existing filtering logic) ...
    // User Requirement: 
    // 1. Filter by Category (Main Category fallback logic)
    const MIN_VALUE_THRESHOLD = 2500000;

    if (similarNatureMainCategory) {
      if (!Array.isArray(completedContracts)) return [];

      const subToMain = new Map(
        (Array.isArray(subCategoriesData) ? subCategoriesData : []).map((x) => [
          normalizeKey(x?.sub_cat_name),
          x?.cat_name,
        ])
      );

      return completedContracts.filter((contract) => {
        // Step 1: Check Value (Prioritizing Initial Contract Value as requested)
        const rawValue = contract?.contractValue || contract?.revisedContractValue;
        const value = typeof rawValue === "number" ? rawValue : Number(String(rawValue || "").replace(/,/g, ""));

        if (!Number.isFinite(value) || value < MIN_VALUE_THRESHOLD) {
          return false;
        }

        // Step 2: Check Category
        const cats = Array.isArray(contract?.tenderCategories) ? contract.tenderCategories : [];
        const hasMatch = cats.some((c) => {
          const sub = c?.subCategory || c?.sub_cat_name;
          // Find the Main Category of this contract
          const contractMainCat = subToMain.get(normalizeKey(sub));

          // Match if Contract's Main Cat === Tender's Main Cat
          // Also fallback: if the contract's sub-category matches the tender's sub-category directly
          return (
            normalizeKey(contractMainCat) === normalizeKey(similarNatureMainCategory) ||
            normalizeKey(sub) === normalizeKey(similarNatureSubCategory)
          );
        });
        return hasMatch;
      });
    }

    // Fallback: If Main Category is NOT found, filter by Sub Category direct match (Partial/Exact)
    if (similarNatureSubCategory) {
      if (!Array.isArray(completedContracts)) return [];
      const target = normalizeKey(similarNatureSubCategory);

      return completedContracts.filter((contract) => {
        // Step 1: Check Value (Prioritizing Initial Contract Value)
        const rawValue = contract?.contractValue || contract?.revisedContractValue;
        const value = typeof rawValue === "number" ? rawValue : Number(String(rawValue || "").replace(/,/g, ""));

        if (!Number.isFinite(value) || value < MIN_VALUE_THRESHOLD) {
          return false;
        }

        // Step 2: Check Sub Category
        const cats = Array.isArray(contract?.tenderCategories) ? contract.tenderCategories : [];
        return cats.some((c) => {
          const sub = normalizeKey(c?.subCategory || c?.sub_cat_name);
          return sub && (sub.includes(target) || target.includes(sub));
        });
      });
    }

    return [];
  }, [completedContracts, similarNatureMainCategory, similarNatureSubCategory]);

  const filteredContractsB = useMemo(() => {
    // Logic for Table B:
    // 1. No Category Filtering (Show all sub-cats)
    const MIN_VALUE_THRESHOLD = 2500000;

    if (!Array.isArray(completedContracts)) return [];

    return completedContracts.filter((contract) => {
      // Step 1: Check Value (Prioritizing Initial Contract Value)
      const rawValue = contract?.contractValue || contract?.revisedContractValue;
      const value = typeof rawValue === "number" ? rawValue : Number(String(rawValue || "").replace(/,/g, ""));

      if (!Number.isFinite(value) || value < MIN_VALUE_THRESHOLD) {
        return false;
      }

      return true;
    });
  }, [completedContracts]);


  // Pagination for Table B
  const [currentPageB, setCurrentPageB] = useState(1);
  const itemsPerPageB = 5;

  const paginatedContractsB = useMemo(() => {
    const startIndex = (currentPageB - 1) * itemsPerPageB;
    return filteredContractsB.slice(startIndex, startIndex + itemsPerPageB);
  }, [filteredContractsB, currentPageB]);

  const totalPagesB = Math.ceil(filteredContractsB.length / itemsPerPageB);

  const handlePageChangeB = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesB) {
      setCurrentPageB(newPage);
    }
  };

  // Search & Validation Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setSuggestions([]);
      return;
    }

    // Autocomplete Logic
    const tokens = query.split(',');
    const currentToken = tokens[tokens.length - 1].trim();

    if (currentToken.length > 0) {
      const historySource = Array.isArray(allHistoryContracts) ? allHistoryContracts : [];
      const matches = historySource.filter(c => {
        const id = String(c?.tenderId || "").trim();
        return id.includes(currentToken);
      }).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // Validation Logic (Same as before)
    const ids = query.split(',').map(s => s.trim()).filter(Boolean);
    const historySource = Array.isArray(allHistoryContracts) ? allHistoryContracts : [];

    const results = ids.map(id => {
      const contract = historySource.find(c =>
        String(c?.tenderId || "").trim() === id ||
        String(c?.contractNo || "").trim() === id
      );

      if (!contract) {
        return { id, found: false, reason: "Tender ID not found in your completed contracts history." };
      }

      // Validation 1: Date
      const allowedDays = (minYears || 0) * 360;
      let dateValid = true;
      let dateReason = "";

      const completionDateStr = contract.contractPeriodExtendedUpTo
        || contract.contractEndDate
        || contract.intendedCompletionDate;

      if (minYears > 0 && completionDateStr) {
        const completionDate = new Date(completionDateStr);
        if (!isNaN(completionDate.getTime())) {
          const today = new Date();
          const ageInDays = (today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24);
          if (ageInDays > allowedDays) {
            dateValid = false;
            dateReason = `Expired: Completed ${Math.floor(ageInDays)} days ago (Max allowed: ${allowedDays} days)`;
          }
        }
      }

      // Validation 2: Value
      const MIN_VALUE_THRESHOLD = 2500000;
      let valueValid = true;
      let valueReason = "";

      const rawValue = contract?.contractValue || contract?.revisedContractValue;
      const value = typeof rawValue === "number" ? rawValue : Number(String(rawValue || "").replace(/,/g, ""));

      if (!Number.isFinite(value) || value < MIN_VALUE_THRESHOLD) {
        valueValid = false;
        valueReason = `Low Value: ${formatMoney(value)} BDT (Required: >= 25 Lakh BDT)`;
      }

      return {
        id,
        found: true,
        isValid: dateValid && valueValid,
        contract,
        reasons: [!dateValid && dateReason, !valueValid && valueReason].filter(Boolean)
      };
    });

    setSearchResults(results);
  };

  const selectSuggestion = (id) => {
    const tokens = searchQuery.split(',');
    tokens.pop(); // Remove partial token
    tokens.push(id); // Add selected ID
    const newQuery = tokens.join(', ');
    handleSearch(newQuery);
    setShowSuggestions(false);
  };

  // State for Selected Contract (via Confirm button)
  // Initialize from props if available
  const [localConfirmedContract, setLocalConfirmedContract] = useState(null);

  // Sync with saved props
  const confirmedContract = useMemo(() => {
    if (localConfirmedContract) return localConfirmedContract;
    if (savedContractId && Array.isArray(completedContracts)) {
      return completedContracts.find(c => c._id === savedContractId) || null;
    }
    return null;
  }, [localConfirmedContract, savedContractId, completedContracts]);


  const handleConfirm = (contract) => {
    setLocalConfirmedContract(contract);
    if (onSave && contract?._id) {
      onSave(contract._id);
    }
  };


  // Helper to calculate age in days
  const getDaysAgo = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    const today = new Date();
    const diffTime = Math.abs(today - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


  return (
    <div className="bg-gray-50 p-4 space-y-6">

      {/* Part 1: General Information */}
      <Section title="Part 1: General Information">
        {/* ... existing content ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="font-medium text-gray-600">Name of the Tenderer:</div>
          <div className="font-semibold text-gray-800">{companyData?.companyName || "N/A"}</div>
          <div className="font-medium text-gray-600">Registered e-mail ID:</div>
          <div className="font-semibold text-gray-800">{companyData?.egpEmail || "N/A"}</div>
        </div>
      </Section>


      {/* Part 2: Experience in Similar Contracts */}
      <Section title="Part 2: Experience in Similar Contracts A">
        {similarNatureMainCategory || similarNatureSubCategory ? (
          <div className="text-xs text-gray-600 mb-2">
            Filtering by:{" "}
            {similarNatureMainCategory ? (
              <><span className="font-semibold text-gray-800">{similarNatureMainCategory}</span> (Main Category)</>
            ) : (
              <><span className="font-semibold text-gray-800">{similarNatureSubCategory}</span> (Sub Category Match)</>
            )}
            {similarNatureMainCategory && similarNatureSubCategory && (
              <> & <span className="font-semibold text-gray-800">{similarNatureSubCategory}</span></>
            )}
          </div>
        ) : (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-2">
            Types of Similar Nature not found for this tender — showing sample row.
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-100">
              <tr>
                {["Contract No", "Name of Contract", "Role", "Award Date", "Completion Date", "Value", "PE Name", "Action"].map(h => <th key={h} className="p-2 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {(similarNatureMainCategory || similarNatureSubCategory) ? (
                filteredSimilarContracts.length > 0 ? (
                  filteredSimilarContracts.map((c, index) => (
                    <tr key={c?._id || `${c?.tenderId || "contract"}-${index}`} className={`border-b ${confirmedContract?._id === c?._id ? "bg-blue-50" : ""}`}>
                      <td className="p-2">{c?.tenderId || "N/A"}</td>
                      <td className="p-2">{c?.descriptionOfWorks || c?.ProjectName || "N/A"}</td>
                      <td className="p-2">{roleLabel(c?.Role_in_Contract)}</td>
                      <td className="p-2">{formatDateSafe(pickFirstTruthy(c?.noaIssueDate, c?.contractSigningDate, c?.commencementDate))}</td>
                      <td className="p-2">{formatDateSafe(pickFirstTruthy(c?.contractPeriodExtendedUpTo, c?.contractEndDate, c?.intendedCompletionDate))}</td>
                      <td className="p-2 font-mono text-right">{formatMoney(pickFirstTruthy(c?.contractValue, c?.revisedContractValue))}</td>
                      <td className="p-2">{c?.procuringEntityName || "N/A"}</td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant={confirmedContract?._id === c?._id ? "default" : "outline"}
                          onClick={() => handleConfirm(c)}
                        >
                          {confirmedContract?._id === c?._id ? "Selected" : "Confirm"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b">
                    <td className="p-2 text-gray-500 italic" colSpan={8}>
                      No completed contracts found under this main category.
                    </td>
                  </tr>
                )
              ) : (
                data.part2.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.contractNo}</td>
                    <td className="p-2">{item.nameOfContract}</td>
                    <td className="p-2">{item.roleInContract}</td>
                    <td className="p-2">{item.awardDate}</td>
                    <td className="p-2">{item.completionDate}</td>
                    <td className="p-2 font-mono text-right">{item.totalContractValue.toLocaleString('en-IN')}</td>
                    <td className="p-2">{item.peName}</td>
                    <td className="p-2"><Button size="sm">Confirm</Button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Part 2: Experience in Similar Contracts (Duplicate) */}
      <Section title="Part 2: Experience in Similar Contracts B">
        <div className="text-xs text-gray-600 mb-2">
          Filtering by: <span className="font-semibold text-gray-800">All Categories</span> (Value ≥ 25 Lakh BDT)
        </div>

        {/* --- Search & Validation UI --- */}
        <div className="mb-4 bg-white p-3 border rounded shadow-sm relative">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Check Eligibility by Tender ID</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
            placeholder="Enter Tender IDs (comma separated, e.g. 123456, 789012)"
            className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto top-full mt-1 left-0">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="p-2 text-xs hover:bg-blue-50 cursor-pointer border-b last:border-0"
                  onClick={() => selectSuggestion(s.tenderId)}
                >
                  <span className="font-bold">{s.tenderId}</span>
                  <span className="text-gray-500 ml-2"> - {s.descriptionOfWorks ? s.descriptionOfWorks.substring(0, 40) + "..." : "No Desc"}</span>
                </div>
              ))}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  className={`flex items-start p-2 rounded text-xs border ${res.isValid ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                    }`}
                >
                  <div className={`mr-2 font-bold ${res.isValid ? "text-green-600" : "text-red-500"}`}>
                    {res.isValid ? "✓" : "✕"}
                  </div>
                  <div>
                    <div className="font-semibold">ID: {res.id}</div>
                    {!res.found ? (
                      <div>Not found in your completed contracts history.</div>
                    ) : (
                      <>
                        <div className="text-gray-600 text-[10px]">
                          {res.contract?.descriptionOfWorks ? res.contract.descriptionOfWorks.substring(0, 60) + "..." : "No Description"}
                        </div>
                        {res.isValid ? (
                          <div className="text-green-600 font-medium mt-1">Eligible for Table B</div>
                        ) : (
                          <div className="mt-1 font-medium">
                            Issues: {res.reasons.join(", ")}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* --------------------------- */}

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-100">
              <tr>
                {["Contract No", "Name of Contract", "Role", "Award Date", "Completion Date", "Value", "PE Name", "Action"].map(h => <th key={h} className="p-2 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedContractsB.length > 0 ? (
                paginatedContractsB.map((c, index) => (
                  <tr key={c?._id || `${c?.tenderId || "contract"}-${index}`} className={`border-b ${confirmedContract?._id === c?._id ? "bg-blue-50" : ""}`}>
                    <td className="p-2">{c?.tenderId || "N/A"}</td>
                    <td className="p-2">{c?.descriptionOfWorks || c?.ProjectName || "N/A"}</td>
                    <td className="p-2">{roleLabel(c?.Role_in_Contract)}</td>
                    <td className="p-2">{formatDateSafe(pickFirstTruthy(c?.noaIssueDate, c?.contractSigningDate, c?.commencementDate))}</td>
                    <td className="p-2">{formatDateSafe(pickFirstTruthy(c?.contractPeriodExtendedUpTo, c?.contractEndDate, c?.intendedCompletionDate))}</td>
                    <td className="p-2 font-mono text-right">{formatMoney(pickFirstTruthy(c?.contractValue, c?.revisedContractValue))}</td>
                    <td className="p-2">{c?.procuringEntityName || "N/A"}</td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant={confirmedContract?._id === c?._id ? "default" : "outline"}
                        onClick={() => handleConfirm(c)}
                      >
                        {confirmedContract?._id === c?._id ? "Selected" : "Confirm"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b">
                  <td className="p-2 text-gray-500 italic" colSpan={8}>
                    No completed contracts found.
                  </td>
                </tr>
              )
              }
            </tbody>
          </table>

          {/* Pagination Controls for Table B */}
          {totalPagesB > 1 && (
            <div className="flex justify-between items-center mt-4 px-2">
              <div className="text-xs text-gray-500">
                Showing {((currentPageB - 1) * itemsPerPageB) + 1} to {Math.min(currentPageB * itemsPerPageB, filteredContractsB.length)} of {filteredContractsB.length} entries
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChangeB(currentPageB - 1)}
                  disabled={currentPageB === 1}
                  className={`px-3 py-1 text-xs font-medium rounded border ${currentPageB === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChangeB(currentPageB + 1)}
                  disabled={currentPageB === totalPagesB}
                  className={`px-3 py-1 text-xs font-medium rounded border ${currentPageB === totalPagesB
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </Section>

      {/* Part 2: Calculation of Specific Experience */}
      <Section title="Calculation of Specific Experience (Part 2)">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 font-semibold">Criteria</th>
              <th className="p-2 font-semibold text-right">Required</th>
              <th className="p-2 font-semibold text-right">Submitted / Achieved</th>
              <th className="p-2 font-semibold text-right">Result</th>
            </tr>
          </thead>
          <tbody>
            {/* Logic Variables */}
            {(() => {
              // 1. Required Category
              const requiredSubCategory = extractSubCategoryFromTypesOfSimilarNature(liveTender?.typesOfSimilarNature);
              // Find Main Category for the Required info
              const subToMain = new Map(
                (Array.isArray(subCategoriesData) ? subCategoriesData : []).map((x) => [
                  normalizeKey(x?.sub_cat_name),
                  x?.cat_name,
                ])
              );
              const requiredMainCategory = subToMain.get(normalizeKey(requiredSubCategory)) || similarNatureMainCategory || "N/A";

              // 2. Required Value
              const similarNatureValueStr = liveTender?.typesOfSimilarNature?.includes(" : ")
                ? liveTender.typesOfSimilarNature.split(" : ")[1]
                : "2500000";
              const requiredValue = Number(String(similarNatureValueStr).replace(/,/g, "")) || 2500000;

              // 3. Required Years
              const minY = minYears || 0;
              const requiredDays = minY * 360;

              // --- Submitted Data (from confirmedContract) ---

              // Matches Category?
              let categoryMatch = false;
              let submittedCategoryDisplay = "None Selected";

              if (confirmedContract) {
                const contractCats = Array.isArray(confirmedContract?.tenderCategories) ? confirmedContract.tenderCategories : [];
                // Check if ANY of the contract's categories map to the Required Main Category
                categoryMatch = contractCats.some(c => {
                  const sub = c?.subCategory || c?.sub_cat_name;
                  const main = subToMain.get(normalizeKey(sub));
                  return normalizeKey(main) === normalizeKey(requiredMainCategory);
                });
                // Or partial subcategory match as fallback
                if (!categoryMatch && requiredSubCategory) {
                  categoryMatch = contractCats.some(c => {
                    const sub = normalizeKey(c?.subCategory || c?.sub_cat_name);
                    return sub && sub.includes(normalizeKey(requiredSubCategory));
                  });
                }

                submittedCategoryDisplay = categoryMatch ? "Match Found" : "No Category Match";
              }

              // Value Match?
              const submittedRawValue = confirmedContract ? (confirmedContract?.contractValue || confirmedContract?.revisedContractValue) : 0;
              const submittedValue = typeof submittedRawValue === "number" ? submittedRawValue : Number(String(submittedRawValue || "").replace(/,/g, ""));
              const valuePass = submittedValue >= requiredValue;

              // Time Match?
              const completionDateStr = confirmedContract ? pickFirstTruthy(confirmedContract?.contractPeriodExtendedUpTo, confirmedContract?.contractEndDate, confirmedContract?.intendedCompletionDate) : null;
              const daysAgo = getDaysAgo(completionDateStr);
              const timePass = daysAgo !== null && daysAgo <= requiredDays;

              // Overall Match
              const overallPass = categoryMatch && valuePass && timePass;

              return (
                <>
                  {/* Row 1: Types of Similar Nature (Main Category) */}
                  <tr className="border-b">
                    <td className="p-2 bg-gray-50 font-medium">Types of Similar Nature (Main Category)</td>
                    <td className="p-2 text-right">{requiredMainCategory}</td>
                    <td className="p-2 text-right text-gray-600">
                      {confirmedContract ? (
                        categoryMatch ? <span className="text-green-600 font-medium">Matches Requirement</span> : <span className="text-red-600">Categories Do Not Match</span>
                      ) : "Select a contract"}
                    </td>
                    <td className="p-2 font-bold text-right text-gray-700">
                      {confirmedContract ? (categoryMatch ? <span className="text-green-600">Pass</span> : <span className="text-red-600">Fail</span>) : "-"}
                    </td>
                  </tr>

                  {/* Row 2: Value */}
                  <tr className={`border-b ${confirmedContract ? (valuePass ? 'bg-green-50' : 'bg-red-50') : ''}`}>
                    <td className="p-2 font-medium">Type of Similar Nature Value</td>
                    <td className="p-2 text-right font-semibold text-blue-900">{formatMoney(requiredValue)}</td>
                    <td className="p-2 text-right font-semibold text-gray-800">
                      {confirmedContract ? formatMoney(submittedValue) : "-"}
                    </td>
                    <td className={`p-2 font-bold text-right`}>
                      {confirmedContract ? (valuePass ? <span className="text-green-700">Pass</span> : <span className="text-red-600">Fail</span>) : "-"}
                    </td>
                  </tr>

                  {/* Row 3: Minimum Year */}
                  <tr className={`border-b ${confirmedContract ? (timePass ? 'bg-green-50' : 'bg-red-50') : ''}`}>
                    <td className="p-2 font-medium">Minimum Year of Similar Work</td>
                    <td className="p-2 text-right">{minY} Years ({requiredDays} Days)</td>
                    <td className="p-2 text-right">
                      {confirmedContract ? (
                        daysAgo !== null ? `${daysAgo} Days Ago` : "Date Not Available"
                      ) : "-"}
                    </td>
                    <td className={`p-2 font-bold text-right`}>
                      {confirmedContract ? (timePass ? <span className="text-green-700">Pass</span> : <span className="text-red-600">Fail</span>) : "-"}
                    </td>
                  </tr>

                  {/* Row 4: Overall Result */}
                  <tr className={`border-t-2 ${confirmedContract ? (overallPass ? "bg-green-100" : "bg-red-100") : "bg-gray-50"}`}>
                    <td className="p-2 font-bold text-gray-900 uppercase" colSpan={3}>Overall Result</td>
                    <td className={`p-2 font-bold text-right text-lg ${confirmedContract ? (overallPass ? "text-green-700" : "text-red-600") : "text-gray-400"}`}>
                      {confirmedContract ? (overallPass ? "PASS" : "FAIL") : "-"}
                    </td>
                  </tr>
                </>
              );
            })()}
          </tbody>
        </table>
      </Section>

      {/* Part 3 & 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Part 3: Calculation of Minimum Average Annual Construction Turnover">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100"><tr><th className="p-2 font-semibold">Calculation of Minimum Average Annual Construction Turnover</th><th className="p-2 font-semibold text-right">Amount (BDT)</th></tr></thead>
            <tbody>
              {/* Required Turnover Row */}
              <tr className="border-b bg-blue-50">
                <td className="p-2 font-medium text-blue-900">Required Average Annual Construction Turnover</td>
                <td className="p-2 font-bold text-right text-blue-900">
                  {formatMoney(liveTender?.turnoverAmount)}
                </td>
              </tr>

              {/* Average Annual Turnover Row */}
              <tr className="border-b bg-green-50">
                <td className="p-2 font-medium text-green-900">Average Annual Turnover</td>
                <td className="p-2 font-bold text-right text-green-900">
                  {formatMoney(averageTurnover)}
                </td>
              </tr>

              {/* Result Row (Replaces mock data) */}
              {(() => {
                const required = Number(liveTender?.turnoverAmount || 0);
                const achieved = Number(averageTurnover || 0);
                const isPass = achieved >= required;

                return (
                  <tr className={`border-b ${isPass ? 'bg-green-100' : 'bg-red-50'}`}>
                    <td className="p-2 font-bold text-gray-800">Result</td>
                    <td className={`p-2 font-bold text-right ${isPass ? 'text-green-700' : 'text-red-600'}`}>
                      {isPass ? "Pass" : "Fail"}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </Section>
        <Section title="Part 4: Calculation of Tender Capacity">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100"><tr><th className="p-2 font-semibold">Calculation of Tender Capacity</th><th className="p-2 font-semibold text-right">Amount Available (BDT)</th></tr></thead>
            <tbody>
              {/* Required Tender Capacity Row */}
              <tr className="border-b bg-blue-50">
                <td className="p-2 font-medium text-blue-900">Required Tender Capacity</td>
                <td className="p-2 font-bold text-right text-blue-900">
                  {formatMoney(liveTender?.tenderCapacity)}
                </td>
              </tr>

              {/* Final Assessed Tender Capacity Row */}
              <tr className="border-b bg-green-50">
                <td className="p-2 font-medium text-green-900">Final Assessed Tender Capacity</td>
                <td className="p-2 font-bold text-right text-green-900">
                  {formatMoney(assessedCapacity)}
                </td>
              </tr>

              {/* Result Row */}
              {(() => {
                const required = Number(liveTender?.tenderCapacity || 0);
                const achieved = Number(assessedCapacity || 0);
                const isPass = achieved >= required;

                return (
                  <tr className={`border-b ${isPass ? 'bg-green-100' : 'bg-red-50'}`}>
                    <td className="p-2 font-bold text-gray-800">Result</td>
                    <td className={`p-2 font-bold text-right ${isPass ? 'text-green-700' : 'text-red-600'}`}>
                      {isPass ? "Pass" : "Fail"}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </Section>

        {/* Part 5: Financial Information */}
        <Section title="Part 5: Financial Information">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 font-semibold w-1/2">Description</th>
                <th className="p-2 font-semibold text-right w-1/2">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Estimated Cost</td>
                <td className="p-2 text-right">{financialInfo?.estimatedCost ? `BDT ${Number(financialInfo.estimatedCost).toLocaleString('en-IN', { minimumFractionDigits: 0 })}` : 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Document Price</td>
                <td className="p-2 text-right">{financialInfo?.documentPrice ? `BDT ${Number(financialInfo.documentPrice).toLocaleString('en-IN', { minimumFractionDigits: 0 })}` : 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Tender Security</td>
                <td className="p-2 text-right">{financialInfo?.tenderSecurity ? `BDT ${Number(financialInfo.tenderSecurity).toLocaleString('en-IN', { minimumFractionDigits: 0 })}` : 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Turnover Amount</td>
                <td className="p-2 text-right">{financialInfo?.turnoverAmount ? `BDT ${Number(financialInfo.turnoverAmount).toLocaleString('en-IN', { minimumFractionDigits: 0 })}` : 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Liquid Assets</td>
                <td className="p-2 text-right">{financialInfo?.liquidAssets ? `BDT ${Number(financialInfo.liquidAssets).toLocaleString('en-IN', { minimumFractionDigits: 0 })}` : 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Tender Capacity</td>
                <td className="p-2 text-right">{financialInfo?.tenderCapacity ? `BDT ${Number(financialInfo.tenderCapacity).toLocaleString('en-IN', { minimumFractionDigits: 0 })}` : 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Minimum Year of Similar Work</td>
                <td className="p-2 text-right">{financialInfo?.yearofsimilarexperience || 'N/A'}</td>
              </tr>
              {financialInfo?.typesOfSimilarNature && financialInfo.typesOfSimilarNature.includes(" : ") ? (
                <>
                  <tr className="border-b">
                    <td className="p-2">Types of Similar Nature</td>
                    <td className="p-2 text-right">{financialInfo.typesOfSimilarNature.split(" : ")[0]}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Type of Similar Nature Value</td>
                    <td className="p-2 text-right">{financialInfo.typesOfSimilarNature.split(" : ")[1]}</td>
                  </tr>
                </>
              ) : (
                <tr className="border-b">
                  <td className="p-2">Types of Similar Nature</td>
                  <td className="p-2 text-right">{financialInfo?.typesOfSimilarNature || 'N/A'}</td>
                </tr>
              )}
              <tr className="border-b">
                <td className="p-2">JVCA</td>
                <td className="p-2 text-right">{financialInfo?.jvca || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">General Experience</td>
                <td className="p-2 text-right">{financialInfo?.generalExperience || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </Section>
      </div>


      {/* Part 5: Experience and Commitments */}
      <Section title="Part 5: Experience and Commitments">
        <div>
          <h4 className="font-semibold text-md mb-2 text-gray-600">(A) Completed Works (Last 5 years)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100"><tr>{["SL", "Name of Works", "Value", "Completion Date", "Certificate"].map(h => <th key={h} className="p-2 font-semibold">{h}</th>)}</tr></thead>
              <tbody>{data.part5.completedWorks.map(item => (<tr key={item.slNo} className="border-b"><td className="p-2">{item.slNo}</td><td className="p-2">{item.nameOfWork}</td><td className="p-2 font-mono text-right">{item.valueOfWork.toLocaleString('en-IN')}</td><td className="p-2">{item.completionDate}</td><td className="p-2 text-blue-600 cursor-pointer hover:underline">{item.certificateFile}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
        <div className="pt-4">
          <h4 className="font-semibold text-md mb-2 text-gray-600">(B) On-Going Works & Current Commitments</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100"><tr>{["SL", "Name of Works", "Value", "Award Date", "PE Name", "Agreement"].map(h => <th key={h} className="p-2 font-semibold">{h}</th>)}</tr></thead>
              <tbody>{data.part5.ongoingWorks.map(item => (<tr key={item.slNo} className="border-b"><td className="p-2">{item.slNo}</td><td className="p-2">{item.nameOfWork}</td><td className="p-2 font-mono text-right">{item.valueOfWork.toLocaleString('en-IN')}</td><td className="p-2">{item.awardDate}</td><td className="p-2">{item.peName}</td><td className="p-2 text-blue-600 cursor-pointer hover:underline">{item.agreementFile}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Activities Form */}
      <Section title="Activities Schedule">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100"><tr><th className="p-2 font-semibold">Activity</th><th className="p-2 font-semibold text-center">Start (Days from Possession)</th><th className="p-2 font-semibold text-center">Duration (Days)</th></tr></thead>
          <tbody>
            {data.activities.map((item, index) => (<tr key={index} className="border-b"><td className="p-2">{item.activity}</td><td className="p-2 text-center">{item.startDays}</td><td className="p-2 text-center">{item.durationDays}</td></tr>))}
          </tbody>
        </table>
      </Section>

    </div>
  );
};