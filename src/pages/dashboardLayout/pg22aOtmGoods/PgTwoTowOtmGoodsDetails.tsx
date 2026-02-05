// @ts-nocheck
import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect, useContext } from "react";
import { Filter, RefreshCw, Edit } from "lucide-react";
import useSingleData from "@/hooks/useSingleData";
import { TenderListTab } from "./TenderTabs/TenderListTab";
import { OngoingTenderTab } from "./TenderTabs/OngoingTenderTab";
import { TurnoverHistoryTab } from "./TenderTabs/TurnoverHistoryTab";
import { TenderCapacityTab } from "./TenderTabs/TenderCapacityTab";
import { CMSTab } from "./TenderTabs/CMSTab";
import { TenderInformationForm } from "./TenderTabs/Tender_Information_Form";
import { UpdateTenderInformationForm } from "./TenderTabs/Update_Tender_Information_Form";
import { TendererFormPreview } from "./TenderTabs/TendererFormPreview";
import { TendererFormPreview_ePW3_2 } from "./TenderTabs/TendererFormPreview_ePW3_2";
import { DownloadsTab } from "./TenderTabs/DownloadsTab";
import { STLCalculationTab } from "./TenderTabs/STLCalculationTab";
import useAllEgpListedCompanies from "@/hooks/useAllEgpListedCompany";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


const mockTenderData = [
  { financialYear: '2024-2025', tenderId: 'TND-001', packageNo: 'PKG-001', ministry: 'Ministry A', organization: 'Org A', division: 'Div A', descriptionOfWorks: 'Road Construction', commencementDate: '2024-01-15', contractPeriodExtendedUpTo: '2025-01-15', Status_Complite_ongoing: 'Ongoing', revisedContractValue: '5000000', paymentAmount: '3500000', jvShare: '70' },
  { financialYear: '2023-2024', tenderId: 'TND-002', packageNo: 'PKG-002', ministry: 'Ministry B', organization: 'Org B', division: 'Div B', descriptionOfWorks: 'Bridge Repair', commencementDate: '2023-03-20', contractPeriodExtendedUpTo: '2024-03-20', Status_Complite_ongoing: 'Completed', revisedContractValue: '3000000', paymentAmount: '4000000', jvShare: '100' },
  { financialYear: '2024-2025', tenderId: 'TND-003', packageNo: 'PKG-003', ministry: 'Ministry C', organization: 'Org C', division: 'Div C', descriptionOfWorks: 'Building Construction', commencementDate: '2024-05-10', contractPeriodExtendedUpTo: '2025-05-10', Status_Complite_ongoing: 'Ongoing', revisedContractValue: '8000000', paymentAmount: '1250000', jvShare: '50' },
  { financialYear: '2022-2023', tenderId: 'TND-004', packageNo: 'PKG-004', ministry: 'Ministry D', organization: 'Org D', division: 'Div D', descriptionOfWorks: 'Drainage System', commencementDate: '2022-07-01', contractPeriodExtendedUpTo: '2023-07-01', Status_Complite_ongoing: 'Completed', revisedContractValue: '2000000', paymentAmount: '8500000', jvShare: '90' },
  { financialYear: '2021-2022', tenderId: 'TND-005', packageNo: 'PKG-005', ministry: 'Ministry E', organization: 'Org E', division: 'Div E', descriptionOfWorks: 'Hospital Renovation', commencementDate: '2021-08-15', contractPeriodExtendedUpTo: '2022-08-15', Status_Complite_ongoing: 'Completed', revisedContractValue: '9000000', paymentAmount: '9500000', jvShare: '100' },
  { financialYear: '2020-2021', tenderId: 'TND-006', packageNo: 'PKG-006', ministry: 'Ministry F', organization: 'Org F', division: 'Div F', descriptionOfWorks: 'School Building', commencementDate: '2020-09-01', contractPeriodExtendedUpTo: '2021-09-01', Status_Complite_ongoing: 'Completed', revisedContractValue: '6000000', paymentAmount: '6000000', jvShare: '100' },
];



import useUsersCompanyMigration from "@/hooks/useUsersCompanyMigrations";
import { AuthContext } from "@/provider/AuthProvider";

// --- মেইন কম্পোনেন্ট ---
const PgTwoTowOtmGoodsDetails = () => {
  const { id } = useParams(); // This is now the MongoDB _id
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const [selectedContractIdForEdit, setSelectedContractIdForEdit] = useState(null);

  // Shared state for Tender Capacity inputs (for real-time preview updates)
  const [tdsRequiredFY, setTdsRequiredFY] = useState('');
  const [proposedProjectYear, setProposedProjectYear] = useState('');

  // 1. Fetch Tender Preparation Data by _id
  const tenderUrl = id ? `https://egpserver.jubairahmad.com/api/v1/tender-preparation/${id}` : null;
  const { data: currentTender, loading: tenderLoading, setReload: setTenderReload } = useSingleData(tenderUrl);

  // 1.1 Fetch Live Tender Data to get Liquid Assets Requirement (based on tenderId from preparation)
  const liveTenderUrl = currentTender?.tenderId ? `https://egpserver.jubairahmad.com/api/v1/tenders/tenderId/${currentTender.tenderId}` : null;
  const { data: liveTenderData } = useSingleData(liveTenderUrl);

  // Initialize shared state from database values
  useEffect(() => {
    if (currentTender) {
      if (currentTender.tdsYearFinancialCapacity && !tdsRequiredFY) {
        setTdsRequiredFY(String(currentTender.tdsYearFinancialCapacity));
      }
      if (currentTender.proposeYear && !proposedProjectYear) {
        setProposedProjectYear(String(currentTender.proposeYear));
      }
    }
  }, [currentTender]);

  const egpEmail = currentTender?.egpEmail || '';

  // Fetch user's company migrations to find the matching migration ID
  const { companyMigrations } = useUsersCompanyMigration(user?.email, "");

  // Find the company migration that matches the current egpEmail
  const companyMigration = useMemo(() => {
    if (!companyMigrations || !egpEmail) return null;
    return companyMigrations.find((migration) => migration.egpEmail === egpEmail);
  }, [companyMigrations, egpEmail]);

  // 2. Fetch EGP Listed Company data using the RESOLVED email
  // Only search if we actually have an email
  const { egpListedCompanies, loading: companyLoading } = useAllEgpListedCompanies(egpEmail || 'SKIP'); // Pass dummy string to prevent error if empty
  const companyData = egpListedCompanies?.[0];

  // Fetch contract information from API using companyId
  // This bypasses the company lookup in backend and queries directly by companyId
  const companyId = companyData?.companyUniqueEGP_ID;
  const contractUrl = companyId
    ? `https://egpserver.jubairahmad.com/api/v1/contract-information?companyId=${encodeURIComponent(companyId)}&limit=100`
    : null;
  const { data: contractData, loading: contractLoading, setReload: setContractReload } = useSingleData(contractUrl);


  // Filter for completed contracts only
  const completedContracts = useMemo(() => {
    if (!contractData || !Array.isArray(contractData)) return [];
    return contractData.filter(item => item.Status_Complite_ongoing?.toLowerCase() === 'completed');
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

    return completedContracts.filter(contract => {
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
    return contractData.filter(item => item.Status_Complite_ongoing?.toLowerCase() === 'ongoing');
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
        const strVal = String(val).replace(/,/g, '');
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
        const strVal = String(val).replace(/,/g, '');
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
        const amountFormatted = Number(yearAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        savedYears.push({
          period: yearName,
          amountCurrency: `BDT ${amountFormatted}`, // Assuming BDT for now as primary
          amountBDT: `BDT ${amountFormatted}`
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
    const tdsYears = Number(tdsRequiredFY) || Number(currentTender?.tdsYearFinancialCapacity) || Number(currentTender?.tdsYearFinancial) || 5;
    const proposeYear = Number(proposedProjectYear) || Number(currentTender?.proposeYear) || 1;
    const factor = 1.25;



    if (!yearlyTotals || yearlyTotals.length === 0) return 0;

    // Get max value from last N years
    const relevantYears = yearlyTotals
      .sort((a, b) => b.year.localeCompare(a.year))
      .slice(0, tdsYears);

    const valueA = Math.max(0, ...relevantYears.map(y => y.amount));
    const valueN = proposeYear;
    const valueB = totalOngoingCommitments;



    // Formula: (A × N × 1.25) - B
    const result = (valueA * valueN * factor) - valueB;


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
      const updateUrl = `https://egpserver.jubairahmad.com/api/v1/tender-preparation/${currentTender._id}`;
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
        />
      ),
    },
    {
      id: 1,
      name: "e-PW3-2 Preview",
      content: <TendererFormPreview_ePW3_2
        companyName={companyData?.companyName || currentTender?.egpCompanyName}
        egpEmail={companyData?.egpEmail || currentTender?.egpEmail}
        yearsOfGeneralExperience={companyData?.yearsOfGeneralExperience}
        turnoverData={turnoverData}
        tenderList={completedContracts} // Pass the completed contracts ("tender list summary")
        specificExperienceList={filteredSpecificExperience} // Pass filtered list for specific experience
        yearlyTotals={yearlyTotals}
        totalOngoingCommitments={totalOngoingCommitments}
        currentTender={{ ...currentTender, liquidAssets: liveTenderData?.liquidAssets || currentTender?.liquidAssets }}
        companyData={companyData}
        ongoingContracts={ongoingContracts}
      />,
    },
    {
      id: 2,
      name: "Turnover History",
      content: <TurnoverHistoryTab yearlyTotals={yearlyTotals} />,
    },
    {
      id: 3,
      name: "Tender Capacity",
      content: <TenderCapacityTab
        yearlyTotals={yearlyTotals}
        totalOngoingCommitments={totalOngoingCommitments}
        egpEmail={egpEmail}
        tdsRequiredFY={tdsRequiredFY}
        setTdsRequiredFY={setTdsRequiredFY}
        proposedProjectYear={proposedProjectYear}
        setProposedProjectYear={setProposedProjectYear}
      />,
    },
    {
      id: 4,
      name: "Tender List & Summary",
      content: <TenderListTab data={completedContracts} loading={contractLoading} />,
    },
    {
      id: 5,
      name: "Ongoing",
      content: <OngoingTenderTab data={ongoingContracts} loading={contractLoading} setReload={setContractReload} />,
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
          tenderId={ongoingContracts[0]?.tenderId || completedContracts[0]?.tenderId}
          descriptionOfWorks={currentTender?.descriptionOfWorks}
          turnoverData={turnoverData}
          currentTender={currentTender}
        />
      ),
    },
    {
      id: 7,
      name: "Mapping",
      content: (<div className="bg-green-50 p-4 rounded-lg"><h3 className="font-semibold text-green-800 mb-2">Mapping</h3></div>),
    },
    {
      id: 8,
      name: "BOQ",
      content: (<div className="bg-green-50 p-4 rounded-lg"><h3 className="font-semibold text-green-800 mb-2">Bill of Quantities</h3></div>),
    },
    {
      id: 9,
      name: "CMS",
      content: <CMSTab completedContracts={completedContracts} ongoingContracts={ongoingContracts} loading={contractLoading} setReload={setContractReload} setActiveTab={setActiveTab} onEditContract={handleEditContract} />,
    },
    {
      id: 10,
      name: "Add New Tender Info",
      content: <TenderInformationForm egpEmail={egpEmail} setReload={setContractReload} />,
    },
    {
      id: 11,
      name: "Update Tender Info",
      content: <UpdateTenderInformationForm egpEmail={egpEmail} preSelectedContractId={selectedContractIdForEdit} />,
    },
    {
      id: 12,
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
                    <Input readOnly value={companyData?.egpEmail || ''} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Company Name</Label>
                    <Input readOnly value={companyData?.companyName || ''} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Password</Label>
                    <Input readOnly value={companyData?.password || ''} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Bank Name</Label>
                    <Input readOnly value={companyData?.bankName} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Bank Address for Contact Details</Label>
                    <Input readOnly value={companyData?.bankAddress || 'N/A'} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Years of General Experience</Label>
                    <Input readOnly value={companyData?.yearsOfGeneralExperience || 'N/A'} className="bg-white" />
                  </div>
                </div>
              </div>

              {/* Legal & Authorization Documents Section */}
              <div className="space-y-4 pt-4">
                <div className="border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">Legal & Authorization Documents</h2>
                  <p className="text-sm text-gray-500">File names for required documents in eGP account</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Authorization Letter File Name</Label>
                    <Input readOnly value={companyData?.autho || ''} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">NID File Name</Label>
                    <Input readOnly value={companyData?.nid || ''} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">Trade Certificate File Name</Label>
                    <Input readOnly value={companyData?.trade || ''} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">TIN Certificate File Name</Label>
                    <Input readOnly value={companyData?.tin || ''} className="bg-white" />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-normal">VAT Certificate File Name</Label>
                    <Input readOnly value={companyData?.vat || ''} className="bg-white" />
                  </div>
                </div>
              </div>

              {/* Departmental Wise LTM Enlistment Certificate Section */}
              <div className="space-y-4 pt-4">
                <div className="border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">Departmental Wise LTM Enlistment Certificate</h2>
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
                      {companyData?.departmentLicenses && Object.keys(companyData.departmentLicenses).length > 0 ? (
                        Object.entries(companyData.departmentLicenses).map(([dept, value], index) => (
                          <tr key={index} className="bg-white hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{dept}</td>
                            <td className="px-4 py-3 text-gray-600">{value as string || 'N/A'}</td>
                          </tr>
                        ))
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
      id: 13,
      name: "STL Calculation",
      content: <STLCalculationTab />,
    },
  ];

  // Early Loading State for the initial resolution
  if (tenderLoading) {
    return <div className="p-10 flex justify-center text-lg text-gray-500">Resolving Tender Information...</div>;
  }

  if (!egpEmail && !tenderLoading) {
    return (
      <div className="p-10 flex flex-col items-center gap-4">
        <div className="text-red-500 text-xl font-semibold">Tender ID Not Found</div>
        <p className="text-gray-500">Could not find any tender with ID: {id}</p>
        <p className="text-sm text-gray-400">Debug Info: Search returned {currentTender ? "data" : "no data"}.</p>
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
          </div>
          <Button
            onClick={() => {
              setIsReloading(true);
              setContractReload(prev => prev + 1);
              setTenderReload(prev => prev + 1); // Also reload tender preparation data
              setTimeout(() => setIsReloading(false), 1000);
            }}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-1000 ${isReloading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reload Data</span>
          </Button>
        </div>

        <div className="border-b border-gray-200 mb-4 sm:mb-6">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
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
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{tabs.find(tab => tab.id === activeTab)?.name}</h2>
            <div key={activeTab}>
              {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PgTwoTowOtmGoodsDetails;