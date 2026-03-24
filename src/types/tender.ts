/**
 * TypeScript interfaces for Tender-related data models
 * Based on backend MongoDB schemas from egp-be
 */

// ============================================
// Tender Model (Live Tenders from CPTU)
// Source: models/Tender.js
// ============================================

export interface TenderCategory {
  subCategory: string;
  value: string;
}

export interface Tender {
  _id: string;
  tenderId: number;
  procurementType?: string;
  procurementNature?: string;
  procurementMethod?: string;
  tenderStatus?: string;
  officialDesignation?: string;
  ministry?: string;
  organization?: string;
  division?: string;
  procuringEntityName?: string;
  locationDistrict?: string;
  ProjectName?: string;
  sourceOfFunds?: string;
  packageNo?: string;
  tenderCategory?: string;
  selectedTenderCategory?: string;
  descriptionOfWorks?: string;
  publicationDateTime?: string;
  documentLastSelling?: string;
  openingDateTime?: string;
  documentPrice?: string | number;
  tenderSecurity?: string | number;
  estimatedCost?: string | number;
  typesOfSimilarNature?: string;
  yearofsimilarexperience?: string;
  generalExperience?: string;
  jvca?: string;
  similarNatureWork?: string;
  turnoverAmount?: string | number;
  liquidAssets?: string | number;
  tenderCapacity?: string | number;
  workingLocation?: string;
  department?: string;
  InvitationReferenceNo?: string;
  ProjectCode?: string;
  TentativeStartDate?: string;
  TentativeCompletionDate?: string;
  NameofOfficialInviting?: string;
  Address?: string;
  City?: string;
  Thana?: string;
  District?: string;
  LtmLicenseNameCode?: string;
  ActivitytotalDays?: string;
  contentOfTender?: string;
  financialCriteria?: string;
  tds?: string;
  procuringEntityCode?: string;
  appId?: number;
  budgetType?: string;
  identificationOfLot?: string;
  qualityCriteria?: string;
  tds_01?: string;
  tds_03?: string;
  tds_05?: string;
  tds_06?: string;
  tds_07?: string;
  tds_08?: string;
  tds_09?: string;
  tds_10?: string;
  tds_12?: string;
  tds_14?: string;
  tds_15?: string;
  tds_18?: string;
  tds_21?: string;
  scope_title?: string;
  scope_intro?: string;
  scope_details?: string;
  tender_subCategories?: string;
  tenderCategories?: TenderCategory[];
  doc_list_title?: string;
  doc_list_intro?: string;
  doc_list_details?: string;
  eligibilityOfTenderDocument?: string;
  development_partner?: string;
  skip?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// TenderPreparation Model
// Source: models/TenderPreparation.js
// ============================================

export type TenderType = "OTM Goods" | "OTM Works";
export type LineOfCreditStatus = "Yes" | "No";
export type TenderPreparationStatus = "under_preparation" | "wait_for_submit" | "submitted" | "archived";

export interface TenderPreparation {
  _id: string;
  egpEmail?: string;
  egpCompanyName?: string;
  userMail?: string;
  tenderId?: number;
  tenderType?: TenderType;
  tenderMethod?: string;
  openingDateTime?: string;
  jobOrder?: number;
  experienceContractId?: string | null;
  
  // Financial Year Data
  FinancialYear1Name?: string;
  FinancialYear1Amount?: number;
  FinancialYear2Name?: string;
  FinancialYear2Amount?: number;
  FinancialYear3Name?: string;
  FinancialYear3Amount?: number;
  FinancialYear4Name?: string;
  FinancialYear4Amount?: number;
  FinancialYear5Name?: string;
  FinancialYear5Amount?: number;
  AverageAnnualTurnover?: number;
  
  // TDS Year Fields
  tdsYearFinancial?: string;
  tdsYearBest?: string;
  tdsYearFinancialCapacity?: string;
  proposeYear?: string;
  
  // Maximum Value & Capacity Fields
  FinancialYearofMaximumvalue?: string;
  Maximumvalue?: number;
  FinalAssessedTenderCapacity?: number;
  
  // Line of Credit and Pay Order Status
  lineOfCredit?: LineOfCreditStatus;
  payOrderStatus?: "Yes" | "No";
  
  status?: TenderPreparationStatus;
  organization?: string;
  descriptionOfWorks?: string;
  locationDistrict?: string;
  documentLastSelling?: string;
  procurementType?: string;
  procurementNature?: string;
  procurementMethod?: string;
  createdDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// ContractInformation Model
// Source: models/ContractInfoSchema.js
// ============================================

export type ContractStatus = "ongoing" | "completed";
export type ContractRole = "1" | "2" | "3"; // Prime / Sub / Management

export interface ContractInformation {
  _id: string;
  companyId?: string;
  companyId_Tender?: string;
  tenderId?: string;
  procurementType?: string;
  procurementNature?: string;
  procurementMethod?: string;
  appId?: string;
  budgetType?: string;
  development_partner?: string;
  uniqueId?: string;
  
  // Entity & Location
  ministry?: string;
  organization?: string;
  division?: string;
  locationDistrict?: string;
  LtmLicenseNameCode?: string;
  
  // Procuring Entity (PE) Details
  procuringEntityName?: string;
  PE_officialDesignation?: string;
  PE_Address?: string;
  PE_City?: string;
  PE_Thana?: string;
  PE_District?: string;
  
  // Project & Work Details
  ProjectName?: string;
  sourceOfFunds?: string;
  packageNo?: string;
  selectedTenderCategory?: string;
  tender_subCategories?: string;
  tenderCategories?: TenderCategory[];
  identificationOfLot?: string;
  descriptionOfWorks?: string;
  
  // Dates & Financials
  publicationDateTime?: string;
  openingDateTime?: string;
  estimatedCost?: number;
  jvca?: string;
  ProjectCode?: string;
  TentativeStartDate?: string;
  TentativeCompletionDate?: string;
  
  // Contract Dates & Values
  noaIssueDate?: string;
  contractSigningDate?: string;
  commencementDate?: string;
  contractStartDate?: string;
  intendedCompletionDate?: string;
  contractEndDate?: string;
  contractPeriodExtendedUpTo?: string;
  contractValue?: number;
  revisedContractValue?: number;
  
  // Contractor Data
  financialYear?: string;
  nYear?: string;
  Name_Of_Contractor?: string;
  Role_in_Contract?: ContractRole;
  Memo_Number_WCC?: string;
  Memo_Date_WCC?: string;
  Bill_Payment_Date?: string;
  paymentAmount?: number;
  jvShare?: number;
  actualPaymentJvShare?: number;
  Status_Complite_ongoing?: ContractStatus;
  workCompletationCertificateFileName?: string;
  paymentCertificateFileName?: string;
  
  // Works Tracking Fields
  RemainingWorks?: number;
  WorksInHand?: number;
  WorksInHandPerNYear?: number;
  
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// EgpListedCompany Model
// Source: models/EgpListedCompany.js
// ============================================

export interface EgpListedCompany {
  _id: string;
  companyUniqueEGP_ID?: string;
  companyName?: string;
  egpEmail?: string;
  password?: string;
  companyAddress?: string;
  bankName?: string;
  bankAddress?: string;
  yearsOfGeneralExperience?: string | number;
  trade?: string;
  tradeCertificate?: string;
  tin?: string;
  tinReturnCertificate?: string;
  vat?: string;
  vatReturnCertificate?: string;
  autho?: string;
  nid?: string;
  equipment?: string;
  manpower?: string;
  updateAuditReportFileName?: string;
  departmentLicenses?: Record<string, string>;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// CompanyMigration Model
// Source: models/CompanyMigration.js
// ============================================

export interface CompanyMigration {
  _id: string;
  egpEmail?: string;
  egpPassword?: string;
  companyName?: string;
  companyAddress?: string;
  userMail?: string;
  status?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Combined tender data for Line of Credit Tab
export interface LineOfCreditTenderData extends Partial<TenderPreparation> {
  // Fields from Live Tender (Tender model)
  packageNo?: string;
  InvitationReferenceNo?: string;
  procuringEntityName?: string;
  division?: string;
  openingDateTime?: string;
  liquidAssets?: string | number;
  officialDesignation?: string;
  locationDistrict?: string;
  descriptionOfWorks?: string;
  procurementNature?: string;
}
