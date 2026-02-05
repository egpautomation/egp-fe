// src/components/TenderTabs/Tender_Information_Form.tsx

// @ts-nocheck
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createData } from '@/lib/createData';
import { Combobox } from "@/components/ui/combobox";
import useSingleData from '@/hooks/useSingleData';

// Helper component for form fields
const FormField = ({ id, label, children }) => (
  <div className="flex flex-col space-y-2">
    <Label htmlFor={id} className="font-medium text-gray-700">{label}</Label>
    {children}
  </div>
);

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
  companyId: '',
  tenderId: '',
  procurementType: '',
  procurementNature: '',
  procurementMethod: '',
  appId: '',
  budgetType: '',
  development_partner: '',
  ministry: '',
  organization: '',
  division: '',
  locationDistrict: '',
  LtmLicenseNameCode: '',
  procuringEntityName: '',
  PE_officialDesignation: '',
  PE_Address: '',
  PE_City: '',
  PE_Thana: '',
  PE_District: '',
  ProjectName: '',
  sourceOfFunds: '',
  packageNo: '',
  selectedTenderCategory: '',
  tender_subCategories: '',
  identificationOfLot: '',
  descriptionOfWorks: '',
  publicationDateTime: '',
  openingDateTime: '',
  estimatedCost: '',
  jvca: '',
  ProjectCode: '',
  TentativeStartDate: '',
  TentativeCompletionDate: '',
  noaIssueDate: '',
  contractSigningDate: '',
  commencementDate: '',
  contractStartDate: '',
  intendedCompletionDate: '',
  contractEndDate: '',
  contractPeriodExtendedUpTo: '',
  contractValue: '',
  revisedContractValue: '',
  financialYear: '',
  uniqueId: '',
  Name_Of_Contractor: '',
  Role_in_Contract: '',
  Memo_Number_WCC: '',
  Memo_Date_WCC: '',
  Bill_Payment_Date: '',
  paymentAmount: '',
  jvShare: '100',
  actualPaymentJvShare: '',
  Status_Complite_ongoing: '',
  workCompletationCertificateFileName: '',
  paymentCertificateFileName: '',
  company_Tender: '',

};

export const TenderInformationForm = ({ egpEmail, setReload }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [useInitialContractValue, setUseInitialContractValue] = useState(true);
  const [useUniqueIdForCompany, setUseUniqueIdForCompany] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const financialYears = generateFinancialYears();

  // Similar Nature Work Value states
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subCategoryValue, setSubCategoryValue] = useState('');
  const [tenderCategories, setTenderCategories] = useState([]);

  const url = `https://egpserver.jubairahmad.com/api/v1/egp-listed-company/get-by-mail?mail=${egpEmail}`
  const { data: egpListedCompany } = useSingleData(url)
  const tenderUrl = `https://egpserver.jubairahmad.com/api/v1/tenders/tenderId/${formData?.tenderId}`
  const { data: tenderData } = useSingleData(tenderUrl)

  // Fetch sub-categories from TenderCategory API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://egpserver.jubairahmad.com/api/v1/tender-categories/with-pagination?page=1&limit=1000'
        );
        const data = await response.json();
        setSubCategories(data?.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);


  // Handle input and select field changes
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update revisedContractValue when useInitialContractValue or contractValue changes
  useEffect(() => {
    if (useInitialContractValue) {
      handleChange('revisedContractValue', formData.contractValue);
    }
  }, [useInitialContractValue, formData.contractValue]);

  // Update companyId when useUniqueIdForCompany or uniqueId changes
  useEffect(() => {
    if (useUniqueIdForCompany) {
      handleChange('companyId', formData.uniqueId);
    }
  }, [useUniqueIdForCompany, formData.uniqueId]);

  // Calculate actualPaymentJvShare when paymentAmount or jvShare changes
  useEffect(() => {
    const payment = parseFloat(formData.paymentAmount) || 0;
    const share = parseFloat(formData.jvShare) || 0;
    const result = (payment * share) / 100;
    handleChange('actualPaymentJvShare', result.toFixed(2));
  }, [formData.paymentAmount, formData.jvShare]);

  // Helper functions for Similar Nature Work Value
  const handleAddCategory = () => {
    if (!selectedSubCategory || !subCategoryValue.trim()) {
      toast.error('Please select sub-category and enter value');
      return;
    }

    // Check for duplicate
    const exists = tenderCategories.find(
      item => item.sub_cat_name === selectedSubCategory
    );
    if (exists) {
      toast.error('This sub-category is already added');
      return;
    }

    setTenderCategories([
      ...tenderCategories,
      { sub_cat_name: selectedSubCategory, value: subCategoryValue.trim() }
    ]);

    // Reset inputs
    setSelectedSubCategory('');
    setSubCategoryValue('');
    toast.success('Sub-category added successfully');
  };

  const handleRemoveCategory = (subCatName) => {
    setTenderCategories(
      tenderCategories.filter(item => item.sub_cat_name !== subCatName)
    );
    toast.success('Sub-category removed');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });
    setLoading(true);

    // Validate tender ID is provided
    if (!formData.tenderId) {
      toast.error('Tender ID is required');
      setLoading(false);
      return;
    }

    // Validate required fields (marked with *)
    const requiredFields = [
      { key: 'commencementDate', label: 'Commencement Date' },
      { key: 'intendedCompletionDate', label: 'Intended Completion Date' },
      { key: 'contractPeriodExtendedUpTo', label: 'Contract Extended Up To' },
      { key: 'contractValue', label: 'Contract Value' },
      { key: 'financialYear', label: 'Financial Year' },
      { key: 'Name_Of_Contractor', label: 'Name of Contractor' },
      { key: 'Role_in_Contract', label: 'Role in Contract' },
      { key: 'paymentAmount', label: 'Payment Amount' },
      { key: 'jvShare', label: 'JV Share' },
      { key: 'Status_Complite_ongoing', label: 'Status' },
      { key: 'workCompletationCertificateFileName', label: 'Work Completion Certificate File Name' },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key]) {
        toast.error(`${field.label} is required`);
        setLoading(false);
        return;
      }
    }

    // Validate Revised Contract Value if checkbox is unchecked
    if (!useInitialContractValue && !formData.revisedContractValue) {
      toast.error('Revised Contract Value is required');
      setLoading(false);
      return;
    }

    // Check if tender ID already exists for this company
    try {
      const companyId = egpListedCompany?.companyUniqueEGP_ID;
      if (companyId) {
        const checkUrl = `https://egpserver.jubairahmad.com/api/v1/contract-information?companyId=${encodeURIComponent(companyId)}&limit=1000`;
        const response = await fetch(checkUrl);
        const data = await response.json();

        if (data?.data && Array.isArray(data.data)) {
          const existingTender = data.data.find(contract => contract.tenderId === formData.tenderId);
          if (existingTender) {
            const status = existingTender.Status_Complite_ongoing;
            toast.error(`This Tender ID already exists as ${status}. Please use Update Tender Info to modify it.`);
            setLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error checking tender ID:', error);
      // Continue with submission even if check fails
    }

    const dataToSubmit = {
      ...formData,
      companyId: egpListedCompany?.companyUniqueEGP_ID,
      // Map to backend schema: subCategory key and string value
      tenderCategories: tenderCategories.map(item => ({
        subCategory: item.sub_cat_name,
        value: String(item.value)
      })),
      procurementType: tenderData?.procurementType,
      procurementNature: tenderData?.procurementNature,
      procurementMethod: tenderData?.procurementMethod,
      appId: tenderData?.appId,
      budgetType: tenderData?.budgetType,
      development_partner: tenderData?.development_partner,
      ministry: tenderData?.ministry,
      organization: tenderData?.organization,
      division: tenderData?.division,
      locationDistrict: tenderData?.locationDistrict,
      LtmLicenseNameCode: tenderData?.LtmLicenseNameCode,
      procuringEntityName: tenderData?.procuringEntityName,
      PE_officialDesignation: tenderData?.officialDesignation,
      PE_Address: tenderData?.address,
      PE_City: tenderData?.City,
      PE_Thana: tenderData?.Thana,
      PE_District: tenderData?.District,
      ProjectName: tenderData?.ProjectName,
      sourceOfFunds: tenderData?.sourceOfFunds,
      packageNo: tenderData?.packageNo,
      selectedTenderCategory: tenderData?.selectedTenderCategory,
      tender_subCategories: tenderData?.tender_subCategories,
      identificationOfLot: tenderData?.identificationOfLot,
      descriptionOfWorks: tenderData?.descriptionOfWorks,
      publicationDateTime: tenderData?.publicationDateTime,
      openingDateTime: tenderData?.openingDateTime,
      estimatedCost: tenderData?.estimatedCost,
      jvca: tenderData?.jvca,
      ProjectCode: tenderData?.ProjectCode,
      TentativeStartDate: tenderData?.TentativeStartDate,
      TentativeCompletionDate: tenderData?.TentativeCompletionDate,


    };
    for (const key of ['estimatedCost', 'contractValue', 'revisedContractValue', 'paymentAmount', 'jvShare', 'actualPaymentJvShare']) {
      dataToSubmit[key] = parseFloat(dataToSubmit[key]) || 0;
    }

    try {
      await createData("https://egpserver.jubairahmad.com/api/v1/contract-information/create-contract-information", [dataToSubmit]);

      // Success: Reset form and reload data
      setFeedback({ message: 'Tender created successfully!', type: 'success' });
      setFormData(initialFormData);
      setTenderCategories([]);
      setSelectedSubCategory('');
      setSubCategoryValue('');
      setUseInitialContractValue(true);
      setUseUniqueIdForCompany(true);

      // Trigger page data reload if setReload function is provided
      if (setReload) {
        setTimeout(() => {
          setReload(prev => prev + 1);
        }, 500);
      }

    } catch (error) {
      setFeedback({ message: `Error: ${error.message || 'Failed to create tender'}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Tender Information Form</h1>
          <p className="text-gray-500 mt-2">Please fill out all the necessary details accurately.</p>
        </div>

        {feedback.message && (
          <div className={`p-4 rounded-md text-center ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback.message}
          </div>
        )}

        {/* --- Part 1: General Information --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-3 mb-6">Part 1: General Information</h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField id="uniqueId" label="Contractor Unique ID">
                <Input name="uniqueId" disabled value={egpListedCompany?.companyUniqueEGP_ID} />
              </FormField>

              <FormField id="tenderId" label="Tender ID">
                <Input name="tenderId" value={formData.tenderId} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <FormField id="procurementType" label="Procurement Type">
                <Input name="procurementType" value={tenderData?.procurementType} />
                {/* <Select onValueChange={(value) => handleChange('procurementType', value)} value={tenderData?.procurementType}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="works">Works</SelectItem>
                    <SelectItem value="goods">Goods</SelectItem>
                  </SelectContent>
                </Select> */}
              </FormField>
              <FormField id="procurementNature" label="Procurement Nature">
                <Input name="procurementNature" value={tenderData?.procurementNature} disabled />
              </FormField>
              <FormField id="procurementMethod" label="Procurement Method">
                <Input name="procurementMethod" value={tenderData?.procurementMethod} disabled />
              </FormField>
              <FormField id="appId" label="APP ID">
                <Input name="appId" value={tenderData?.appId} />
              </FormField>
              <FormField id="budgetType" label="Budget Type">
                <Input name="budgetType" disabled value={tenderData?.budgetType} />
                {/* <Select onValueChange={(value) => handleChange('budgetType', value)} value={formData.budgetType}>
                  <SelectTrigger><SelectValue placeholder="Select Budget" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select> */}
              </FormField>
              <FormField id="development_partner" label="Development Partner">
                <Input name="development_partner" value={tenderData?.development_partner || "Not Available"} disabled />
              </FormField>
            </div>
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Entity & Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField id="ministry" label="Ministry">
                <Input name="ministry" value={tenderData?.ministry} disabled />
              </FormField>
              <FormField id="organization" label="Organization">
                <Input name="organization" value={tenderData?.organization} disabled />
              </FormField>
              <FormField id="division" label="Division">
                <Input name="division" value={tenderData?.division} disabled />
              </FormField>
              <FormField id="locationDistrict" label="Location District">
                <Input name="locationDistrict" value={tenderData?.locationDistrict} disabled />
              </FormField>
              <FormField id="LtmLicenseNameCode" label="LTM License Name Code">
                <Input name="LtmLicenseNameCode" value={tenderData?.LtmLicenseNameCode || "NOt Available"} disabled />
              </FormField>
            </div>
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Procuring Entity (PE) Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField id="procuringEntityName" label="PE Name">
                <Input name="procuringEntityName" value={tenderData?.procuringEntityName} disabled />
              </FormField>
              <FormField id="PE_officialDesignation" label="PE Official Designation">
                <Input name="PE_officialDesignation" value={tenderData?.officialDesignation || "Not Available"} disabled />
              </FormField>
              <FormField id="PE_Address" label="PE Address">
                <Input name="PE_Address" value={tenderData?.address || "Not Available"} disabled />
              </FormField>
              <FormField id="PE_City" label="PE City">
                <Input name="PE_City" value={tenderData?.tenderData?.City || "Not Available"} disabled />
              </FormField>
              <FormField id="PE_Thana" label="PE Thana">
                <Input name="PE_Thana" value={tenderData?.Thana || "Not Available"} disabled />
              </FormField>
              <FormField id="PE_District" label="PE District">
                <Input name="PE_District" value={tenderData?.District} disabled />
              </FormField>
            </div>
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Project & Work Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField id="ProjectName" label="Project Name">
                <Input name="ProjectName" value={tenderData?.ProjectName || "NOt Available"} disabled />
              </FormField>
              <FormField id="sourceOfFunds" label="Source of Funds">
                <Input name="sourceOfFunds" value={tenderData?.sourceOfFunds || "Not Available"} disabled />
              </FormField>
              <FormField id="packageNo" label="Package No.">
                <Input name="packageNo" value={tenderData?.packageNo || "Not Available"} disabled />
              </FormField>
              <FormField id="selectedTenderCategory" label="Tender Category">
                <Input name="selectedTenderCategory" value={tenderData?.selectedTenderCategory || "Not Available"} disabled />
              </FormField>
              <FormField id="tender_subCategories" label="Tender Sub-Categories">
                <Input name="tender_subCategories" value={tenderData?.tender_subCategories || "Not Available"} disabled />
              </FormField>
              <FormField id="identificationOfLot" label="Identification of Lot">
                <Input name="identificationOfLot" value={tenderData?.identificationOfLot || "Not Available"} disabled />
              </FormField>
              <div className="sm:col-span-2">
                <FormField id="descriptionOfWorks" label="Description of Works">
                  <Textarea name="descriptionOfWorks" placeholder="Provide a detailed description of the works..." value={tenderData?.descriptionOfWorks} disabled />
                </FormField>
              </div>
            </div>
          </div>
        </div>

        {/* --- Part 2: Dates and Amount --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-3 mb-6">Part 2: Dates & Financials</h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField id="publicationDateTime" label="Publication Date">
                <Input name="publicationDateTime" type="text" value={tenderData?.publicationDateTime || "Not Available"} disabled />
              </FormField>
              <FormField id="openingDateTime" label="Opening Date">
                <Input name="openingDateTime" type="text" value={tenderData?.openingDateTime || "Not Available"} disabled />
              </FormField>
              <FormField id="estimatedCost" label="Estimated Cost">
                <Input name="estimatedCost" type="number" value={tenderData?.estimatedCost} disabled />
              </FormField>
              <FormField id="jvca" label="JVCA">
                <Input name="jvca" value={tenderData?.jvca || "NOt Available"} disabled />
              </FormField>
              <FormField id="ProjectCode" label="Project Code">
                <Input name="ProjectCode" value={tenderData?.ProjectCode || "Not Available"} disabled />
              </FormField>
              <FormField id="TentativeStartDate" label="Tentative Start Date">
                <Input name="TentativeStartDate" type="text" value={tenderData?.TentativeStartDate || "Not Available"} disabled />
              </FormField>
              <FormField id="TentativeCompletionDate" label="Tentative Completion Date">
                <Input name="TentativeCompletionDate" type="date" value={tenderData?.TentativeCompletionDate || "Not Available"} disabled />
              </FormField>
            </div>
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Contract Dates & Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <FormField id="noaIssueDate" label="NOA Issue Date">
                <Input name="noaIssueDate" type="date" value={formData.noaIssueDate} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <FormField id="contractSigningDate" label="Contract Signing Date">
                <Input name="contractSigningDate" type="date" value={formData.contractSigningDate} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <FormField id="commencementDate" label="Commencement Date *">
                <Input required name="commencementDate" type="date" value={formData.commencementDate} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <FormField id="contractStartDate" label="Contract Start Date ">
                <Input name="contractStartDate" type="date" value={formData.contractStartDate} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <FormField id="intendedCompletionDate" label="Intended Completion Date *">
                <Input required name="intendedCompletionDate" type="date" value={formData.intendedCompletionDate} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <FormField id="contractEndDate" label="Contract End Date">
                <Input name="contractEndDate" type="date" value={formData.contractEndDate} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <FormField id="contractPeriodExtendedUpTo" label="Contract Extended Up To *">
                <Input required name="contractPeriodExtendedUpTo" type="date" value={formData.contractPeriodExtendedUpTo} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <FormField id="contractValue" label="Contract Value (Initial) *">
                <Input required name="contractValue" type="number" value={formData.contractValue} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </FormField>
              <div className="flex flex-col space-y-2">
                <Label>Revised Contract Value *</Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox id="useInitialValue" checked={useInitialContractValue} onCheckedChange={setUseInitialContractValue} />
                  <Label htmlFor="useInitialValue" className="font-normal text-sm cursor-pointer">Use Contract Value</Label>
                </div>
                <Input name="revisedContractValue" type="number" value={formData.revisedContractValue} onChange={(e) => handleChange(e.target.name, e.target.value)} disabled={useInitialContractValue} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Part 3: Contractor Data --- */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-3 mb-6">Part 3: Contractor Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField id="financialYear" label="Financial Year *">
              <Select onValueChange={(value) => handleChange('financialYear', value)} value={formData.financialYear}>
                <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                <SelectContent>
                  {financialYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="companyId">Company ID</Label>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox id="useUniqueIdForCompany" checked={useUniqueIdForCompany} onCheckedChange={setUseUniqueIdForCompany} />
                <Label htmlFor="useUniqueIdForCompany" className="font-normal text-sm cursor-pointer">Use Contractor Unique ID</Label>
              </div>
              <Input name="companyId_Tender" value={useUniqueIdForCompany ? egpListedCompany?.companyUniqueEGP_ID : formData.companyId_Tender} onChange={(e) => handleChange(e.target.name, e.target.value)} disabled={useUniqueIdForCompany} />
            </div>

            <FormField id="Name_Of_Contractor" label="Name of Contractor *">
              <Input required name="Name_Of_Contractor" value={formData.Name_Of_Contractor} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </FormField>
            <FormField id="Role_in_Contract" label="Role in Contract *">
              <Select onValueChange={(value) => handleChange('Role_in_Contract', value)} value={formData.Role_in_Contract}>
                <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Prime Contractor</SelectItem>
                  <SelectItem value="2">Subcontractor</SelectItem>
                  <SelectItem value="3">Management Contractor</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="Memo_Number_WCC" label="Memo Number (WCC)">
              <Input name="Memo_Number_WCC" value={formData.Memo_Number_WCC} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </FormField>
            <FormField id="Memo_Date_WCC" label="Memo Date (WCC)">
              <Input name="Memo_Date_WCC" type="date" value={formData.Memo_Date_WCC} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </FormField>
            <FormField id="Bill_Payment_Date" label="Bill Payment Date">
              <Input name="Bill_Payment_Date" type="date" value={formData.Bill_Payment_Date} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </FormField>
            <FormField id="paymentAmount" label="Payment Amount *">
              <Input name="paymentAmount" required type="number" value={formData.paymentAmount} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </FormField>
            <FormField id="jvShare" label="JV Share (%) *">
              <Input required name="jvShare" type="number" value={formData.jvShare} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </FormField>
            <FormField id="actualPaymentJvShare" label="Actual Payment (JV Share)">
              <Input name="actualPaymentJvShare" type="number" value={formData.actualPaymentJvShare} readOnly className="bg-gray-100" />
            </FormField>
            <FormField id="Status_Complite_ongoing" label="Status *">
              <Select onValueChange={(value) => handleChange('Status_Complite_ongoing', value)} value={formData.Status_Complite_ongoing}>
                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="workCompletationCertificateFileName" label="Work Completion Certificate File Name *">
              <Input required name="workCompletationCertificateFileName" value={formData.workCompletationCertificateFileName} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </FormField>
            <FormField id="paymentCertificateFileName" label="Payment Certificate File Name">
              <Input name="paymentCertificateFileName" value={formData.paymentCertificateFileName} onChange={(e) => handleChange(e.target.name, e.target.value)} />
            </FormField>
          </div>
        </div>

        {/* --- Similar Nature Work Value Section --- */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Similar Nature Work Value
          </h2>

          {/* Input Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <Combobox
                options={subCategories.map((cat, idx) => ({
                  value: cat.sub_cat_name,
                  label: cat.sub_cat_name,
                  key: `${cat.sub_cat_name}-${idx}`
                }))}
                value={selectedSubCategory}
                onChange={setSelectedSubCategory}
                placeholder="Select sub category..."
                searchPlaceholder="Search sub category..."
                emptyMessage="No sub category found."
              />
            </div>

            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Similar Nature Work Value</label>
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
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sub Category</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Value</th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {tenderCategories.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
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
          <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3" disabled={loading}>
            {loading ? 'Saving...' : 'Save Tender Data'}
          </Button>
        </div>
      </form>
    </div>
  );
};