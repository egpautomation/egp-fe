// @ts-nocheck
import { config } from "@/lib/config";
import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect, useContext } from "react";
import { Filter, RefreshCw, Edit, Plus } from "lucide-react";
import useSingleData from "@/hooks/useSingleData";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { TenderListTab } from "./TenderTabs/TenderListTab";
import { OngoingTenderTab } from "./TenderTabs/OngoingTenderTab";
import { TurnoverHistoryTab } from "./TenderTabs/TurnoverHistoryTab";
import { TenderCapacityTab } from "./TenderTabs/TenderCapacityTab";
import { CMSTab } from "./TenderTabs/CMSTab";
import { TenderInformationForm } from "./TenderTabs/Tender_Information_Form";
import { UpdateTenderInformationForm } from "./TenderTabs/Update_Tender_Information_Form";
import { TendererFormPreview } from "./TenderTabs/TendererFormPreview";
import { TendererFormPreview_ePW3_2 } from "./TenderTabs/TendererFormPreview_ePW3_2";
import UpdateTenderDialog from "@/components/dashboard/UpdateTenderDialog";
import { DownloadsTab } from "./TenderTabs/DownloadsTab";
import { LineOfCreditTab } from "./TenderTabs/LineOfCreditTab";
import { STLCalculationTab } from "./TenderTabs/STLCalculationTab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const mockTenderData = [
  {
    financialYear: "2024-2025",
    tenderId: "TND-001",
    packageNo: "PKG-001",
    ministry: "Ministry A",
    organization: "Org A",
    division: "Div A",
    descriptionOfWorks: "Road Construction",
    commencementDate: "2024-01-15",
    contractPeriodExtendedUpTo: "2025-01-15",
    Status_Complite_ongoing: "Ongoing",
    revisedContractValue: "5000000",
    paymentAmount: "3500000",
    jvShare: "70",
  },
];

import useUsersCompanyMigration from "@/hooks/useUsersCompanyMigrations";
import { AuthContext } from "@/provider/AuthProvider";
import BOQTab from "./TenderTabs/BOQTab";

// --- মেইন কম্পোনেন্ট ---
const PgTwoTowOtmGoodsDetails = () => {
  const { id } = useParams(); // This is now the MongoDB _id
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const [selectedContractIdForEdit, setSelectedContractIdForEdit] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [isSubmittingBypass, setIsSubmittingBypass] = useState(false);

  // Shared state for Tender Capacity inputs (for real-time preview updates)
  // Shared state for Tender Capacity inputs (for real-time preview updates)
  const [tdsRequiredFY, setTdsRequiredFY] = useState("");
  const [tdsRequiredBestYear, setTdsRequiredBestYear] = useState("");
  const [proposedProjectYear, setProposedProjectYear] = useState("");

  // 1. Fetch Tender Preparation Data by _id
  const tenderUrl = id ? `${config.apiBaseUrl}/tender-preparation/${id}` : null;
  const {
    data: currentTender,
    loading: tenderLoading,
    setReload: setTenderReload,
  } = useSingleData(tenderUrl);

  // 1.1 Fetch Live Tender Data to get Liquid Assets Requirement (based on tenderId from preparation)
  const liveTenderUrl = currentTender?.tenderId
    ? `${config.apiBaseUrl}/tenders/tenderId/${currentTender.tenderId}`
    : null;
  const { data: liveTenderData, setReload: setLiveTenderReload } = useSingleData(liveTenderUrl);

  // Initialize shared state from database values
  useEffect(() => {
    if (currentTender) {
      if (currentTender.tdsYearFinancialCapacity && !tdsRequiredFY) {
        setTdsRequiredFY(String(currentTender.tdsYearFinancialCapacity));
      }
      if (currentTender.tdsYearBest && !tdsRequiredBestYear) {
        setTdsRequiredBestYear(String(currentTender.tdsYearBest));
      }
      if (currentTender.proposeYear && !proposedProjectYear) {
        setProposedProjectYear(String(currentTender.proposeYear));
      }
    }
  }, [currentTender]);

  const egpEmail = currentTender?.egpEmail || "";

  // Fetch user's company migrations to find the matching migration ID
  const { companyMigrations } = useUsersCompanyMigration(user?.email, "");

  // Find the company migration that matches the current egpEmail
  const companyMigration = useMemo(() => {
    if (!companyMigrations || !egpEmail) return null;
    return companyMigrations.find((migration) => migration.egpEmail === egpEmail);
  }, [companyMigrations, egpEmail]);

  // 2. Fetch EGP Listed Company data using the exact matching email
  const companyUrl = egpEmail
    ? `${config.apiBaseUrl}/egp-listed-company/get-by-mail?mail=${encodeURIComponent(egpEmail)}`
    : null;
  const { data: companyData, loading: companyLoading } = useSingleData(companyUrl);

  const companyDisplayName =
    companyData?.companyName || currentTender?.egpCompanyName || "Company Name";

  // Fetch contract information from API using egpEmail exclusively.
  // This enables cross-tender CMS universality by ensuring all contracts linked to this email are returned.
  const contractUrl = egpEmail
    ? `${config.apiBaseUrl}/contract-information?egpEmail=${encodeURIComponent(egpEmail)}&limit=1000`
    : null;
  const {
    data: contractData,
    loading: contractLoading,
    setReload: setContractReload,
  } = useSingleData(contractUrl);

  // Filter for completed contracts only
  const completedContracts = useMemo(() => {
    if (!contractData || !Array.isArray(contractData)) return [];
    return contractData.filter(
      (item) => item.Status_Complite_ongoing?.toLowerCase() === "completed"
    );
  }, [contractData]);

  // Filter for specific experience based on "Minimum Year of Similar Work"
  const filteredSpecificExperience = useMemo(() => {
    if (!completedContracts || completedContracts.length === 0) return [];

    // Get minimum years from live tender data
    const minYears = parseFloat(liveTenderData?.yearofsimilarexperience) || 0;

    // If no restriction (0 or undefined), show all
    if (minYears <= 0) return completedContracts;

    const allowedDays = minYears * 360;
    const today = new Date(); // Use current date

    return completedContracts.filter((contract) => {
      // Get completion date from contractPeriodExtendedUpTo
      const completionDateStr = contract.contractPeriodExtendedUpTo;
      if (!completionDateStr) return false; // Skip if no date

      const completionDate = new Date(completionDateStr);
      if (isNaN(completionDate.getTime())) return false; // Skip invalid dates

      // Calculate age in milliseconds
      const ageInMillis = today.getTime() - completionDate.getTime();

      // Convert to days (approximate)
      const ageInDays = ageInMillis / (1000 * 60 * 60 * 24);

      // Filter condition: Age must be less than or equal to allowed days
      // Meaning the work was completed *within* the last N years
      return ageInDays <= allowedDays;
    });
  }, [completedContracts, liveTenderData]);

  // Filter for ongoing contracts only
  const ongoingContracts = useMemo(() => {
    if (!contractData || !Array.isArray(contractData)) return [];
    return contractData.filter((item) => item.Status_Complite_ongoing?.toLowerCase() === "ongoing");
  }, [contractData]);

  // ধাপ ২: কম্পোনেন্টগুলোর মধ্যে ডেটা শেয়ার করার জন্য স্টেট তৈরি করুন
  // Calculate yearlyTotals directly for instant updates (no useEffect delay)
  const yearlyTotals = useMemo(() => {
    if (!completedContracts || !Array.isArray(completedContracts)) return [];

    const grouped = completedContracts.reduce((acc, tender) => {
      const year = tender.financialYear;
      if (!acc[year]) {
        acc[year] = 0;
      }
      // Safe parse helper
      const safeParse = (val) => {
        if (!val) return 0;
        const strVal = String(val).replace(/,/g, "");
        return parseFloat(strVal) || 0;
      };

      acc[year] += safeParse(tender.actualPaymentJvShare);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([year, amount]) => ({ year, amount }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }, [completedContracts]);
  // Calculate totalOngoingCommitments directly here to avoid rendering delays
  // "Professional approach": value is derived immediately from data, not waiting for child effects
  const totalOngoingCommitments = useMemo(() => {
    if (!ongoingContracts || !Array.isArray(ongoingContracts)) return 0;

    return ongoingContracts.reduce((acc, item) => {
      // Safe parse helper for this scope as well or reuse if moved out
      const safeParse = (val) => {
        if (!val) return 0;
        const strVal = String(val).replace(/,/g, "");
        return parseFloat(strVal) || 0;
      };

      const worksInHand = safeParse(item.WorksInHand);
      // Check for nYear in item, default to 0 if missing.
      // Note: OngoingTenderTab handled local state edits, but for instant load we use saved data.
      const nYearValue = parseFloat(item.nYear || 0);
      const worksInHandPerNYear = nYearValue > 0 ? worksInHand / nYearValue : 0;
      return acc + worksInHandPerNYear;
    }, 0);
  }, [ongoingContracts]);

  // Calculate mapping rows for document mapping table
  const mappingRows = useMemo(() => {
    if (!companyData) return [];

    const normalizeValue = (value) => {
      if (value === null || value === undefined || value === "") return "N/A";
      return String(value).trim() || "N/A";
    };

    const rows = [
      {
        mapList: "Trade Certificate",
        fileName: normalizeValue(companyData?.trade || companyData?.tradeCertificate),
      },
      { mapList: "TIN Certificate", fileName: normalizeValue(companyData?.tin) },
      {
        mapList: "TIN Return Certificate",
        fileName: normalizeValue(companyData?.tinReturnCertificate),
      },
      { mapList: "VAT Certificate", fileName: normalizeValue(companyData?.vat) },
      {
        mapList: "VAT Return Certificate",
        fileName: normalizeValue(companyData?.vatReturnCertificate),
      },
      { mapList: "Authorization Letter", fileName: normalizeValue(companyData?.autho) },
      { mapList: "NID", fileName: normalizeValue(companyData?.nid) },
      { mapList: "Equipment List", fileName: normalizeValue(companyData?.equipment) },
      { mapList: "Manpower List", fileName: normalizeValue(companyData?.manpower) },
      { mapList: "Audit Report", fileName: normalizeValue(companyData?.updateAuditReportFileName) },
    ];

    const departmentRows = Object.entries(companyData?.departmentLicenses || {}).map(
      ([dept, file]) => ({
        mapList: `${dept} License Certificate`,
        fileName: normalizeValue(file),
      })
    );

    // Get best years from turnover history (top years by amount)
    const bestYears = [...yearlyTotals]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map((y) => y.year);

    // Find contracts from best years and extract certificate file names
    const certificateRows = [];
    if (completedContracts && bestYears.length > 0) {
      bestYears.forEach((year) => {
        const yearContracts = completedContracts.filter(
          (contract) => contract.financialYear === year
        );

        yearContracts.forEach((contract, contractIndex) => {
          const wccFile = contract?.workCompletationCertificateFileName;
          const pcFile = contract?.paymentCertificateFileName;

          if (wccFile) {
            certificateRows.push({
              mapList: `Work Completion Certificate (${year} - ${contractIndex + 1})`,
              fileName: normalizeValue(wccFile),
            });
          }

          if (pcFile) {
            certificateRows.push({
              mapList: `Payment Certificate (${year} - ${contractIndex + 1})`,
              fileName: normalizeValue(pcFile),
            });
          }
        });
      });
    }

    return [...rows, ...departmentRows, ...certificateRows];
  }, [companyData, yearlyTotals, completedContracts]);

  // Prepare Turnover Data for Preview from SAVED tender preparation data
  const turnoverData = useMemo(() => {
    if (!currentTender) return [];

    const savedYears = [];
    const bestYearCount = currentTender.tdsYearBest || 0;

    // We only want to show up to "tdsYearBest" years if specified, otherwise show all available saved years up to 5
    // However, usually we just show what's saved in FinancialYearX slots.

    for (let i = 1; i <= 5; i++) {
      const yearName = currentTender[`FinancialYear${i}Name`];
      const yearAmount = currentTender[`FinancialYear${i}Amount`];

      if (yearName && yearAmount) {
        // Format roughly to match the mock data structure
        // Mock: { period: "2022-2023", amountCurrency: "USD 5,200,000", amountBDT: "BDT 546,000,000" }
        // We only have BDT amount in backend usually
        const amountFormatted = Number(yearAmount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        savedYears.push({
          period: yearName,
          amountCurrency: `BDT ${amountFormatted}`, // Assuming BDT for now as primary
          amountBDT: `BDT ${amountFormatted}`,
        });
      }
    }

    return savedYears;
  }, [currentTender]);

  // Calculate Final Assessed Tender Capacity directly (with real-time updates from shared state)
  const calculatedAssessedCapacity = useMemo(() => {
    // Use saved values if they exist, otherwise calculate from live data
    if (currentTender?.FinalAssessedTenderCapacity) {
      return currentTender.FinalAssessedTenderCapacity;
    }

    // Prioritize shared state (live input) over database values
    const tdsYears =
      Number(tdsRequiredFY) ||
      Number(currentTender?.tdsYearFinancialCapacity) ||
      Number(currentTender?.tdsYearFinancial) ||
      5;
    const proposeYear = Number(proposedProjectYear) || Number(currentTender?.proposeYear) || 1;
    const factor = 1.25;

    if (!yearlyTotals || yearlyTotals.length === 0) return 0;

    // Get max value from last N years
    const relevantYears = yearlyTotals
      .sort((a, b) => b.year.localeCompare(a.year))
      .slice(0, tdsYears);

    const valueA = Math.max(0, ...relevantYears.map((y) => y.amount));
    const valueN = proposeYear;
    const valueB = totalOngoingCommitments;

    // Formula: (A × N × 1.25) - B
    const result = valueA * valueN * factor - valueB;

    return result;
  }, [currentTender, yearlyTotals, totalOngoingCommitments, tdsRequiredFY, proposedProjectYear]);

  // Handle edit contract from CMS tab
  const handleEditContract = (contractId) => {
    setSelectedContractIdForEdit(contractId);
    setActiveTab(11); // Navigate to Update Tender Info tab
  };

  // Handle saving the selected Experience Contract
  const handleSaveExperienceContract = async (contractId) => {
    try {
      if (!currentTender?._id) return;
      const updateUrl = `${config.apiBaseUrl}/tender-preparation/${currentTender._id}`;
      // Patch the experienceContractId
      await fetch(updateUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceContractId: contractId }),
      });
      // Reload to reflect changes
      setTenderReload((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving experience contract:", error);
    }
  };

  const handleAddToBypass = async () => {
    setIsSubmittingBypass(true);
    try {
      const specificExp = completedContracts?.find(
        (c) => c._id === currentTender?.experienceContractId
      );

      const formatDateForExperience = (dateString: any) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return dateString;
          return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(date);
        } catch (e) {
          return dateString;
        }
      };

      const cleanTurnoverValue = (val: any) => {
        if (!val) return "";
        return String(val)
          .replace(/BDT\s?/gi, "")
          .replace(/,/g, "")
          .trim();
      };

      let calcActiveDate2 = "27";
      if (liveTenderData?.TentativeStartDate && liveTenderData?.TentativeCompletionDate) {
        const start = new Date(liveTenderData.TentativeStartDate);
        const end = new Date(liveTenderData.TentativeCompletionDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diffDays = Math.ceil(
            Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          );
          calcActiveDate2 = (diffDays - 3).toString();
        }
      }

      const payload = {
        invoice_no: String(currentTender?.jobOrder || ""),
        job_no: String(currentTender?.jobOrder || ""),
        tender_id: String(currentTender?.tenderId || ""),
        egp_email: companyData?.egpEmail || currentTender?.egpEmail || "",
        company_name: companyData?.companyName || "",
        password: companyData?.password || "",
        bank_name: companyData?.bankName || "",
        liquid_asset: String(liveTenderData?.liquidAssets || ""),
        active_date1: liveTenderData?.documentLastSelling || "7",
        active_date2: calcActiveDate2,
        company_address: companyData?.companyAddress || "",
        author: companyData?.autho || "",
        nid: companyData?.nid || "",
        trade_license: companyData?.trade || "",
        tin: companyData?.tin || "",
        vat: companyData?.vat || "",
        ltm_license:
          companyData?.departmentLicenses && Object.keys(companyData.departmentLicenses).length > 0
            ? "Yes"
            : "",
        other1_map: companyData?.other1Map || "",
        slno_line_credit: companyData?.slnoLineCredit || "",
        other2_map: companyData?.other2Map || "",
        whatsapp: companyData?.whatsapp || companyData?.mobileNumber || "",
        tin_return: companyData?.tinReturnCertificate || "",
        vat_return: companyData?.vatReturnCertificate || "",
        manpower: companyData?.manpower || "",
        equipment: companyData?.equipment || "",
        audit_report: companyData?.updateAuditReportFileName || "",

        structural_steel_works: "",
        pavement_asphalt_works: "",

        general_exp_year: String(companyData?.yearsOfGeneralExperience || ""),
        specific_contract_no: specificExp?.tenderId || "",
        specific_contract_name: specificExp?.descriptionOfWorks || "",
        specific_contract_role: specificExp?.jvShare
          ? parseFloat(specificExp.jvShare) === 100
            ? "Prime Contractor"
            : "Joint Venture Partner"
          : "",
        specific_award_date: formatDateForExperience(specificExp?.commencementDate),
        specific_completion_date: formatDateForExperience(specificExp?.contractPeriodExtendedUpTo),
        specific_contract_value: String(
          specificExp?.actualPayment || specificExp?.actualPaymentJvShare || ""
        ),
        specific_entity_details: specificExp?.organization || "",
        specific_description: specificExp?.descriptionOfWorks || "",

        year01_period: turnoverData[0]?.period || "",
        year01_amount_currency: cleanTurnoverValue(turnoverData[0]?.amountCurrency),
        year01_amount_bdt: cleanTurnoverValue(turnoverData[0]?.amountBDT),
        year02_period: turnoverData[1]?.period || "",
        year02_amount_currency: cleanTurnoverValue(turnoverData[1]?.amountCurrency),
        year02_amount_bdt: cleanTurnoverValue(turnoverData[1]?.amountBDT),
        year03_period: turnoverData[2]?.period || "",
        year03_amount_currency: cleanTurnoverValue(turnoverData[2]?.amountCurrency),
        year03_amount_bdt: cleanTurnoverValue(turnoverData[2]?.amountBDT),
        year04_period: turnoverData[3]?.period || "",
        year04_amount_currency: cleanTurnoverValue(turnoverData[3]?.amountCurrency),
        year04_amount_bdt: cleanTurnoverValue(turnoverData[3]?.amountBDT),
        year05_period: turnoverData[4]?.period || "",
        year05_amount_currency: cleanTurnoverValue(turnoverData[4]?.amountCurrency),
        year05_amount_bdt: cleanTurnoverValue(turnoverData[4]?.amountBDT),

        loc_no: "1",
        loc_source: companyData?.bankName || "",
        loc_amount: String(liveTenderData?.liquidAssets || ""),

        contact_details: companyData?.bankAddress || "",
        qualifications_experience: "",

        // Tender Capacity: compute from yearlyTotals (same logic as TendererFormPreview_ePW3_2 capacityInfo)
        tender_capacity_period: (() => {
          const tdsYears =
            Number(tdsRequiredFY) || Number(currentTender?.tdsYearFinancialCapacity) || 5;
          if (yearlyTotals && yearlyTotals.length > 0) {
            const relevantYears = [...yearlyTotals]
              .sort((a, b) => b.year.localeCompare(a.year))
              .slice(0, tdsYears);
            const maxYearData = relevantYears.reduce(
              (max, current) => (current.amount > max.amount ? current : max),
              relevantYears[0]
            );
            return maxYearData?.year || currentTender?.FinancialYearofMaximumvalue || "";
          }
          return currentTender?.FinancialYearofMaximumvalue || "";
        })(),
        tender_capacity_max_value: (() => {
          const tdsYears =
            Number(tdsRequiredFY) || Number(currentTender?.tdsYearFinancialCapacity) || 5;
          if (yearlyTotals && yearlyTotals.length > 0) {
            const relevantYears = [...yearlyTotals]
              .sort((a, b) => b.year.localeCompare(a.year))
              .slice(0, tdsYears);
            const maxValue = Math.max(0, ...relevantYears.map((y) => y.amount));
            if (maxValue > 0) return String(maxValue);
          }
          return String(currentTender?.Maximumvalue || "");
        })(),
        tender_capacity_remaining_value: String(calculatedAssessedCapacity || ""),

        user_email: user?.email || "", // Passing user email for coin deduction
      };

      const response = await axiosInstance.post("/otm-bypass-report", payload);
      if (response.data) {
        toast.success("Successfully added to Bypass Report");
      }
    } catch (error) {
      console.error("Error adding to bypass report:", error);
      toast.error("Failed to add to Bypass Report");
    } finally {
      setIsSubmittingBypass(false);
    }
  };

  const tabs = [
    {
      id: 0,
      name: "Tenderer Form Preview",
      content: (
        <TendererFormPreview
          liveTender={liveTenderData}
          completedContracts={filteredSpecificExperience} // Filtered list for the tables
          allHistoryContracts={completedContracts} // Unfiltered list for search/validation
          minYears={parseFloat(liveTenderData?.yearofsimilarexperience) || 0} // Min years for validation
          companyData={companyData}
          averageTurnover={currentTender?.AverageAnnualTurnover}
          assessedCapacity={calculatedAssessedCapacity}
          maxFinancialYear={currentTender?.FinancialYearofMaximumvalue}
          savedContractId={currentTender?.experienceContractId}
          onSave={handleSaveExperienceContract}
          financialInfo={liveTenderData}
        />
      ),
    },
    {
      id: 1,
      name: "e-PW3-2 Preview",
      content: (
        <TendererFormPreview_ePW3_2
          companyName={companyData?.companyName || currentTender?.egpCompanyName}
          egpEmail={companyData?.egpEmail || currentTender?.egpEmail}
          yearsOfGeneralExperience={companyData?.yearsOfGeneralExperience}
          turnoverData={turnoverData}
          tenderList={completedContracts} // Pass the completed contracts ("tender list summary")
          specificExperienceList={
            currentTender?.experienceContractId
              ? completedContracts.filter((c) => c._id === currentTender.experienceContractId)
              : []
          } // Pass only the confirmed contract for specific experience
          // specificExperienceList={filteredSpecificExperience}
          yearlyTotals={yearlyTotals}
          totalOngoingCommitments={totalOngoingCommitments}
          currentTender={{
            ...currentTender,
            liquidAssets: liveTenderData?.liquidAssets || currentTender?.liquidAssets,
          }}
          companyData={companyData}
          ongoingContracts={ongoingContracts}
          financialInfo={currentTender}
        />
      ),
    },
    {
      id: 2,
      name: "Turnover History",
      content: (
        <TurnoverHistoryTab
          yearlyTotals={yearlyTotals}
          tdsRequiredFY={tdsRequiredFY}
          setTdsRequiredFY={setTdsRequiredFY}
          tdsRequiredBestYear={tdsRequiredBestYear}
          setTdsRequiredBestYear={setTdsRequiredBestYear}
        />
      ),
    },
    {
      id: 3,
      name: "Tender Capacity",
      content: (
        <TenderCapacityTab
          yearlyTotals={yearlyTotals}
          totalOngoingCommitments={totalOngoingCommitments}
          egpEmail={egpEmail}
          tdsRequiredFY={tdsRequiredFY}
          setTdsRequiredFY={setTdsRequiredFY}
          proposedProjectYear={proposedProjectYear}
          setProposedProjectYear={setProposedProjectYear}
        />
      ),
    },
    {
      id: 4,
      name: "Tender List & Summary",
      content: <TenderListTab data={completedContracts} loading={contractLoading} />,
    },
    {
      id: 5,
      name: "Ongoing",
      content: (
        <OngoingTenderTab
          data={ongoingContracts}
          loading={contractLoading}
          setReload={setContractReload}
        />
      ),
    },
    {
      id: 6,
      name: "Downloads",
      content: (
        <DownloadsTab
          ongoingContracts={ongoingContracts}
          completedContracts={completedContracts}
          yearlyTotals={yearlyTotals}
          totalOngoingCommitments={totalOngoingCommitments}
          egpEmail={egpEmail}
          companyName={companyData?.companyName}
          tenderId={
            currentTender?.tenderId ||
            ongoingContracts[0]?.tenderId ||
            completedContracts[0]?.tenderId
          }
          descriptionOfWorks={currentTender?.descriptionOfWorks}
          turnoverData={turnoverData}
          currentTender={liveTenderData || currentTender}
          tdsRequiredFY={tdsRequiredFY}
          tdsRequiredBestYear={tdsRequiredBestYear}
        />
      ),
    },
    {
      id: 7,
      name: "Mapping",
      content: (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-4 sm:px-6 py-4">
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
              {companyDisplayName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Document Mapping Sheet</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="w-1/2 px-4 sm:px-6 py-3 text-left font-semibold text-slate-700">
                    Map List
                  </th>
                  <th className="w-1/2 px-4 sm:px-6 py-3 text-left font-semibold text-slate-700">
                    File Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {mappingRows.length > 0 ? (
                  mappingRows.map((row, index) => (
                    <tr
                      key={`${row.mapList}-${index}`}
                      className="border-b border-slate-200 odd:bg-white even:bg-slate-50/40"
                    >
                      <td className="px-4 sm:px-6 py-2.5 text-slate-800">{row.mapList}</td>
                      <td className="px-4 sm:px-6 py-2.5 text-slate-700 break-all">
                        {row.fileName}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 sm:px-6 py-10 text-center text-slate-500">
                      No mapping document found for this company.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      name: "STL Calculation",
      content: <STLCalculationTab />,
    },
    {
      id: 9,
      name: "BOQ",
      content: (
        <BOQTab
          procurementNature={currentTender?.procurementNature}
          egpEmail={egpEmail}
          procurementMethod={currentTender?.procurementMethod}
          tenderId={currentTender?.tenderId || ""}
        />
      ),
    },
    {
      id: 10,
      name: "CMS",
      content: (
        <CMSTab
          completedContracts={completedContracts}
          ongoingContracts={ongoingContracts}
          loading={contractLoading}
          setReload={setContractReload}
          setActiveTab={setActiveTab}
          onEditContract={handleEditContract}
        />
      ),
    },
    {
      id: 11,
      name: "Add New Tender Info",
      content: <TenderInformationForm egpEmail={egpEmail} setReload={setContractReload} />,
    },
    {
      id: 12,
      name: "Update Tender Info",
      content: (
        <UpdateTenderInformationForm
          egpEmail={egpEmail}
          preSelectedContractId={selectedContractIdForEdit}
        />
      ),
    },
    {
      id: 13,
      name: "Company Profile",
      content: (
        <div className="space-y-8 bg-white p-6 rounded-lg shadow-sm border">
          {/* Update Company Button */}
          {companyMigration?._id && (
            <div className="flex justify-end mb-4">
              <Link to={`/dashboard/update-company-migration/${companyMigration._id}`}>
                <Button className="flex items-center gap-2" variant="default">
                  <Edit className="w-4 h-4" />
                  Update Company Information
                </Button>
              </Link>
            </div>
          )}

          {companyLoading ? (
            <p className="text-gray-500">Loading company data...</p>
          ) : companyData ? (
            <>
              {/* Company Information Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">Company Information</h2>
                  <p className="text-sm text-gray-500">Basic company details and credentials</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-1 block text-sm font-normal">E-GP Email</Label>
                    <Input readOnly value={companyData?.egpEmail || ""} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Company Name</Label>
                    <Input readOnly value={companyData?.companyName || ""} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Password</Label>
                    <Input readOnly value={companyData?.password || ""} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Bank Name</Label>
                    <Input readOnly value={companyData?.bankName} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">
                      Bank Address for Contact Details
                    </Label>
                    <Input
                      readOnly
                      value={companyData?.bankAddress || "N/A"}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">
                      Years of General Experience
                    </Label>
                    <Input
                      readOnly
                      value={companyData?.yearsOfGeneralExperience || "N/A"}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Legal & Authorization Documents Section */}
              <div className="space-y-4 pt-4">
                <div className="border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    Legal & Authorization Documents
                  </h2>
                  <p className="text-sm text-gray-500">
                    File names for required documents in eGP account
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-1 block text-sm font-normal">
                      Authorization Letter File Name
                    </Label>
                    <Input readOnly value={companyData?.autho || ""} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">NID File Name</Label>
                    <Input readOnly value={companyData?.nid || ""} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">
                      Trade Certificate File Name
                    </Label>
                    <Input readOnly value={companyData?.trade || ""} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">
                      TIN Certificate File Name
                    </Label>
                    <Input readOnly value={companyData?.tin || ""} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">
                      VAT Certificate File Name
                    </Label>
                    <Input readOnly value={companyData?.vat || ""} className="bg-white" />
                  </div>
                </div>
              </div>

              {/* Departmental Wise LTM Enlistment Certificate Section */}
              <div className="space-y-4 pt-4">
                <div className="border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    Departmental Wise LTM Enlistment Certificate
                  </h2>
                  <p className="text-sm text-gray-500">Department-specific license information</p>
                </div>

                <div className="bg-white border rounded">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F9FAFB] text-gray-700 font-semibold border-b">
                      <tr>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Certificate File Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {companyData?.departmentLicenses &&
                      Object.keys(companyData.departmentLicenses).length > 0 ? (
                        Object.entries(companyData.departmentLicenses).map(
                          ([dept, value], index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{dept}</td>
                              <td className="px-4 py-3 text-gray-600">
                                {(value as string) || "N/A"}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                            No department licenses found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No company data found for this email.</p>
          )}
        </div>
      ),
    },
    {
      id: 15,
      name: "Line of Credit",
      content: (
        <LineOfCreditTab
          currentTender={currentTender}
          egpEmail={egpEmail}
          companyData={companyData}
          companyMigration={companyMigration}
          liveTender={liveTenderData}
        />
      ),
    },
  ];

  // Early Loading State for the initial resolution
  if (tenderLoading) {
    return (
      <div className="p-10 flex justify-center text-lg text-gray-500">
        Resolving Tender Information...
      </div>
    );
  }

  if (!egpEmail && !tenderLoading) {
    return (
      <div className="p-10 flex flex-col items-center gap-4">
        <div className="text-red-500 text-xl font-semibold">Tender ID Not Found</div>
        <p className="text-gray-500">Could not find any tender with ID: {id}</p>
        <p className="text-sm text-gray-400">
          Debug Info: Search returned {currentTender ? "data" : "no data"}.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div>
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Tender Preparation Details</h1>
            <h3 className="text-base sm:text-lg text-gray-600 mt-1">Id: {id}</h3>
            {currentTender?.tenderId && (
              <h3 className="text-base sm:text-lg text-gray-600 mt-1">
                Tender ID: {currentTender.tenderId}
              </h3>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setIsReloading(true);
                setContractReload((prev) => prev + 1);
                setTenderReload((prev) => prev + 1); // Also reload tender preparation data
                setTimeout(() => setIsReloading(false), 1000);
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 transition-transform duration-1000 ${isReloading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Reload Data</span>
            </Button>
            <Button
              onClick={() => setUpdateDialogOpen(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              Update Tender Info
            </Button>
            <Button
              onClick={handleAddToBypass}
              variant="default"
              size="sm"
              disabled={isSubmittingBypass}
              className="flex items-center gap-2"
            >
              {isSubmittingBypass ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isSubmittingBypass ? "Adding..." : "Add to By Pass Report"}
            </Button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-4 sm:mb-6">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              {tabs.find((tab) => tab.id === activeTab)?.name}
            </h2>
            <div key={activeTab}>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
          </div>
        </div>
      </div>
      {liveTenderData && (
        <UpdateTenderDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          tenderId={liveTenderData._id}
          initialData={{
            turnoverAmount: liveTenderData.turnoverAmount,
            liquidAssets: liveTenderData.liquidAssets,
            tenderCapacity: liveTenderData.tenderCapacity,
            yearofsimilarexperience: liveTenderData.yearofsimilarexperience,
            typesOfSimilarNature: liveTenderData.typesOfSimilarNature,
            jvca: liveTenderData.jvca,
          }}
          onSuccess={() => {
            setTenderReload((prev) => prev + 1);
            setContractReload((prev) => prev + 1);
            setLiveTenderReload((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default PgTwoTowOtmGoodsDetails;
