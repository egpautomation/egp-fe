// src/components/TenderTabs/Update_Tender_Information_Form.tsx

// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { config } from "@/lib/config";
import { patchData, updateData } from "@/lib/updateData";
import useSingleData from "@/hooks/useSingleData";
import toast from "react-hot-toast";

// Helper component for form fields
const FormField = ({ id, label, children }) => {
  // Clone the child element and add the id prop to it
  const childWithId = React.isValidElement(children)
    ? React.cloneElement(children, { id, ...children.props })
    : children;

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={id} className="font-medium text-gray-700">
        {label}
      </Label>
      {childWithId}
    </div>
  );
};

// Function to generate financial years
const generateFinancialYears = () => {
  const years = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  if (currentMonth < 6) {
    currentYear -= 1;
  }
  for (let i = currentYear + 2; i >= currentYear - 12; i--) {
    years.push(`${i}-${i + 1}`);
  }
  return years;
};

// Initial form state
const initialFormData = {
  companyId: "",
  tenderId: "",
  procurementType: "",
  procurementNature: "",
  procurementMethod: "",
  appId: "",
  budgetType: "",
  development_partner: "",
  ministry: "",
  organization: "",
  division: "",
  locationDistrict: "",
  LtmLicenseNameCode: "",
  procuringEntityName: "",
  PE_officialDesignation: "",
  PE_Address: "",
  PE_City: "",
  PE_Thana: "",
  PE_District: "",
  ProjectName: "",
  sourceOfFunds: "",
  packageNo: "",
  selectedTenderCategory: "",
  tender_subCategories: "",
  identificationOfLot: "",
  descriptionOfWorks: "",
  publicationDateTime: "",
  openingDateTime: "",
  estimatedCost: "",
  jvca: "",
  ProjectCode: "",
  TentativeStartDate: "",
  TentativeCompletionDate: "",
  noaIssueDate: "",
  contractSigningDate: "",
  commencementDate: "",
  contractStartDate: "",
  intendedCompletionDate: "",
  contractEndDate: "",
  contractPeriodExtendedUpTo: "",
  contractValue: "",
  revisedContractValue: "",
  financialYear: "",
  uniqueId: "",
  Name_Of_Contractor: "",
  Role_in_Contract: "",
  Memo_Number_WCC: "",
  Memo_Date_WCC: "",
  Bill_Payment_Date: "",
  paymentAmount: "",
  jvShare: "100",
  actualPaymentJvShare: "",
  Status_Complite_ongoing: "",
  workCompletationCertificateFileName: "",
  paymentCertificateFileName: "",
  company_Tender: "",
};

export const UpdateTenderInformationForm = ({ egpEmail, preSelectedContractId }) => {
  // State for contract selection
  const [selectedContractId, setSelectedContractId] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [useInitialContractValue, setUseInitialContractValue] = useState(true);
  const [useUniqueIdForCompany, setUseUniqueIdForCompany] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const financialYears = generateFinancialYears();

  // Similar Nature Work Value states
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [subCategoryValue, setSubCategoryValue] = useState("");
  const [tenderCategories, setTenderCategories] = useState([]);

  // Fetch company data
  const url = `${config.apiBaseUrl}/egp-listed-company/get-by-mail?mail=${egpEmail}`;
  const { data: egpListedCompany } = useSingleData(url);

  // Fetch existing contracts for this company securely using the exact egpEmail
  // This ensures universal access to all CMS data associated with the user's email across tenders
  const contractsUrl = egpEmail
    ? `${config.apiBaseUrl}/contract-information?egpEmail=${encodeURIComponent(egpEmail)}&limit=1000`
    : null;
  const {
    data: existingContracts,
    loading: contractsLoading,
    setReload: setContractReload,
  } = useSingleData(contractsUrl);

  // Fetch tender data when tender ID is available
  const tenderUrl = formData?.tenderId
    ? `${config.apiBaseUrl}/tenders/tenderId/${formData?.tenderId}`
    : null;
  const { data: tenderData } = useSingleData(tenderUrl);

  // Fetch sub-categories from TenderCategory API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/tender-categories/with-pagination?page=1&limit=1000`
        );
        const data = await response.json();
        setSubCategories(data?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Auto-select contract when preSelectedContractId is provided
  useEffect(() => {
    if (preSelectedContractId && existingContracts && Array.isArray(existingContracts)) {
      setSelectedContractId(preSelectedContractId);
    }
  }, [preSelectedContractId, existingContracts]);

  // Handle contract selection
  useEffect(() => {
    if (selectedContractId && existingContracts && Array.isArray(existingContracts)) {
      const contract = existingContracts.find((c) => c._id === selectedContractId);

      if (contract) {
        setSelectedContract(contract);
        setFormData((prev) => ({
          ...prev,
          ...contract,
          // Format dates for input fields (YYYY-MM-DD)
          noaIssueDate: contract.noaIssueDate?.split("T")[0] || "",
          contractSigningDate: contract.contractSigningDate?.split("T")[0] || "",
          commencementDate: contract.commencementDate?.split("T")[0] || "",
          contractStartDate: contract.contractStartDate?.split("T")[0] || "",
          intendedCompletionDate: contract.intendedCompletionDate?.split("T")[0] || "",
          contractEndDate: contract.contractEndDate?.split("T")[0] || "",
          contractPeriodExtendedUpTo: contract.contractPeriodExtendedUpTo?.split("T")[0] || "",
          Memo_Date_WCC: contract.Memo_Date_WCC?.split("T")[0] || "",
          Bill_Payment_Date: contract.Bill_Payment_Date?.split("T")[0] || "",
          TentativeCompletionDate: contract.TentativeCompletionDate?.split("T")[0] || "",
        }));
        // Populate tenderCategories if available, ensuring it is an array
        // Normalize data: backend uses 'subCategory', frontend uses 'sub_cat_name'
        const normalizedCategories = Array.isArray(contract.tenderCategories)
          ? contract.tenderCategories.map((c) => ({
              sub_cat_name: c.sub_cat_name || c.subCategory, // Handle both legacy and new keys
              value: c.value,
            }))
          : [];
        setTenderCategories(normalizedCategories);
      }
    }
  }, [selectedContractId, existingContracts]);

  // Handle input and select field changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update revisedContractValue when useInitialContractValue or contractValue changes
  useEffect(() => {
    if (useInitialContractValue) {
      handleChange("revisedContractValue", formData.contractValue);
    }
  }, [useInitialContractValue, formData.contractValue]);

  // Update companyId when useUniqueIdForCompany or uniqueId changes
  useEffect(() => {
    if (useUniqueIdForCompany) {
      handleChange("companyId", formData.uniqueId);
    }
  }, [useUniqueIdForCompany, formData.uniqueId]);

  // Calculate actualPaymentJvShare when paymentAmount or jvShare changes
  useEffect(() => {
    const payment = parseFloat(formData.paymentAmount) || 0;
    const share = parseFloat(formData.jvShare) || 0;
    const result = (payment * share) / 100;
    handleChange("actualPaymentJvShare", result.toFixed(2));
    handleChange("actualPaymentJvShare", result.toFixed(2));
  }, [formData.paymentAmount, formData.jvShare]);

  // Helper functions for Similar Nature Work Value
  const handleAddCategory = () => {
    if (!selectedSubCategory || !subCategoryValue.trim()) {
      toast.error("Please select sub-category and enter value");
      return;
    }

    // Check for duplicate
    const exists = tenderCategories.find((item) => item.sub_cat_name === selectedSubCategory);
    if (exists) {
      toast.error("This sub-category is already added");
      return;
    }

    setTenderCategories([
      ...tenderCategories,
      { sub_cat_name: selectedSubCategory, value: subCategoryValue.trim() },
    ]);

    // Reset inputs
    setSelectedSubCategory("");
    setSubCategoryValue("");
    toast.success("Sub-category added successfully");
  };

  const handleRemoveCategory = (subCatName) => {
    setTenderCategories(tenderCategories.filter((item) => item.sub_cat_name !== subCatName));
    toast.success("Sub-category removed");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });

    if (!selectedContractId) {
      setFeedback({ message: "Please select a contract to update", type: "error" });
      return;
    }

    setLoading(true);

    const dataToSubmit = {
      ...formData,
      companyId: egpListedCompany?.companyUniqueEGP_ID,
      procurementType: tenderData?.procurementType || formData.procurementType,
      procurementNature: tenderData?.procurementNature || formData.procurementNature,
      procurementMethod: tenderData?.procurementMethod || formData.procurementMethod,
      // Keep existing data if tenderData is not available (since we pre-filled from contract)
      appId: tenderData?.appId || formData.appId,
      budgetType: tenderData?.budgetType || formData.budgetType,
      development_partner: tenderData?.development_partner || formData.development_partner,
      ministry: tenderData?.ministry || formData.ministry,
      organization: tenderData?.organization || formData.organization,
      division: tenderData?.division || formData.division,
      locationDistrict: tenderData?.locationDistrict || formData.locationDistrict,
      LtmLicenseNameCode: tenderData?.LtmLicenseNameCode || formData.LtmLicenseNameCode,
      procuringEntityName: tenderData?.procuringEntityName || formData.procuringEntityName,
      PE_officialDesignation: tenderData?.officialDesignation || formData.PE_officialDesignation,
      PE_Address: tenderData?.address || formData.PE_Address,
      PE_City: tenderData?.City || formData.PE_City,
      PE_Thana: tenderData?.Thana || formData.PE_Thana,
      PE_District: tenderData?.District || formData.PE_District,
      ProjectName: tenderData?.ProjectName || formData.ProjectName,
      sourceOfFunds: tenderData?.sourceOfFunds || formData.sourceOfFunds,
      packageNo: tenderData?.packageNo || formData.packageNo,
      selectedTenderCategory: tenderData?.selectedTenderCategory || formData.selectedTenderCategory,
      tender_subCategories: tenderData?.tender_subCategories || formData.tender_subCategories,
      identificationOfLot: tenderData?.identificationOfLot || formData.identificationOfLot,
      descriptionOfWorks: tenderData?.descriptionOfWorks || formData.descriptionOfWorks,
      publicationDateTime: tenderData?.publicationDateTime || formData.publicationDateTime,
      openingDateTime: tenderData?.openingDateTime || formData.openingDateTime,
      estimatedCost: tenderData?.estimatedCost || formData.estimatedCost,
      jvca: tenderData?.jvca || formData.jvca,
      ProjectCode: tenderData?.ProjectCode || formData.ProjectCode,
      TentativeStartDate: tenderData?.TentativeStartDate || formData.TentativeStartDate,
      TentativeCompletionDate:
        tenderData?.TentativeCompletionDate || formData.TentativeCompletionDate,

      // Send standard array payload matching the new backend schema
      // Backend expects 'subCategory' as key inside the object
      tenderCategories: tenderCategories.map((item) => ({
        subCategory: item.sub_cat_name,
        value: String(item.value),
      })),
    };

    for (const key of [
      "estimatedCost",
      "contractValue",
      "revisedContractValue",
      "paymentAmount",
      "jvShare",
      "actualPaymentJvShare",
    ]) {
      dataToSubmit[key] = parseFloat(dataToSubmit[key]) || 0;
    }

    // Use _id (MongoDB ID) or construct uniqueId (tenderId_companyId) as fallback
    const idToUse = selectedContractId || `${dataToSubmit.tenderId}_${dataToSubmit.companyId}`;
    const updateUrl = `${config.apiBaseUrl}/contract-information/${idToUse}`;
    await patchData(updateUrl, dataToSubmit, setContractReload);
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Update Tender Information</h1>
          <p className="text-gray-500 mt-2">
            Select a contract from the list below to update its details.
          </p>
        </div>

        {/* Contract Selection Combobox */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Select Contract to Update</h3>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full max-w-2xl justify-between bg-white border-blue-200 hover:bg-blue-50"
              >
                {selectedContractId
                  ? (() => {
                      const contract = Array.isArray(existingContracts)
                        ? existingContracts.find((c) => c._id === selectedContractId)
                        : null;
                      return contract
                        ? `Tender ID: ${contract.tenderId} - FY: ${contract.financialYear} (${contract.Status_Complite_ongoing})`
                        : "Select a contract...";
                    })()
                  : "Select a contract..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[672px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search by Tender ID..." />
                <CommandList>
                  <CommandEmpty>No contract found.</CommandEmpty>
                  <CommandGroup>
                    {Array.isArray(existingContracts) &&
                      existingContracts.map((contract, index) => (
                        <CommandItem
                          key={contract._id}
                          value={contract.tenderId}
                          onSelect={() => {
                            setSelectedContractId(contract._id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedContractId === contract._id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {index + 1}. Tender ID: {contract.tenderId} - FY: {contract.financialYear}{" "}
                          ({contract.Status_Complite_ongoing})
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {feedback.message && (
          <div
            className={`p-4 rounded-md text-center ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {feedback.message}
          </div>
        )}

        {/* --- Part 1: General Information --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-3 mb-6">
            Part 1: General Information
          </h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField id="uniqueId" label="Contractor Unique ID">
                <Input name="uniqueId" disabled value={egpListedCompany?.companyUniqueEGP_ID} />
              </FormField>

              <FormField id="tenderId" label="Tender ID">
                <Input
                  name="tenderId"
                  value={formData.tenderId}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <FormField id="procurementType" label="Procurement Type">
                <Input name="procurementType" value={formData?.procurementType} />
                {/* <Select onValueChange={(value) => handleChange('procurementType', value)} value={formData?.procurementType}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="works">Works</SelectItem>
                    <SelectItem value="goods">Goods</SelectItem>
                  </SelectContent>
                </Select> */}
              </FormField>
              <FormField id="procurementNature" label="Procurement Nature">
                <Input name="procurementNature" value={formData?.procurementNature} disabled />
              </FormField>
              <FormField id="procurementMethod" label="Procurement Method">
                <Input name="procurementMethod" value={formData?.procurementMethod} disabled />
              </FormField>
              <FormField id="appId" label="APP ID">
                <Input name="appId" value={formData?.appId} />
              </FormField>
              <FormField id="budgetType" label="Budget Type">
                <Input name="budgetType" value={formData?.budgetType} disabled />
                {/* <Select onValueChange={(value) => handleChange('budgetType', value)} value={formData.budgetType}>
                  <SelectTrigger><SelectValue placeholder="Select Budget" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select> */}
              </FormField>
              <FormField id="development_partner" label="Development Partner">
                <Input
                  name="development_partner"
                  value={formData?.development_partner || "Not Available"}
                  disabled
                />
              </FormField>
            </div>
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Entity & Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField id="ministry" label="Ministry">
                <Input name="ministry" value={formData?.ministry} disabled />
              </FormField>
              <FormField id="organization" label="Organization">
                <Input name="organization" value={formData?.organization} disabled />
              </FormField>
              <FormField id="division" label="Division">
                <Input name="division" value={formData?.division} disabled />
              </FormField>
              <FormField id="locationDistrict" label="Location District">
                <Input name="locationDistrict" value={formData?.locationDistrict} disabled />
              </FormField>
              <FormField id="LtmLicenseNameCode" label="LTM License Name Code">
                <Input
                  name="LtmLicenseNameCode"
                  value={formData?.LtmLicenseNameCode || "NOt Available"}
                  disabled
                />
              </FormField>
            </div>
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">
              Procuring Entity (PE) Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField id="procuringEntityName" label="PE Name">
                <Input name="procuringEntityName" value={formData?.procuringEntityName} disabled />
              </FormField>
              <FormField id="PE_officialDesignation" label="PE Official Designation">
                <Input
                  name="PE_officialDesignation"
                  value={formData?.PE_officialDesignation || "Not Available"}
                  disabled
                />
              </FormField>
              <FormField id="PE_Address" label="PE Address">
                <Input name="PE_Address" value={formData?.PE_Address || "Not Available"} disabled />
              </FormField>
              <FormField id="PE_City" label="PE City">
                <Input name="PE_City" value={formData?.PE_City || "Not Available"} disabled />
              </FormField>
              <FormField id="PE_Thana" label="PE Thana">
                <Input name="PE_Thana" value={formData?.PE_Thana || "Not Available"} disabled />
              </FormField>
              <FormField id="PE_District" label="PE District">
                <Input name="PE_District" value={formData?.PE_District} disabled />
              </FormField>
            </div>
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Project & Work Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField id="ProjectName" label="Project Name">
                <Input
                  name="ProjectName"
                  value={formData?.ProjectName || "NOt Available"}
                  disabled
                />
              </FormField>
              <FormField id="sourceOfFunds" label="Source of Funds">
                <Input
                  name="sourceOfFunds"
                  value={formData?.sourceOfFunds || "Not Available"}
                  disabled
                />
              </FormField>
              <FormField id="packageNo" label="Package No.">
                <Input name="packageNo" value={formData?.packageNo || "Not Available"} disabled />
              </FormField>
              <FormField id="selectedTenderCategory" label="Tender Category">
                <Input
                  name="selectedTenderCategory"
                  value={formData?.selectedTenderCategory || "Not Available"}
                  disabled
                />
              </FormField>
              <FormField id="tender_subCategories" label="Tender Sub-Categories">
                <Input
                  name="tender_subCategories"
                  value={formData?.tender_subCategories || "Not Available"}
                  disabled
                />
              </FormField>
              <FormField id="identificationOfLot" label="Identification of Lot">
                <Input
                  name="identificationOfLot"
                  value={formData?.identificationOfLot || "Not Available"}
                  disabled
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField id="descriptionOfWorks" label="Description of Works">
                  <Textarea
                    name="descriptionOfWorks"
                    placeholder="Provide a detailed description of the works..."
                    value={formData?.descriptionOfWorks}
                    disabled
                  />
                </FormField>
              </div>
            </div>
          </div>
        </div>

        {/* --- Part 2: Dates and Amount --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-3 mb-6">
            Part 2: Dates & Financials
          </h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField id="publicationDateTime" label="Publication Date">
                <Input
                  name="publicationDateTime"
                  type="text"
                  value={formData?.publicationDateTime || "Not Available"}
                  disabled
                />
              </FormField>
              <FormField id="openingDateTime" label="Opening Date">
                <Input
                  name="openingDateTime"
                  type="text"
                  value={formData?.openingDateTime || "Not Available"}
                  disabled
                />
              </FormField>
              <FormField id="estimatedCost" label="Estimated Cost">
                <Input
                  name="estimatedCost"
                  type="number"
                  value={formData?.estimatedCost}
                  disabled
                />
              </FormField>
              <FormField id="jvca" label="JVCA">
                <Input name="jvca" value={formData?.jvca || "NOt Available"} disabled />
              </FormField>
              <FormField id="ProjectCode" label="Project Code">
                <Input
                  name="ProjectCode"
                  value={formData?.ProjectCode || "Not Available"}
                  disabled
                />
              </FormField>
              <FormField id="TentativeStartDate" label="Tentative Start Date">
                <Input
                  name="TentativeStartDate"
                  type="text"
                  value={formData?.TentativeStartDate || "Not Available"}
                  disabled
                />
              </FormField>
              <FormField id="TentativeCompletionDate" label="Tentative Completion Date">
                <Input
                  name="TentativeCompletionDate"
                  type="date"
                  value={formData?.TentativeCompletionDate || "Not Available"}
                  disabled
                />
              </FormField>
            </div>
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Contract Dates & Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <FormField id="noaIssueDate" label="NOA Issue Date">
                <Input
                  name="noaIssueDate"
                  type="date"
                  value={formData.noaIssueDate}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <FormField id="contractSigningDate" label="Contract Signing Date">
                <Input
                  name="contractSigningDate"
                  type="date"
                  value={formData.contractSigningDate}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <FormField id="commencementDate" label="Work Order Date *">
                <Input
                  required
                  name="commencementDate"
                  type="date"
                  value={formData.commencementDate}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <FormField id="contractStartDate" label="Contract Start Date ">
                <Input
                  name="contractStartDate"
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <FormField id="intendedCompletionDate" label="Work Completion Date *">
                <Input
                  required
                  name="intendedCompletionDate"
                  type="date"
                  value={formData.intendedCompletionDate}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <FormField id="contractEndDate" label="Contract End Date">
                <Input
                  name="contractEndDate"
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <FormField id="contractPeriodExtendedUpTo" label="Time Extension Date *">
                <Input
                  required
                  name="contractPeriodExtendedUpTo"
                  type="date"
                  value={formData.contractPeriodExtendedUpTo}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <FormField id="contractValue" label="Contract Value (Initial) *">
                <Input
                  required
                  name="contractValue"
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </FormField>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="revisedContractValue">Revised Contract Value *</Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="useInitialValue"
                    checked={useInitialContractValue}
                    onCheckedChange={setUseInitialContractValue}
                  />
                  <Label htmlFor="useInitialValue" className="font-normal text-sm cursor-pointer">
                    Use Contract Value
                  </Label>
                </div>
                <Input
                  id="revisedContractValue"
                  name="revisedContractValue"
                  type="number"
                  value={formData.revisedContractValue}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  disabled={useInitialContractValue}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Part 3: Contractor Data --- */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-3 mb-6">
            Part 3: Contractor Data
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField id="financialYear" label="Financial Year *">
              <Select
                onValueChange={(value) => handleChange("financialYear", value)}
                value={formData.financialYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {financialYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="companyId_Tender">Company ID</Label>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="useUniqueIdForCompany"
                  checked={useUniqueIdForCompany}
                  onCheckedChange={setUseUniqueIdForCompany}
                />
                <Label
                  htmlFor="useUniqueIdForCompany"
                  className="font-normal text-sm cursor-pointer"
                >
                  Use Contractor Unique ID
                </Label>
              </div>
              <Input
                id="companyId_Tender"
                name="companyId_Tender"
                value={
                  useUniqueIdForCompany
                    ? egpListedCompany?.companyUniqueEGP_ID
                    : formData.companyId_Tender
                }
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                disabled={useUniqueIdForCompany}
              />
            </div>

            <FormField id="Name_Of_Contractor" label="Name of Contractor *">
              <Input
                required
                name="Name_Of_Contractor"
                value={formData.Name_Of_Contractor}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </FormField>
            <FormField id="Role_in_Contract" label="Role in Contract *">
              <Select
                onValueChange={(value) => handleChange("Role_in_Contract", value)}
                value={formData.Role_in_Contract}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Prime Contractor</SelectItem>
                  <SelectItem value="2">Subcontractor</SelectItem>
                  <SelectItem value="3">Management Contractor</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="Memo_Number_WCC" label="Memo Number (WCC)">
              <Input
                name="Memo_Number_WCC"
                value={formData.Memo_Number_WCC}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </FormField>
            <FormField id="Memo_Date_WCC" label="Memo Date (WCC)">
              <Input
                name="Memo_Date_WCC"
                type="date"
                value={formData.Memo_Date_WCC}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </FormField>
            <FormField id="Bill_Payment_Date" label="Bill Payment Date">
              <Input
                name="Bill_Payment_Date"
                type="date"
                value={formData.Bill_Payment_Date}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </FormField>
            <FormField id="paymentAmount" label="Payment Amount *">
              <Input
                name="paymentAmount"
                required
                type="number"
                value={formData.paymentAmount}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </FormField>
            <FormField id="jvShare" label="JV Share (%) *">
              <Input
                required
                name="jvShare"
                type="number"
                value={formData.jvShare}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </FormField>
            <FormField id="actualPaymentJvShare" label="Actual Payment (JV Share)">
              <Input
                name="actualPaymentJvShare"
                type="number"
                value={formData.actualPaymentJvShare}
                readOnly
                className="bg-gray-100"
              />
            </FormField>
            <FormField id="Status_Complite_ongoing" label="Status *">
              <Select
                onValueChange={(value) => handleChange("Status_Complite_ongoing", value)}
                value={formData.Status_Complite_ongoing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              id="workCompletationCertificateFileName"
              label="Work Completion Certificate File Name/NOA *"
            >
              <Input
                required
                name="workCompletationCertificateFileName"
                value={formData.workCompletationCertificateFileName}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </FormField>
            <FormField id="paymentCertificateFileName" label="Payment Certificate File Name">
              <Input
                name="paymentCertificateFileName"
                value={formData.paymentCertificateFileName}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* --- Similar Nature Work Value Section --- */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Similar Nature Work Value</h2>

          {/* Input Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <Combobox
                options={subCategories.map((cat, idx) => ({
                  value: cat.sub_cat_name,
                  label: cat.sub_cat_name,
                  key: `${cat.sub_cat_name}-${idx}`,
                }))}
                value={selectedSubCategory}
                onChange={setSelectedSubCategory}
                placeholder="Select sub category..."
                searchPlaceholder="Search sub category..."
                emptyMessage="No sub category found."
              />
            </div>

            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Similar Nature Work Value
              </label>
              <Input
                value={subCategoryValue}
                onChange={(e) => setSubCategoryValue(e.target.value)}
                placeholder="Enter value"
                className="w-full"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <Button
                type="button"
                onClick={handleAddCategory}
                className="w-full bg-gray-600 hover:bg-gray-700"
                size="default"
              >
                + Add
              </Button>
            </div>
          </div>

          {/* Table of Added Categories */}
          {tenderCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Added Sub Categories:</p>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Sub Category
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Value
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {tenderCategories.map((item, index) => (
                      <tr key={`${item.sub_cat_name}-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{item.sub_cat_name}</td>
                        <td className="px-4 py-2 text-sm">{item.value}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(item.sub_cat_name)}
                            className="text-red-600 hover:text-red-800 text-xl font-bold"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- Submit Button --- */}
        <div className="mt-10 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Tender Data"}
          </Button>
        </div>
      </form>
    </div>
  );
};
