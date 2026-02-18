// @ts-nocheck
import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

// --- Mock Data ---
const mockPreviewData = {
  tendererInfo: {
    name: "N/A",
    email: "N/A",
  },
  jointVentureActivities: [
    {
      element: "Structural Steel Works",
      description: "Fabrication and erection of structural steel framework for bridge construction"
    },
    {
      element: "Pavement and Asphalt Works",
      description: "Road surfacing, asphalt laying, and pavement construction activities"
    },
  ],
  qualificationInfo: {
    generalExperience: "15 years of experience in construction works including roads, bridges, and building construction projects across Bangladesh"
  },
  specificExperience: [
    {
      contractNo: "CN-2021-045",
      name: "Construction of Padma Bridge Approach Road (South)",
      role: "Prime Contractor",
      awardDate: "15-Jan-2021",
      completionDate: "31-Dec-2023",
      totalValue: "BDT 450,000,000",
      procuringEntity: "Bangladesh Bridge Authority Setu Bhaban, Banani, Dhaka-1213 Tel/Fax: +880 2 9870334 Email: info@bba.gov.bd",
      briefDescription: "4-lane approach road construction with drainage system and minor structures with length 8.5 km"
    },
    {
      contractNo: "CN-2020-128",
      name: "Dhaka-Mymensingh Highway Widening Project",
      role: "Joint Venture Partner",
      awardDate: "10-Mar-2020",
      completionDate: "20-Aug-2022",
      totalValue: "BDT 320,000,000",
      procuringEntity: "Roads and Highways Department Sarak Bhaban, Tejgaon, Dhaka-1215 Tel/Fax: +880 2 8181234 Email: rhd@rhd.gov.bd",
      briefDescription: "Highway widening from 2-lane to 4-lane, including pavement works and road safety features"
    },
  ],
  // Part 3A - Option 1
  turnoverOption1: [
    { period: "2022-2023", amountCurrency: "USD 5,200,000", amountBDT: "BDT 546,000,000" },
    { period: "2021-2022", amountCurrency: "USD 4,800,000", amountBDT: "BDT 504,000,000" },
    { period: "2020-2021", amountCurrency: "USD 4,200,000", amountBDT: "BDT 441,000,000" },
  ],
  // Part 3B - Option 2
  turnoverOption2: [
    {
      sl: "1",
      period: "2022-2023",
      tenderId: "TND-2022-456",
      receivedDate: "25-Mar-2022",
      grossAmount: "BDT 180,000,000",
      paymentReceived: "BDT 162,000,000 (30%)",
      turnover: "BDT 113,400,000"
    },
    {
      sl: "2",
      period: "2022-2023",
      tenderId: "TND-2022-789",
      receivedDate: "10-Aug-2022",
      grossAmount: "BDT 220,000,000",
      paymentReceived: "BDT 198,000,000 (0%)",
      turnover: "BDT 198,000,000"
    },
    {
      sl: "3",
      period: "2021-2022",
      tenderId: "TND-2021-234",
      receivedDate: "15-Jan-2021",
      grossAmount: "BDT 150,000,000",
      paymentReceived: "BDT 150,000,000 (20%)",
      turnover: "BDT 75,000,000"
    },
  ],
  // Part 4
  liquidAssets: [
    { no: "1", source: "Bank Credit Line - AB Bank Limited", amount: "200000000" },
  ],
  contactDetails: "AB Bank Limited, Corporate Branch, Gulshan-1, Dhaka-1212. Contact Person: Mr. Rahman Ahmed, Manager Corporate Banking. Tel: +880-2-9876543, Fax: +880-2-9876544, Email: corporate@abbank.com.bd",
  keyPersonnel: [
    { name: "Engr. Mohammad Karim", position: "Project Manager", generalExp: "18 years", specificExp: "12 years" },
    { name: "Engr. Fatima Rahman", position: "Site Engineer", generalExp: "10 years", specificExp: "7 years" },
    { name: "Md. Ashraful Islam", position: "Quality Control Manager", generalExp: "15 years", specificExp: "10 years" },
  ],
  // Part 5
  equipment: [
    { item: "Excavator (Hydraulic, 20 Ton)", condition: "New", ownership: "State owner" },
    { item: "Bulldozer (CAT D8T)", condition: "Good", ownership: "Owned" },
    { item: "Concrete Mixer (10 CFT)", condition: "New", ownership: "to be purchased" },
    { item: "Asphalt Paver Machine", condition: "Good", ownership: "Leased" },
    { item: "Road Roller (12 Ton)", condition: "Excellent", ownership: "Owned" },
  ],
  // Subcontractor Information
  subcontractor: {
    name: "Specialized Steel Works Ltd.",
    email: "contact@specializedsteel.com",
  },
  subcontractorActivities: [
    { srNo: "1", element: "Structural Steel Fabrication", description: "Fabrication and installation of steel framework for bridges and buildings" },
    { srNo: "2", element: "Welding and Joining Works", description: "High-quality welding services for structural components" },
  ],
  subcontractorContracts: [
    {
      slNo: "1",
      nameAndYear: "Karnaphuli Bridge Steel Works",
      value: "BDT 85,000,000",
      procuringEntity: "Bangladesh Bridge Authority",
      contactPerson: "Mr. Kamal Hossain, +880-2-9876543",
      typeOfWork: "Steel Fabrication"
    },
  ],
  // Personnel Information
  personnelData: [
    {
      position: "Site Manager",
      candidateType: "Prime",
      name: "Engr. Abdul Mannan",
      dob: "12/05/1978",
      generalExp: "20 years",
      nationalId: "19780512345678901",
      employmentYears: "8 years",
      qualifications: "B.Sc. in Civil Engineering, PMP Certified, LEED AP"
    },
    {
      position: "Quality Control Engineer",
      candidateType: "Prime",
      name: "Engr. Nasrin Akter",
      dob: "25/08/1985",
      generalExp: "12 years",
      nationalId: "19850825345678902",
      employmentYears: "5 years",
      qualifications: "B.Sc. in Civil Engineering, Quality Management Certification"
    },
  ],
  // Present Employment
  presentEmployment: [
    {
      firmName: "N/A",
      address: "N/A",
      yearsWithEntity: "8 years",
      tel: "+880-2-9876543",
      fax: "+880-2-9876544",
      email: "N/A",
      lineManager: "Mr. Rahman Ahmed, Project Director"
    },
    {
      firmName: "N/A",
      address: "House 45, Road 12, Banani, Dhaka-1213",
      yearsWithEntity: "5 years",
      tel: "+880-2-9876543",
      fax: "+880-2-9876544",
      email: "N/A",
      lineManager: "Engr. Karim Hossain, Senior Engineer"
    },
  ],
  // Professional Experience
  professionalExperience: [
    {
      srNo: "1",
      from: "2018",
      to: "2023",
      companyProjectPosition: "N/A",
      project: "Padma Bridge Approach Road",
      position: "Site Manager",
      relevantExperience: "Managed construction of 8.5 km 4-lane approach road including drainage systems, minor structures, and quality control"
    },
    {
      srNo: "2",
      from: "2015",
      to: "2018",
      companyProjectPosition: "ABC Construction Ltd. / Dhaka Elevated Expressway / Assistant Site Engineer",
      project: "Dhaka Elevated Expressway",
      position: "Assistant Site Engineer",
      relevantExperience: "Supervised structural works, coordinated with subcontractors, and ensured compliance with safety standards"
    },
    {
      srNo: "3",
      from: "2012",
      to: "2015",
      companyProjectPosition: "XYZ Engineering / Karnaphuli Tunnel Project / Junior Engineer",
      project: "Karnaphuli Tunnel Project",
      position: "Junior Engineer",
      relevantExperience: "Assisted in tunnel construction activities, material testing, and site documentation"
    },
  ],
  // Tenderer's Capacity Information
  capacityInfo: [
    { period: "2022-2023", maxValue: "BDT 450,000,000", remainingValue: "BDT 120,000,000" },
    { period: "2021-2022", maxValue: "BDT 380,000,000", remainingValue: "BDT 85,000,000" },
    { period: "2020-2021", maxValue: "BDT 320,000,000", remainingValue: "BDT 60,000,000" },
  ],
  // Ongoing Works
  ongoingWorks: [
    {
      slNo: "1",
      tidRefNo: "TND-2023-789",
      contractAmount: "BDT 280,000,000",
      dateOfNOA: "15-Jan-2023",
      intendedCompletion: "31-Dec-2024",
      peOrganization: "Local Government Engineering Department (LGED)",
      paymentReceived: "BDT 168,000,000",
      remainingValue: "BDT 112,000,000",
      uploadContract: "contract_789.pdf"
    },
    {
      slNo: "2",
      tidRefNo: "TND-2023-456",
      contractAmount: "BDT 150,000,000",
      dateOfNOA: "10-Mar-2023",
      intendedCompletion: "30-Jun-2024",
      peOrganization: "Roads and Highways Department",
      paymentReceived: "BDT 105,000,000",
      remainingValue: "BDT 45,000,000",
      uploadContract: "contract_456.pdf"
    },
  ],
  // Ongoing Works - JV Partner
  ongoingWorksJVPartner: [
    {
      slNo: "1",
      tidRefNo: "TND-2023-321",
      contractAmount: "BDT 350,000,000",
      tendererPortion: "40%",
      dateOfNOA: "20-Feb-2023",
      intendedCompletion: "31-Aug-2024",
      peOrganization: "Bangladesh Water Development Board",
      paymentReceived: "BDT 140,000,000",
      remainingValue: "BDT 210,000,000",
      uploadContract: "contract_jv_321.pdf"
    },
  ],
  // Ongoing Works - JV (as Sole Tenderer)
  ongoingWorksJVSole: [
    {
      slNo: "1",
      jvPartnerName: "Not Applicable",
      tidRefNo: "Not Applicable",
      contractAmount: "Not Applicable",
      dateOfNOA: "Not Applicable",
      intendedCompletion: "Not Applicable",
      peOrganization: "Not Applicable",
      paymentReceived: "Not Applicable",
      remainingValue: "Not Applicable",
      uploadContract: "Not Applicable"
    },
  ],
  // Ongoing Works - JV Information
  ongoingWorksJVInfo: [
    {
      slNo: "1",
      jvPartnerName: "Not Applicable",
      tidRefNo: "Not Applicable",
      contractAmount: "Not Applicable",
      tendererPortion: "Not Applicable",
      dateOfNOA: "Not Applicable",
      intendedCompletion: "Not Applicable",
      peOrganization: "Not Applicable",
      paymentReceived: "Not Applicable",
      remainingValue: "Not Applicable",
      uploadContract: "Not Applicable"
    },
  ],
  // Activities Form
  activitiesForm: [
    {
      srNo: "1",
      activityName: "Repair of Protective Wall on River Karnaphuli",
      description: "Repair of protective wall structure along 2.5 km stretch",
      physicalProgress: "100%",
      sectionalName: "Repair of Protective Wall on River Karnaphuli",
      duration: "180 days",
      activityDuration: "6 months"
    },
    {
      srNo: "2",
      activityName: "Road Pavement Works",
      description: "Asphalt laying and road surface preparation",
      physicalProgress: "75%",
      sectionalName: "Main Road Section A",
      duration: "120 days",
      activityDuration: "4 months"
    },
  ],
  // Environmental and Social Specifications
  esSpecifications: {
    description: "The Tenderer shall submit comprehensive and concise Environmental, Social, Health and Safety Management Strategies and Implementation Plan (ES-MSIP), as required by ITT Sub-Clause 26 to 29 and 37.1 of the General Conditions of Contract. These strategies and plans shall describe in detail the actions, materials, equipment, management processes etc. that will be implemented by the contractor, and where applicable, by its Subcontractor, to address the strategies and plans. The Tenderer shall have regard to the ES provisions of the contract including those as may be more fully described in the Works Requirements in General Conditions of Contract.",
    response: "I Agree - We commit to developing and implementing comprehensive Environmental, Social, Health and Safety Management Strategies in full compliance with ITT Sub-Clause 26 to 29 and 37.1 of the General Conditions of Contract. Our ES-MSIP will detail all necessary actions, materials, equipment, and management processes to ensure environmental protection, social responsibility, and workplace safety throughout the project lifecycle."
  },
};

// --- Copyable Cell Component ---
const CopyableCell = ({ value, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value || '');
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <td
      className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 border border-gray-300 cursor-pointer hover:bg-blue-50 transition-colors group relative ${className}`}
      onClick={handleCopy}
    >
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        <span className="flex-1 break-words">{value || 'N/A'}</span>
        {copied ? (
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
        ) : (
          <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </td>
  );
};

// --- Main Preview Component ---
export const TendererFormPreview_ePW3_2 = ({ companyName, egpEmail, yearsOfGeneralExperience, turnoverData, tenderList, specificExperienceList, yearlyTotals, totalOngoingCommitments, currentTender, companyData, ongoingContracts }) => {
  // 1. Get years from Part 3A (turnoverData)
  const part3AYears = (turnoverData && turnoverData.length > 0)
    ? turnoverData.map(item => item.period)
    : mockPreviewData.turnoverOption1.map(item => item.period);

  // 2. Filter tenderList (Part 3B source) based on finding that year in Part 3A
  //    Mapping: 
  //    - Period or Year -> financialYear
  //    - Tender ID -> tenderId
  //    - Received Date -> commencementDate (or logic for NOA date)
  //    - Gross Amount -> revisedContractValue
  //    - Payment Received -> paymentAmount
  //    - Turnover -> paymentAmount (assuming turnover for specific project matches payment received in this context, or needs calculation)

  const processedPart3B = (tenderList && tenderList.length > 0)
    ? tenderList
      .filter(item => part3AYears.includes(item.financialYear))
      .map((item, index) => ({
        sl: (index + 1).toString(),
        period: item.financialYear,
        tenderId: item.tenderId,
        packageNo: item.packageNo || 'N/A',
        procuringEntity: item.organization || item.ministry || 'N/A',
        description: (item.descriptionOfWorks && item.descriptionOfWorks.length > 100)
          ? `${item.descriptionOfWorks.substring(0, 100)}...`
          : (item.descriptionOfWorks || 'N/A'),
        jvShare: item.jvShare ? `${item.jvShare}%` : 'N/A',
        status: item.Status_Complite_ongoing || 'N/A',
        paymentAmount: item.paymentAmount
          ? (() => {
            const raw = item.paymentAmount.toString().replace(/BDT/gi, "").replace(/,/g, "").trim();
            const val = parseFloat(raw);
            return !isNaN(val) ? `BDT ${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
          })()
          : 'N/A',
      }))
    : mockPreviewData.turnoverOption2; // Fallback if no real data passed

  // 3. Process Capacity Information from yearlyTotals and totalOngoingCommitments
  // Find the year with maximum value (A) and show only that row
  const capacityInfo = (yearlyTotals && yearlyTotals.length > 0)
    ? (() => {
      // Find the year with maximum amount
      const maxYearData = yearlyTotals.reduce((max, current) =>
        current.amount > max.amount ? current : max
        , yearlyTotals[0]);

      return [{
        period: maxYearData.year,
        maxValue: maxYearData.amount.toFixed(2),
        remainingValue: totalOngoingCommitments.toFixed(2)
      }];
    })()
    : mockPreviewData.capacityInfo;

  // 4. Process Liquid Assets (Part 4)
  const liquidAssets = currentTender?.liquidAssets
    ? [{
      no: "1",
      source: companyData?.bankName ? `Bank Credit Line - ${companyData.bankName}` : "Bank Credit Line",
      amount: currentTender.liquidAssets.toString()
    }]
    : mockPreviewData.liquidAssets;

  // 5. Process Ongoing Works - Filter by JV Share
  // (A) Sole Tenderer: JV Share = 100%
  // (B) JV Partner: JV Share < 100%
  const processOngoingWorks = (contracts) => {
    if (!contracts || contracts.length === 0) return { soleTenderer: [], jvPartner: [] };

    // Helper to format date to dd/MM/yyyy
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid
        return new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(date);
      } catch (e) {
        return dateString;
      }
    };

    const soleTenderer = contracts
      .filter(item => {
        const jvShare = parseFloat(item.jvShare) || 0;
        return jvShare === 100;
      })
      .map((item, index) => ({
        slNo: (index + 1).toString(),
        tidRefNo: item.tenderId || 'N/A',
        contractAmount: item.revisedContractValue ? `BDT ${item.revisedContractValue.toLocaleString('en-IN')}` : 'N/A',
        dateOfNOA: formatDate(item.commencementDate),
        intendedCompletion: formatDate(item.contractPeriodExtendedUpTo),
        peOrganization: item.organization || item.ministry || 'N/A',
        paymentReceived: item.paymentAmount ? `BDT ${item.paymentAmount.toLocaleString('en-IN')}` : 'N/A',
        remainingValue: item.WorksInHand ? `BDT ${item.WorksInHand.toLocaleString('en-IN')}` : 'N/A',
        workCompletionCertificate: item.workCompletationCertificateFileName || 'N/A',
        paymentCertificate: item.paymentCertificateFileName || 'N/A',
        uploadContract: 'Attached in Map'
      }));

    const jvPartner = contracts
      .filter(item => {
        const jvShare = parseFloat(item.jvShare) || 0;
        return jvShare > 0 && jvShare < 100;
      })
      .map((item, index) => ({
        slNo: (index + 1).toString(),
        tidRefNo: item.tenderId || 'N/A',
        contractAmount: item.revisedContractValue ? `BDT ${item.revisedContractValue.toLocaleString('en-IN')}` : 'N/A',
        tendererPortion: item.jvShare ? `${item.jvShare}%` : 'N/A',
        dateOfNOA: formatDate(item.commencementDate),
        intendedCompletion: formatDate(item.contractPeriodExtendedUpTo),
        peOrganization: item.organization || item.ministry || 'N/A',
        paymentReceived: item.paymentAmount ? `BDT ${item.paymentAmount.toLocaleString('en-IN')}` : 'N/A',
        remainingValue: item.WorksInHand ? `BDT ${item.WorksInHand.toLocaleString('en-IN')}` : 'N/A',
        workCompletionCertificate: item.workCompletationCertificateFileName || 'N/A',
        paymentCertificate: item.paymentCertificateFileName || 'N/A',
        uploadContract: 'Attached in Map'
      }));

    return { soleTenderer, jvPartner };
  };

  const { soleTenderer: ongoingWorksSole, jvPartner: ongoingWorksJVPartner } = processOngoingWorks(ongoingContracts);

  // Helper to format date safely
  const formatDateForExperience = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Process Specific Experience from tenderList (Completed Contracts)
  const experienceSource = specificExperienceList || tenderList;

  // Logic: 
  // 1. If specificExperienceList is explicitly passed (even if empty array), we use it. 
  //    If it's empty, we show empty (don't fallback to mock).
  // 2. If specificExperienceList is NOT passed, we use tenderList.
  // 3. Fallback to mock data ONLY if we are using the default flow (tenderList) AND it is empty.

  const shouldUseMock = specificExperienceList !== undefined ? false : (!tenderList || tenderList.length === 0);

  const processedSpecificExperience = (!shouldUseMock && experienceSource)
    ? experienceSource.map(item => ({
      contractNo: item.tenderId || 'N/A',
      name: item.descriptionOfWorks ? (item.descriptionOfWorks.length > 50 ? item.descriptionOfWorks.substring(0, 50) + "..." : item.descriptionOfWorks) : 'N/A',
      role: parseFloat(item.jvShare) === 100 ? "Prime Contractor" : "Joint Venture Partner",
      awardDate: formatDateForExperience(item.commencementDate),
      completionDate: formatDateForExperience(item.contractPeriodExtendedUpTo),
      totalValue: item.revisedContractValue ? `BDT ${Number(item.revisedContractValue.toString().replace(/,/g, '')).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A',
      procuringEntity: item.organization || item.ministry || 'N/A',
      briefDescription: item.descriptionOfWorks || 'N/A'
    }))
    : (shouldUseMock ? mockPreviewData.specificExperience : []);


  const data = {
    ...mockPreviewData,
    tendererInfo: {
      ...mockPreviewData.tendererInfo,
      name: companyName || mockPreviewData.tendererInfo.name,
      email: egpEmail || mockPreviewData.tendererInfo.email,
    },
    qualificationInfo: {
      ...mockPreviewData.qualificationInfo,
      generalExperience: yearsOfGeneralExperience ? `${yearsOfGeneralExperience} years of experience in construction works` : mockPreviewData.qualificationInfo.generalExperience,
    },
    specificExperience: processedSpecificExperience,
    turnoverOption1: (turnoverData && turnoverData.length > 0) ? turnoverData : mockPreviewData.turnoverOption1,
    turnoverOption2: processedPart3B,
    capacityInfo: capacityInfo,
    liquidAssets: liquidAssets,
    keyPersonnel: [
      { name: "Attached In Map", position: "Attached In Map", generalExp: "Attached In Map", specificExp: "Attached In Map" }
    ],
    equipment: [
      { item: "Attached In Map", condition: "New", ownership: "Company" }
    ],
    subcontractorActivities: [
      { srNo: "1", element: "N/A", description: "N/A" }
    ],
    subcontractorContracts: [
      { slNo: "1", nameAndYear: "N/A", value: "N/A", procuringEntity: "N/A", contactPerson: "N/A", typeOfWork: "N/A" }
    ],
    personnelData: [
      {
        position: "File Attached In Map",
        candidateType: "File Attached In Map",
        name: "File Attached In Map",
        dob: "File Attached In Map",
        generalExp: "File Attached In Map",
        nationalId: "File Attached In Map",
        employmentYears: "File Attached In Map",
        qualifications: "File Attached In Map"
      }
    ],
    presentEmployment: [
      {
        firmName: "File Attached In Map",
        address: "File Attached In Map",
        yearsWithEntity: "File Attached In Map",
        tel: "File Attached In Map",
        fax: "File Attached In Map",
        email: "File Attached In Map",
        lineManager: "File Attached In Map"
      }
    ],
    professionalExperience: [
      {
        srNo: "1",
        from: "File Attached In Map",
        to: "File Attached In Map",
        companyProjectPosition: "File Attached In Map",
        project: "File Attached In Map",
        position: "File Attached In Map",
        relevantExperience: "File Attached In Map"
      }
    ],
    activitiesForm: [
      {
        srNo: "1",
        activityName: "Mobilization and Site Preparation",
        description: "Initial setup, machinery mobilization, and site clearance",
        physicalProgress: "100%",
        sectionalName: "N/A",
        duration: "3", // Activity Date 1 logic (Default 3)
        activityDuration: (() => {
          // Activity Date 2 logic
          const startDate = currentTender?.TentativeStartDate;
          const endDate = currentTender?.TentativeCompletionDate;

          if (!startDate || !endDate) {
            return "30"; // default
          }

          const start = new Date(startDate);
          const end = new Date(endDate);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return "30"; // fallback
          }

          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const calculated = diffDays - 3;
          return calculated > 0 ? calculated.toString() : "30";
        })(),
      }
    ],
    esSpecifications: {
      ...mockPreviewData.esSpecifications,
      response: "I Agree"
    },
    // Override mock data with real filtered ongoing works
    ongoingWorks: ongoingWorksSole.length > 0 ? ongoingWorksSole : mockPreviewData.ongoingWorks,
    ongoingWorksJVPartner: ongoingWorksJVPartner.length > 0 ? ongoingWorksJVPartner : mockPreviewData.ongoingWorksJVPartner,
  };

  return (
    <div className="w-full min-h-screen">
      {/* Responsive Container - Full Width */}
      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* ========== PART 1 ========== */}

        {/* Main Header - Part 1 - Responsive */}
        <Collapsible className="mb-4 sm:mb-6 group">
          <CollapsibleTrigger className="w-full">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg mb-0 shadow-md flex items-center justify-between transition-all duration-300 hover:bg-blue-700">
              <h2 className="text-sm sm:text-base md:text-lg font-bold">
                Tenderer Information Form (e-PW2A-2/e-PW2A-3) - Part - 1
              </h2>
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Section 1: Eligibility Information - Responsive */}
              <Collapsible className="w-full group/sub">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
                      1. Eligibility Information of the Tenderer (ITT Clauses 5 & 27)
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/sub:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  {/* Responsive Table Wrapper */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                            Description
                          </th>
                          <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                            Tenderer's Response
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <CopyableCell value="1.1 Name of the Tenderer / JVCA Partner:" />
                          <CopyableCell value={data.tendererInfo.name} />
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <CopyableCell value="1.2 Registered e-mail ID of the Tenderer / JVCA Partner:" />
                          <CopyableCell value={data.tendererInfo.email} />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Section: Key Activities for Joint Venture */}
              <Collapsible className="w-full border-t border-gray-300 group/jv">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                        Key Activity(ies) for Joint Venture (e-PW2A-3)
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 break-words">
                        1.4 Key Activity(ies) for which it is intended to be joint ventured, if it can be specified (ITT Sub Clause 17.2)
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 flex-shrink-0 ml-2 transition-transform duration-300 group-data-[state=open]/jv:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-1/3">
                          Elements of Activity
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-2/3">
                          Brief description of Activity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.jointVentureActivities.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <CopyableCell value={item.element} />
                          <CopyableCell value={item.description} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ========== PART 2 ========== */}

        {/* Main Header - Part 2 */}
        <Collapsible className="mb-4 sm:mb-6 mt-6 sm:mt-8 group/part2">
          <CollapsibleTrigger className="w-full">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg shadow-md flex items-center justify-between transition-all duration-300 hover:bg-blue-700">
              <h2 className="text-sm sm:text-base md:text-lg font-bold">
                Tenderer Information Form (e-PW2A-2/e-PW2A-3) - Part - 2
              </h2>
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]/part2:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Section 2: Qualification Information */}
              <Collapsible className="w-full group/qual">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      2. Qualification Information of the Tenderer (ITT Clause 29)
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/qual:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-1/2">
                          Description
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-1/2">
                          Tenderer's Response
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <CopyableCell value="2.1 Name of the Tenderer / JVCA Partner:" />
                        <CopyableCell value={data.tendererInfo.name} />
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <CopyableCell value="2.2 Registered e-mail ID of the Tenderer / JVCA Partner:" />
                        <CopyableCell value={data.tendererInfo.email} />
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <CopyableCell value="2.3 General Experience in Construction Works of Tenderer: (State years of experience)" />
                        <CopyableCell value={data.qualificationInfo.generalExperience} />
                      </tr>
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

              {/* Section 2.4: Specific Experience */}
              <Collapsible className="w-full border-t border-gray-300 group/spec">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      2.4 Specific Experience in Construction Works of Tenderer
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/spec:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    {/* Pagination Logic */}
                    {(() => {
                      const itemsPerPage = 5;
                      const [currentPage, setCurrentPage] = useState(1);
                      const totalItems = data.specificExperience.length;
                      const totalPages = Math.ceil(totalItems / itemsPerPage);

                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const currentItems = data.specificExperience.slice(startIndex, startIndex + itemsPerPage);

                      return (
                        <>
                          <table className="w-full border-collapse min-w-max">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                                  Contract No
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                                  Name of Contract
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                                  Role in Contract
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                                  Award date
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                                  Completion date
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                                  total Contract Value
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                                  Procuring Entity Name Address Id / fax e-mail
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                                  brief description
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <CopyableCell value={item.contractNo} />
                                  <CopyableCell value={item.name} />
                                  <CopyableCell value={item.role} />
                                  <CopyableCell value={item.awardDate} />
                                  <CopyableCell value={item.completionDate} />
                                  <CopyableCell value={item.totalValue} />
                                  <CopyableCell value={item.procuringEntity} />
                                  <CopyableCell value={item.briefDescription} />
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Pagination Controls */}
                          {totalPages > 1 && (
                            <div className="flex justify-between items-center py-3 px-4 bg-gray-50 border-t border-gray-200">
                              <span className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                  disabled={currentPage === 1}
                                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 text-sm border rounded ${currentPage === page
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-white border-gray-300 hover:bg-gray-100'
                                      }`}
                                  >
                                    {page}
                                  </button>
                                ))}
                                <button
                                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                  disabled={currentPage === totalPages}
                                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ========== PART 3A ========== */}

        {/* Main Header - Part 3A */}
        <Collapsible className="mb-4 sm:mb-6 mt-6 sm:mt-8 group/part3a">
          <CollapsibleTrigger className="w-full">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg shadow-md flex items-center justify-between transition-all duration-300 hover:bg-blue-700">
              <h2 className="text-sm sm:text-base md:text-lg font-bold">
                Tenderer Information Form (e-PW2A-2/e-PW2A-3) - Part - 3A
              </h2>
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]/part3a:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Section 2.5: Average annual construction turnover - Option 1 */}
              <Collapsible className="w-full group/opt1">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                        2.5 Average annual construction turnover
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">2.5.1 Option 1</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/opt1:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Period or Year
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Amount and Currency
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Amount in Equivalent BDT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.turnoverOption1.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <CopyableCell value={item.period} />
                          <CopyableCell value={item.amountCurrency} />
                          <CopyableCell
                            value={item.amountBDT
                              ?.toString()
                              .replace(/BDT/gi, "")
                              .replace(/,/g, "")
                              .trim()}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ========== PART 3B ========== */}

        {/* Main Header - Part 3B */}
        <Collapsible className="mb-4 sm:mb-6 mt-6 sm:mt-8 group/part3b">
          <CollapsibleTrigger className="w-full">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg shadow-md flex items-center justify-between transition-all duration-300 hover:bg-blue-700">
              <h2 className="text-sm sm:text-base md:text-lg font-bold">
                Tenderer Information Form (e-PW2A-2/e-PW2A-3) - Part - 3B
              </h2>
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]/part3b:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Section 2.5: Average annual construction turnover - Option 2 */}
              <Collapsible className="w-full group/opt2">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                        2.5 Average annual construction turnover
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">2.5.2 Option 2</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/opt2:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            S. No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Tender ID
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Package No
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Procuring Entity
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 w-64 min-w-[200px]">
                            Description of Works
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            JV Share (%)
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Payment Amount
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.turnoverOption2.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <CopyableCell value={item.sl} className="text-xs" />
                            <CopyableCell value={item.tenderId} className="text-xs" />
                            <CopyableCell value={item.packageNo} className="text-xs" />
                            <CopyableCell value={item.procuringEntity} className="text-xs" />
                            <CopyableCell value={item.description} className="text-xs" />
                            <CopyableCell value={item.jvShare} className="text-xs" />
                            <CopyableCell value={item.paymentAmount} className="text-xs" />
                            <CopyableCell value={item.status} className="text-xs" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ========== PART 4 ========== */}

        {/* Main Header - Part 4 */}
        <Collapsible className="mb-4 sm:mb-6 mt-6 sm:mt-8 group/part4">
          <CollapsibleTrigger className="w-full">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg shadow-md flex items-center justify-between transition-all duration-300 hover:bg-blue-700">
              <h2 className="text-sm sm:text-base md:text-lg font-bold">
                Tenderer Information Form (e-PW2A-2/e-PW2A-3) - Part - 4
              </h2>
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]/part4:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Section 2.6: Liquid assets */}
              <Collapsible className="w-full group/liquid">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                        2.6 Liquid assets available to meet the construction cash flow
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Liquid assets available to meet the construction cash flow (ITT Sub Clause: 14.1(c))
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/liquid:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-20">
                          No.
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Source of Financing
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Amount Available
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.liquidAssets.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <CopyableCell value={item.no} />
                          <CopyableCell value={item.source} />
                          <CopyableCell value={item.amount} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

              {/* Section 2.7: Contact Details */}
              <Collapsible className="w-full border-t border-gray-300 group/contact">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                        2.7 Contact Details
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 break-words">
                        Contact Details (ITT Sub Clause 29.1 (e))
                      </p>
                      <p className="text-xs text-gray-600 mt-1 break-words">
                        Name, address, and other contact details of Tenderer's Bankers and other Procuring Entity(s) that may provide references, if contacted by the Procuring Entity
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/contact:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-1/3">
                          Description
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-2/3">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <CopyableCell value="Bank Address for Contact Details" />
                        <CopyableCell value={companyData?.bankAddress || 'N/A'} />
                      </tr>
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

              {/* Section 2.8: Key Personnel */}
              <Collapsible className="w-full border-t border-gray-300 group/personnel">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                        2.8 Qualifications and experience of key technical and administrative personnel proposed for Contract administration and management
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Qualifications and experience of key technical and administrative personnel proposed for Contract administration and management (ITT Sub Clause 29.1(c))
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/personnel:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Name
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Position
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Years of General Experience
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Years of Specific Experience
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.keyPersonnel.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <CopyableCell value={item.name} />
                          <CopyableCell value={item.position} />
                          <CopyableCell value={item.generalExp} />
                          <CopyableCell value={item.specificExp} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ========== PART 5 ========== */}

        {/* Main Header - Part 5 */}
        <Collapsible className="mb-4 sm:mb-6 mt-6 sm:mt-8 group/part5">
          <CollapsibleTrigger className="w-full">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg shadow-md flex items-center justify-between transition-all duration-300 hover:bg-blue-700">
              <h2 className="text-sm sm:text-base md:text-lg font-bold">
                Tenderer Information Form (e-PW2A-2/e-PW2A-3) - Part - 5
              </h2>
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]/part5:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Section 2.9: Equipment */}
              <Collapsible className="w-full group/equip">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      2.9 Major Construction Equipment proposed to carry out the Contract (ITT Sub Clause 29.1(f))
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/equip:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Item of Equipment
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Condition
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Owned, leased or to be purchased
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.equipment.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <CopyableCell value={item.item} />
                          <CopyableCell value={item.condition} />
                          <CopyableCell value={item.ownership} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ========== SUBCONTRACTOR INFORMATION ========== */}

        {/* Subcontractor Header - Green */}
        <Collapsible className="mb-4 sm:mb-6 mt-6 sm:mt-8 group/subcon">
          <CollapsibleTrigger className="w-full">
            <div className="bg-green-100 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg border-l-4 border-green-600 flex items-center justify-between transition-all duration-300 hover:bg-green-200">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-green-800">
                Subcontractor Information (Form e-PW2A-4)
              </h2>
              <ChevronDown className="h-5 w-5 text-green-800 transition-transform duration-300 group-data-[state=open]/subcon:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Subcontractor Eligibility Information */}
              <Collapsible className="w-full group/subelig">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      Eligibility Information of the Subcontractor (ITT Clauses 5 & 27)
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/subelig:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-24">
                          Sr. No.
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Description
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Tenderer's Response
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <CopyableCell value="1." />
                        <CopyableCell value="Name of the Subcontractor:" />
                        <CopyableCell value="N/A" />
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <CopyableCell value="2." />
                        <CopyableCell value="Registered e-mail ID of the Subcontractor:" />
                        <CopyableCell value="N/A" />
                      </tr>
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

              {/* Section 2.1: Key Activities for Subcontracting */}
              <Collapsible className="w-full border-t border-gray-300 group/subact">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      2.1 Key Activity(ies) for which it is intended to be Subcontracted (ITT Sub Clause 18.1)
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/subact:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-24">
                          Sr. No.
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Elements of Activity
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                          Brief description of Activity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.subcontractorActivities.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <CopyableCell value={item.srNo} />
                          <CopyableCell value={item.element} />
                          <CopyableCell value={item.description} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CollapsibleContent>
              </Collapsible>

              {/* Section 2.2: List of Similar Contracts */}
              <Collapsible className="w-full border-t border-gray-300 group/subcont">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      2.2 List of Similar Contracts in which the proposed Subcontractor had been engaged
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/subcont:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            SL No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Name of Contract and Year of Execution
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Value of Contract
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Name of Procuring Entity
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Contact Person and contact details
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Type of Work performed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.subcontractorContracts.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <CopyableCell value={item.slNo} className="text-xs" />
                            <CopyableCell value={item.nameAndYear} className="text-xs" />
                            <CopyableCell value={item.value} className="text-xs" />
                            <CopyableCell value={item.procuringEntity} className="text-xs" />
                            <CopyableCell value={item.contactPerson} className="text-xs" />
                            <CopyableCell value={item.typeOfWork} className="text-xs" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ========== PERSONNEL INFORMATION ========== */}

        {/* Personnel Header - Green */}
        <Collapsible className="mb-4 sm:mb-6 mt-6 sm:mt-8 group/personnel">
          <CollapsibleTrigger className="w-full">
            <div className="bg-green-100 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg border-l-4 border-green-600 flex items-center justify-between transition-all duration-300 hover:bg-green-200">
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-green-800">
                  Personnel Information (Form e-PW2A-5)
                </h2>
                <p className="text-xs sm:text-sm text-green-700 mt-1">
                  [This form should be completed for each person proposed by the Tenderer in Form e-PW2A-2 & e-PW2A-3, where applicable]
                </p>
              </div>
              <ChevronDown className="h-5 w-5 text-green-800 transition-transform duration-300 group-data-[state=open]/personnel:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Personnel Proposed Position and Personal Data */}
              <Collapsible className="w-full group/pos">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      Proposed Position and Personal Data
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/pos:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Proposed Position
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Proposed Candidate (Prime/Partner)
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Date of Birth
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Years of general experience
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            National ID Number
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Years of employment with the Tenderer
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Professional Qualifications
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.personnelData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <CopyableCell value={item.position} className="text-xs" />
                            <CopyableCell value={item.candidateType} className="text-xs" />
                            <CopyableCell value={item.name} className="text-xs" />
                            <CopyableCell value={item.dob} className="text-xs" />
                            <CopyableCell value={item.generalExp} className="text-xs" />
                            <CopyableCell value={item.nationalId} className="text-xs" />
                            <CopyableCell value={item.employmentYears} className="text-xs" />
                            <CopyableCell value={item.qualifications} className="text-xs" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Present Employment Section */}
              <Collapsible className="w-full border-t border-gray-300 group/present">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      Present Employment [to be completed only if not employed by the Tenderer]
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/present:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Name of Firm or Entity (working under)
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Address of Firm or Entity (working under)
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Years with present Procuring Entity
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Tel No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Fax No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            e-mail address
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Line manager/personnel officer
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.presentEmployment.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <CopyableCell value={item.firmName} className="text-xs" />
                            <CopyableCell value={item.address} className="text-xs" />
                            <CopyableCell value={item.yearsWithEntity} className="text-xs" />
                            <CopyableCell value={item.tel} className="text-xs" />
                            <CopyableCell value={item.fax} className="text-xs" />
                            <CopyableCell value={item.email} className="text-xs" />
                            <CopyableCell value={item.lineManager} className="text-xs" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Professional Experience Section */}
              <Collapsible className="w-full border-t border-gray-300 group/profexp">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                        Professional Experience
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Summarize professional experience over the last twenty years, in reverse chronological order. Indicate particular technical and managerial experience relevant to the project.
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/profexp:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Sr No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            From
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            To
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Company / Project / Position / Relevant technical and managerial experience
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Project
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Position
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Relevant technical and managerial experience
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.professionalExperience.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <CopyableCell value={item.srNo} className="text-xs" />
                            <CopyableCell value={item.from} className="text-xs" />
                            <CopyableCell value={item.to} className="text-xs" />
                            <CopyableCell value={item.companyProjectPosition} className="text-xs" />
                            <CopyableCell value={item.project} className="text-xs" />
                            <CopyableCell value={item.position} className="text-xs" />
                            <CopyableCell value={item.relevantExperience} className="text-xs" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ========== TENDERER'S CAPACITY INFORMATION ========== */}

        {/* Capacity Header - Green */}
        <div className="bg-green-100 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg mb-0 mt-6 sm:mt-8 border-l-4 border-green-600">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-green-800">
            Tenderer's Capacity Information (Form e-PW2A-6)
          </h2>
        </div>

        {/* Capacity Information Table */}
        <div className="border border-gray-300 mb-4 sm:mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                  Period
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                  Maximum Value of Works performed in one year within last 5 Years from IFT date
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300">
                  Value of Remaining Works or Current Commitment
                </th>
              </tr>
            </thead>
            <tbody>
              {data.capacityInfo.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <CopyableCell value={item.period} />
                  <CopyableCell value={item.maxValue} />
                  <CopyableCell value={item.remainingValue} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========== ONGOING WORKS ========== */}

        {/* Ongoing Works Header - Green */}
        <Collapsible className="mb-4 sm:mb-6 mt-6 sm:mt-8 group/ongoing">
          <CollapsibleTrigger className="w-full">
            <div className="bg-green-100 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg border-l-4 border-green-600 flex items-center justify-between transition-all duration-300 hover:bg-green-200">
              <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-green-800">
                List of On-Going Works / Current Commitment Under any Organization as a Sole Tenderer (If Tenderer participated as individual) - (Form e-PW2A-6A)
              </h2>
              <ChevronDown className="h-5 w-5 text-green-800 transition-transform duration-300 group-data-[state=open]/ongoing:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border border-t-0 border-gray-300">

              {/* Ongoing Works Section */}
              <Collapsible className="w-full group/ongoinga">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      (A) List of On-Going Works / Current Commitment Under any Organization as a Sole Tenderer (If Tenderer participated as individual)
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/ongoinga:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            SL No. Ref No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            TID or Ref. No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Contract Amount
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Date of issuance of NOA / Signing of Contract
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Work Completion Date of contract
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Name of the PE & its Organization
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Payment Received
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Value of remaining Works/Current Commitment (I-J-7)
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Work Completion Certificate File Name/NOA
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Payment Certificate File Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.ongoingWorks.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <CopyableCell value={item.slNo} className="text-xs" />
                            <CopyableCell value={item.tidRefNo} className="text-xs" />
                            <CopyableCell value={item.contractAmount} className="text-xs" />
                            <CopyableCell value={item.dateOfNOA} className="text-xs" />
                            <CopyableCell value={item.intendedCompletion} className="text-xs" />
                            <CopyableCell value={item.peOrganization} className="text-xs" />
                            <CopyableCell value={item.paymentReceived} className="text-xs" />
                            <CopyableCell value={item.remainingValue} className="text-xs" />
                            <CopyableCell value={item.workCompletionCertificate} className="text-xs" />
                            <CopyableCell value={item.paymentCertificate} className="text-xs" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Section (B): JV Partner Ongoing Works */}
              <Collapsible className="w-full border-t border-gray-300 group/ongoingb">
                <CollapsibleTrigger className="w-full">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
                      (B) List of On-Going Works / Current Commitment Under any Organization as JV Partner (If Tenderer participated as individual)
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/ongoingb:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            SL No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            TID or Ref. No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Contract Amount
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Tenderer's portion in the contract amount
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Date of issuance of NOA/ Signing of Contract
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Work Completion Date of contract
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Name of the PE & its Organization
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Payment Received as JV Partner
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Value of remaining Works/Current Commitment 9=(I-8)
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Work Completion Certificate File Name/NOA
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                            Payment Certificate File Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.ongoingWorksJVPartner.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <CopyableCell value={item.slNo} className="text-xs" />
                            <CopyableCell value={item.tidRefNo} className="text-xs" />
                            <CopyableCell value={item.contractAmount} className="text-xs" />
                            <CopyableCell value={item.tendererPortion} className="text-xs" />
                            <CopyableCell value={item.dateOfNOA} className="text-xs" />
                            <CopyableCell value={item.intendedCompletion} className="text-xs" />
                            <CopyableCell value={item.peOrganization} className="text-xs" />
                            <CopyableCell value={item.paymentReceived} className="text-xs" />
                            <CopyableCell value={item.remainingValue} className="text-xs" />
                            <CopyableCell value={item.workCompletionCertificate} className="text-xs" />
                            <CopyableCell value={item.paymentCertificate} className="text-xs" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* ========== ONGOING WORKS - JV ========== */}

      {/* Ongoing Works JV Header - Green */}
      <div className="bg-green-100 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg mb-0 mt-6 sm:mt-8 border-l-4 border-green-600">
        <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-green-800">
          List of On-Going Works / Current Commitment Under any Organization as a Sole Tenderer (If Tenderer participated as JV) - (Form e-PW2A-6A)
        </h2>
      </div>

      {/* Section (A): JV Sole Tenderer */}
      <div className="border border-gray-300 mb-4 sm:mb-6">
        <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
            (A) List of On-Going Works / Current Commitment Under any Organization as a Sole Tenderer (If Tenderer participated as JV)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  SL No.
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  JV Partner Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  TID or Ref. No.
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Contract Amount
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Date of issuance of NOA/ Signing of Contract
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Work Completion Date of contract
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Name of the PE & its Organization
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Payment Received
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Value of remaining Works/Current Commitment 9=(I-8)
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Upload Contract Agreement /NOA
                </th>
              </tr>
            </thead>
            <tbody>
              {data.ongoingWorksJVSole.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <CopyableCell value={item.slNo} className="text-xs" />
                  <CopyableCell value={item.jvPartnerName} className="text-xs" />
                  <CopyableCell value={item.tidRefNo} className="text-xs" />
                  <CopyableCell value={item.contractAmount} className="text-xs" />
                  <CopyableCell value={item.dateOfNOA} className="text-xs" />
                  <CopyableCell value={item.intendedCompletion} className="text-xs" />
                  <CopyableCell value={item.peOrganization} className="text-xs" />
                  <CopyableCell value={item.paymentReceived} className="text-xs" />
                  <CopyableCell value={item.remainingValue} className="text-xs" />
                  <CopyableCell value={item.uploadContract} className="text-xs" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section (B): JV Information */}
      <div className="border border-gray-300 mb-4 sm:mb-6">
        <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
            (B) List of On-Going Works / Current Commitment Under any Organization for JV Information (If Tenderer participated as JV)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  SL No.
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  JV Partner Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  TID or Ref. No.
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Contract Amount
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Tenderer's portion in the contract amount
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Date of issuance of NOA/ Signing of Contract
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Work Completion Date of contract
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Name of the PE & its Organization
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Payment Received as JV Partner
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Value of remaining Works/ Current Commitment 10=(5-9)
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Upload Contract Agreement /NOA
                </th>
              </tr>
            </thead>
            <tbody>
              {data.ongoingWorksJVInfo.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <CopyableCell value={item.slNo} className="text-xs" />
                  <CopyableCell value={item.jvPartnerName} className="text-xs" />
                  <CopyableCell value={item.tidRefNo} className="text-xs" />
                  <CopyableCell value={item.contractAmount} className="text-xs" />
                  <CopyableCell value={item.tendererPortion} className="text-xs" />
                  <CopyableCell value={item.dateOfNOA} className="text-xs" />
                  <CopyableCell value={item.intendedCompletion} className="text-xs" />
                  <CopyableCell value={item.peOrganization} className="text-xs" />
                  <CopyableCell value={item.paymentReceived} className="text-xs" />
                  <CopyableCell value={item.remainingValue} className="text-xs" />
                  <CopyableCell value={item.uploadContract} className="text-xs" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== ACTIVITIES FORM ========== */}

      {/* Activities Form Header - Green */}
      <div className="bg-green-100 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg mb-0 mt-6 sm:mt-8 border-l-4 border-green-600">
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-green-800">
          Activities Form
        </h2>
      </div>

      {/* Activities Form Section */}
      <div className="border border-gray-300 mb-4 sm:mb-6">
        <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
            Activities Form
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Sr. No.
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Activity Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Description
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Physical Progress (%)
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Sectional Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Duration of Activity Start and End [Insert days from Commencement Date]
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                  Activity Duration (In Days)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.activitiesForm.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <CopyableCell value={item.srNo} className="text-xs" />
                  <CopyableCell value={item.activityName} className="text-xs" />
                  <CopyableCell value={item.description} className="text-xs" />
                  <CopyableCell value={item.physicalProgress} className="text-xs" />
                  <CopyableCell value={item.sectionalName} className="text-xs" />
                  <CopyableCell value={item.duration} className="text-xs" />
                  <CopyableCell value={item.activityDuration} className="text-xs" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== ENVIRONMENTAL AND SOCIAL SPECIFICATIONS ========== */}

      {/* ES Specifications Header - Green */}
      <div className="bg-green-100 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg mb-0 mt-6 sm:mt-8 border-l-4 border-green-600">
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-green-800">
          Environmental and Social (ES) Specifications
        </h2>
      </div>

      {/* ES Specifications Section */}
      <div className="border border-gray-300 mb-4 sm:mb-6">
        <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 break-words">
            Environmental and Social Aspects
          </h3>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-1/2">
                ES Specifications
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 w-1/2">
                Tenderer's Response
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <CopyableCell value={data.esSpecifications.description} className="align-top" />
              <CopyableCell value={data.esSpecifications.response} className="align-top" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};