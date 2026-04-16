// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useSingleData from "@/hooks/useSingleData";
import { MoveLeft, Check, Plus, X, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import useAllDepartments from "@/hooks/useAllDepartments";

// 64 Districts of Bangladesh
const bangladeshDistricts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barisal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

const CERTIFICATE_OPTIONS = [
  { label: "General Experience Certificate", value: "General Experience Certificate" },
  { label: "Specific Experience Certificate", value: "Specific Experience Certificate" },
  { label: "financial Capacity certificate", value: "financial Capacity certificate" },
  {
    label: "average annual construction turnover certificate",
    value: "average annual construction turnover certificate",
  },
];

const UpdateCompanyMigration = () => {
  const { id } = useParams();

  // Fetch Company Migration data directly
  const url = `${config.apiBaseUrl}/companyMigration/${id}`;
  const { data: formData } = useSingleData(url);

  const { transformedDepartments: AGENCIES, loading: departmentsLoading } = useAllDepartments();
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [tempAgency, setTempAgency] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [open, setOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  // Experience Certificates State
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [tempCertType, setTempCertType] = useState("");
  const [tempCertValue, setTempCertValue] = useState("");
  const [certOpen, setCertOpen] = useState(false);
  const [newFormData, setNewFormData] = useState({});

  // Bank Details Array State
  const [bankDetails, setBankDetails] = useState([]);
  const [tempBankAccount, setTempBankAccount] = useState({
    bankAccountName: "",
    bankAccountNumber: "",
    holderName: "",
  });

  // Initialize selectedAgencies from formData.departmentLicenses
  useEffect(() => {
    if (formData?.departmentLicenses) {
      const agencies = Object.entries(formData.departmentLicenses).map(([key, value]) => ({
        name: key,
        value: value as string,
      }));
      setSelectedAgencies(agencies);
    }

    // Initialize newFormData with existing data when formData loads
    if (formData && Object.keys(formData).length > 0) {
      setNewFormData(formData);
    }

    // Initialize bankDetails from formData.bankDetails
    if (formData?.bankDetails && Array.isArray(formData.bankDetails)) {
      setBankDetails(formData.bankDetails);
    }

    // Initialize selectedCertificates from formData.experienceCertificates
    if (formData?.experienceCertificates) {
      // Support both array format (new) and object format (legacy)
      if (Array.isArray(formData.experienceCertificates)) {
        setSelectedCertificates(formData.experienceCertificates);
      } else {
        const certificates = Object.entries(formData.experienceCertificates).map(([key, value]) => ({
          name: key,
          value: value as string,
        }));
        setSelectedCertificates(certificates);
      }
    }
  }, [formData]);

  // Fetch EGP Listed Company data to get yearsOfGeneralExperience
  useEffect(() => {
    const fetchEgpListedCompany = async () => {
      if (!formData?.egpEmail) return;

      try {
        const response = await axiosInstance.get(
          `/egp-listed-company?searchTerm=${formData.egpEmail}&page=1&limit=1`
        );
        const egpCompany = response.data?.data?.[0];

        if (egpCompany?.yearsOfGeneralExperience) {
          setNewFormData((prev) => ({
            ...prev,
            yearsOfGeneralExperience: egpCompany.yearsOfGeneralExperience,
          }));
        }
      } catch (error) {
        console.error("Error fetching EGP Listed Company:", error);
      }
    };

    fetchEgpListedCompany();
  }, [formData?.egpEmail]);

  // Handle adding agency to selected list
  const handleAddAgency = () => {
    if (!tempAgency || !tempValue.trim()) {
      return; // Don't add if no agency selected or no value entered
    }

    // Check if agency already exists
    const exists = selectedAgencies.find((a) => a.name === tempAgency);
    if (exists) {
      alert(`${tempAgency} has already been added!`);
      return;
    }

    // Add to selected agencies
    setSelectedAgencies((prev) => [...prev, { name: tempAgency, value: tempValue.trim() }]);

    // Reset temporary values
    setTempAgency("");
    setTempValue("");
    setOpen(false);
  };

  // Handle removing agency from selected list
  const handleRemoveAgency = (agencyName) => {
    setSelectedAgencies((prev) => prev.filter((a) => a.name !== agencyName));
  };

  // Handle adding certificate to selected list — allows multiple entries of the same type
  const handleAddCertificate = () => {
    if (!tempCertType || !tempCertValue.trim()) {
      return;
    }

    // Add to selected certificates (no duplicate check — same type allowed)
    setSelectedCertificates((prev) => [...prev, { name: tempCertType, value: tempCertValue.trim() }]);

    // Reset temporary values
    setTempCertType("");
    setTempCertValue("");
    setCertOpen(false);
  };

  // Handle removing certificate from selected list by index
  const handleRemoveCertificate = (index) => {
    setSelectedCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle adding bank account to bank details array
  const handleAddBankAccount = () => {
    if (
      !tempBankAccount.bankAccountName.trim() ||
      !tempBankAccount.bankAccountNumber.trim() ||
      !tempBankAccount.holderName.trim()
    ) {
      return; // Don't add if any field is empty
    }

    // Add to bank details array
    setBankDetails((prev) => [
      ...prev,
      {
        bankAccountName: tempBankAccount.bankAccountName.trim(),
        bankAccountNumber: tempBankAccount.bankAccountNumber.trim(),
        holderName: tempBankAccount.holderName.trim(),
      },
    ]);

    // Reset temporary values
    setTempBankAccount({
      bankAccountName: "",
      bankAccountNumber: "",
      holderName: "",
    });
  };

  // Handle removing bank account from bank details array
  const handleRemoveBankAccount = (index) => {
    setBankDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle bank account input change
  const handleBankAccountChange = (e) => {
    const { name, value } = e.target;
    setTempBankAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating...");

    try {
      // Check if formData is loaded
      if (!formData || !formData._id) {
        toast.error("Company data not loaded. Please wait and try again.", {
          id: toastId,
        });
        return;
      }

      // Transform selectedAgencies array to departmentLicenses object
      const departmentLicenses = {};
      selectedAgencies.forEach((agency) => {
        departmentLicenses[agency.name] = agency.value;
      });

      // Send selectedCertificates as an array to support multiple entries of the same type
      const experienceCertificates = selectedCertificates;

      // Merge with existing formData
      const submitData = {
        ...newFormData,
        departmentLicenses, // Send as nested object
        experienceCertificates, // Send as nested object
        bankDetails, // Send bank details array
      };

      // Update Company Migration
      const response = await axiosInstance.patch(`/companyMigration/${formData._id}`, submitData);

      const data = response.data;

      if (data?.success) {
        // Also update EGP Listed Company if yearsOfGeneralExperience was changed
        if (newFormData?.yearsOfGeneralExperience !== undefined) {
          try {
            const egpResponse = await axiosInstance.get(
              `/egp-listed-company?searchTerm=${formData.egpEmail}&page=1&limit=1`
            );
            const egpCompany = egpResponse.data?.data?.[0];

            if (egpCompany?._id) {
              // Use PUT method with full company data (matching UpdateEgpListedCompany.tsx pattern)
              const egpUpdateData = {
                ...egpCompany,
                yearsOfGeneralExperience: newFormData.yearsOfGeneralExperience,
              };

              const updateUrl = `${config.apiBaseUrl}/egp-listed-company/${egpCompany._id}`;
              await axiosInstance.put(updateUrl, egpUpdateData);
            }
          } catch (egpError) {
            console.error("Error updating EGP Listed Company:", egpError);
            // Don't fail the whole operation if EGP update fails
          }
        }

        toast.success("Updated successfully", { id: toastId });
      } else {
        toast.error(data.message || "Failed to update", { id: toastId });
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "An unexpected error occurred";
      toast.error(errorMessage, {
        id: toastId,
      });
    }
  };

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <section className="min-h-lvh">
      <Link to={"/dashboard/my-registered-company"}>
        <Button className="flex items-center gap-1.5 mt-4 cursor-pointer">
          <MoveLeft /> Back To My Companies
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">Update Company Migration</h1>

      {/* Informational Note */}
      <div className="w-full max-w-full md:max-w-2xl lg:max-w-4xl mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700 leading-relaxed">
          এই ফর্মে প্রয়োজনীয় সকল তথ্য হবে আপনার eGP অ্যাকাউন্টে Map-এর ফাইল নামসমূহ (উদাহরণস্বরূপ:
          Tin Certificate 25 26.pdf)। ফাইল নাম লেখার পূর্বে নিম্নলিখিত বিষয়গুলি যাচাই করুন: 1)
          eGP-তে উক্ত নাম দিয়ে সার্চ করলে সংশ্লিষ্ট ফাইল ফিল্টার হয় কি না। 2) ফাইল নামের শুরুতে বা
          শেষে কোনো স্পেস (SPACE) আছে কি না। যদি থাকে, তা অপসারণ করুন।
        </p>
      </div>
      <div className=" flex justify-center items-center">
        <div className="w-full max-w-full md:max-w-2xl lg:max-w-4xl shadow-2xl p-4 md:p-6 lg:p-8 rounded border">
          <form onSubmit={handleSubmit} className="w-full space-y-8">
            {/* Section 1: Company Information */}
            <div className="space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">Company Information</h2>
                <p className="text-sm text-gray-600 mt-1">Basic company details and credentials</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* E-GP Email - DISABLED */}
                <div className="">
                  <Label htmlFor="egpEmail">
                    E-GP Email<span className="text-red-700">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="egpEmail"
                      defaultValue={formData?.egpEmail}
                      placeholder="Enter Egp Email"
                      className="mt-2 bg-gray-100 cursor-not-allowed pr-10"
                      required
                      readOnly
                      disabled
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 text-gray-500 hover:text-gray-900 cursor-pointer"
                      onClick={() => handleCopy(formData?.egpEmail, "E-GP Email")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Company Name - DISABLED */}
                <div className="">
                  <Label htmlFor="companyName">
                    Company Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="companyName"
                    defaultValue={formData?.companyName}
                    placeholder="Enter Company Name"
                    className="mt-2 bg-gray-100 cursor-not-allowed"
                    required
                    readOnly
                    disabled
                  />
                </div>

                {/* Password - DISABLED */}
                <div className="">
                  <Label htmlFor="egpLoginKey">
                    Password<span className="text-red-700">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="egpLoginKey"
                      defaultValue={formData?.egpLoginKey}
                      placeholder="Enter Password"
                      className="mt-2 bg-gray-100 cursor-not-allowed pr-10"
                      required
                      readOnly
                      disabled
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 text-gray-500 hover:text-gray-900 cursor-pointer"
                      onClick={() => handleCopy(formData?.egpLoginKey, "Password")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Status - DISABLED */}
                <div className="">
                  <Label htmlFor="status">
                    Status<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="status"
                    defaultValue={formData?.status}
                    placeholder="Status"
                    className="mt-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                </div>

                {/* Remarks - DISABLED */}
                <div className="">
                  <Label htmlFor="remarks">
                    Remarks<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="remarks"
                    defaultValue={formData?.remarks}
                    placeholder="Remarks"
                    className="mt-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                </div>

                {/* Bank Name - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="bankName">
                    Bank Name
                  </Label>
                  <Input
                    type="text"
                    name="bankName"
                    onChange={handleInputChange}
                    value={newFormData?.bankName || ""}
                    placeholder="Bank Name"
                    className="mt-2"
                  />
                </div>

                {/* Bank Address - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="bankAddress">
                    Bank Address for Contact Details
                  </Label>
                  <Input
                    type="text"
                    name="bankAddress"
                    onChange={handleInputChange}
                    value={newFormData?.bankAddress || ""}
                    placeholder="Enter Bank Address for Contact Details"
                    className="mt-2"
                  />
                </div>

                {/* Company Address - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="companyAddress">
                    Company Address
                  </Label>
                  <Input
                    type="text"
                    name="companyAddress"
                    onChange={handleInputChange}
                    value={newFormData?.companyAddress || ""}
                    placeholder="Enter Company Address"
                    className="mt-2"
                  />
                </div>

                {/* Years of General Experience - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="yearsOfGeneralExperience">
                    Years of General Experience
                  </Label>
                  <Input
                    type="number"
                    name="yearsOfGeneralExperience"
                    onChange={handleInputChange}
                    value={newFormData?.yearsOfGeneralExperience || ""}
                    placeholder="Enter Years of General Experience"
                    className="mt-2"
                    min="0"
                  />
                </div>

                {/* LTM District - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="ltmDistrict">
                    LTM District
                  </Label>
                  <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-2"
                      >
                        {newFormData?.ltmDistrict || "Search district..."}
                        <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search district..." />
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup>
                            {bangladeshDistricts.map((district) => (
                              <CommandItem
                                key={district}
                                value={district}
                                onSelect={(currentValue) => {
                                  setNewFormData((prev) => ({
                                    ...prev,
                                    ltmDistrict: currentValue,
                                  }));
                                  setDistrictOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newFormData?.ltmDistrict === district
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {district}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Proprietor Name - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="proprietorName">
                    Proprietor Name
                  </Label>
                  <Input
                    type="text"
                    name="proprietorName"
                    onChange={handleInputChange}
                    value={newFormData?.proprietorName || ""}
                    placeholder="Enter Proprietor Name (e.g., মোঃ রহিম উদ্দিন)"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Legal & Authorization Documents */}
            <div className="space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  Legal & Authorization Documents
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  File names for required documents in eGP account
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Trade Certificate - First - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="trade">
                    Trade Certificate File Name
                  </Label>
                  <Input
                    type="text"
                    name="trade"
                    onChange={handleInputChange}
                    value={newFormData?.trade || ""}
                    placeholder="Trade"
                    className="mt-2"
                  />
                </div>

                {/* Authorization Letter File Name - Second - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="autho">
                    Authorization Letter File Name
                  </Label>
                  <Input
                    type="text"
                    name="autho"
                    onChange={handleInputChange}
                    value={newFormData?.autho || ""}
                    placeholder="Autho"
                    className="mt-2"
                  />
                </div>

                {/* TIN Certificate - Third - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="tin">
                    TIN Certificate File Name
                  </Label>
                  <Input
                    type="text"
                    name="tin"
                    onChange={handleInputChange}
                    value={newFormData?.tin || ""}
                    placeholder="Enter TIN Certificate"
                    className="mt-2"
                  />
                </div>

                {/* TIN Return Certificate - Fourth - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="tinReturnCertificate">
                    TIN Return Certificate File Name
                  </Label>
                  <Input
                    type="text"
                    name="tinReturnCertificate"
                    onChange={handleInputChange}
                    value={newFormData?.tinReturnCertificate || ""}
                    placeholder="Enter TIN Return Certificate"
                    className="mt-2"
                  />
                </div>

                {/* VAT Certificate - Fifth - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="vat">
                    VAT Certificate File Name
                  </Label>
                  <Input
                    type="text"
                    name="vat"
                    onChange={handleInputChange}
                    value={newFormData?.vat || ""}
                    placeholder="Enter Vat Certificate"
                    className="mt-2"
                  />
                </div>

                {/* VAT Return Certificate - Sixth - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="vatReturnCertificate">
                    VAT Return Certificate File Name
                  </Label>
                  <Input
                    type="text"
                    name="vatReturnCertificate"
                    onChange={handleInputChange}
                    value={newFormData?.vatReturnCertificate || ""}
                    placeholder="Enter VAT Return Certificate"
                    className="mt-2"
                  />
                </div>

                {/* NID - Seventh - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="nid">
                    NID File Name
                  </Label>
                  <Input
                    type="text"
                    name="nid"
                    onChange={handleInputChange}
                    value={newFormData?.nid || ""}
                    placeholder="NID"
                    className="mt-2"
                  />
                </div>

                {/* Equipment - Eighth - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="equipment">
                    Equipment List File Name
                  </Label>
                  <Input
                    type="text"
                    name="equipment"
                    onChange={handleInputChange}
                    value={newFormData?.equipment || ""}
                    placeholder="Enter Equipment Requirement"
                    className="mt-2"
                  />
                </div>

                {/* Manpower - Ninth - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="manpower">
                    Manpower List File Name
                  </Label>
                  <Input
                    type="text"
                    name="manpower"
                    onChange={handleInputChange}
                    value={newFormData?.manpower || ""}
                    placeholder="Enter Manpower Requirement"
                    className="mt-2"
                  />
                </div>

                {/* Audit Report - Tenth - EDITABLE */}
                <div className="">
                  <Label className="mb-2" htmlFor="updateAuditReportFileName">
                    Audit Report File Name
                  </Label>
                  <Input
                    type="text"
                    name="updateAuditReportFileName"
                    onChange={handleInputChange}
                    value={newFormData?.updateAuditReportFileName || ""}
                    placeholder="Enter Audit Report File Name"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Bank Account Details */}
            <div className="space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">Bank Account Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add multiple bank account information (optional)
                </p>
              </div>

              {/* Bank Account Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Bank Account Name */}
                <div className="flex-1">
                  <Label className="mb-2">Bank Account Name</Label>
                  <Input
                    type="text"
                    name="bankAccountName"
                    value={tempBankAccount.bankAccountName}
                    onChange={handleBankAccountChange}
                    placeholder="e.g., Business Current Account"
                    className="mt-2"
                  />
                </div>

                {/* Bank Account Number */}
                <div className="flex-1">
                  <Label className="mb-2">Bank Account Number</Label>
                  <Input
                    type="text"
                    name="bankAccountNumber"
                    value={tempBankAccount.bankAccountNumber}
                    onChange={handleBankAccountChange}
                    placeholder="e.g., 1234567890123"
                    className="mt-2"
                  />
                </div>

                {/* Holder Name */}
                <div className="flex-1">
                  <Label className="mb-2">Account Holder Name</Label>
                  <Input
                    type="text"
                    name="holderName"
                    value={tempBankAccount.holderName}
                    onChange={handleBankAccountChange}
                    placeholder="e.g., মোঃ রহিম উদ্দিন"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Add Button */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddBankAccount}
                  className="cursor-pointer"
                  disabled={
                    !tempBankAccount.bankAccountName.trim() ||
                    !tempBankAccount.bankAccountNumber.trim() ||
                    !tempBankAccount.holderName.trim()
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bank Account
                </Button>
              </div>

              {/* Display Added Bank Accounts */}
              {bankDetails.length > 0 && (
                <div className="mt-5">
                  <Label className="text-base font-semibold mb-2">Added Bank Accounts:</Label>
                  <div className="border rounded-md mt-2 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-3 font-semibold">Account Name</th>
                          <th className="text-left p-3 font-semibold">Account Number</th>
                          <th className="text-left p-3 font-semibold">Holder Name</th>
                          <th className="text-center p-3 font-semibold w-20">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankDetails.map((account, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="p-3">{account.bankAccountName}</td>
                            <td className="p-3">{account.bankAccountNumber}</td>
                            <td className="p-3">{account.holderName}</td>
                            <td className="p-3 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveBankAccount(index)}
                                className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Departmental Wise LTM Enlistment Certificate */}
            <div className="space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  Departmental Wise LTM Enlistment Certificate
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add department-specific license information
                </p>
              </div>
              <Label className="text-lg font-semibold mb-3">
                Departmental Wise LTM Enlistment Certificate Name
              </Label>

              {/* Search, Input, and Add Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                {/* Searchable Combobox */}
                <div className="flex-1 w-full">
                  <Label className="mb-2">Select Short Name</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between mt-2"
                      >
                        {tempAgency
                          ? AGENCIES.find((agency) => agency.value === tempAgency)?.label
                          : "Search short name..."}
                        <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search short name..." />
                        <CommandList>
                          <CommandEmpty>No short name found.</CommandEmpty>
                          <CommandGroup>
                            {AGENCIES.map((agency) => (
                              <CommandItem
                                key={agency.value}
                                value={agency.value}
                                onSelect={(currentValue) => {
                                  setTempAgency(currentValue === tempAgency ? "" : currentValue);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    tempAgency === agency.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {agency.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Value Input */}
                <div className="flex-1 w-full">
                  <Label className="mb-2">Value</Label>
                  <Input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder="Enter value"
                    className="mt-2"
                  />
                </div>

                {/* Add Button */}
                <Button
                  type="button"
                  onClick={handleAddAgency}
                  className="cursor-pointer w-full sm:w-auto"
                  disabled={!tempAgency || !tempValue.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Display Added Agencies */}
              {selectedAgencies.length > 0 && (
                <div className="mt-5">
                  <Label className="text-base font-semibold mb-2">Added Agencies:</Label>
                  <div className="border rounded-md mt-2 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-3 font-semibold">Agency</th>
                          <th className="text-left p-3 font-semibold">Value</th>
                          <th className="text-center p-3 font-semibold w-20">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAgencies.map((agency, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="p-3">{agency.name}</td>
                            <td className="p-3">{agency.value}</td>
                            <td className="p-3 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAgency(agency.name)}
                                className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Experience Certificates */}
            <div className="space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">Experience Certificates</h2>
                <p className="text-sm text-gray-600 mt-1">Add experience and capacity certificates</p>
              </div>

              {/* Search, Input, and Add Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                {/* Searchable Combobox */}
                <div className="flex-1 w-full">
                  <Label className="mb-2">Select Certificate Type</Label>
                  <Popover open={certOpen} onOpenChange={setCertOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={certOpen}
                        className="w-full justify-between mt-2"
                      >
                        {tempCertType
                          ? CERTIFICATE_OPTIONS.find((cert) => cert.value === tempCertType)?.label
                          : "Search certificate type..."}
                        <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search certificate type..." />
                        <CommandList>
                          <CommandEmpty>No certificate found.</CommandEmpty>
                          <CommandGroup>
                            {CERTIFICATE_OPTIONS.map((cert) => (
                              <CommandItem
                                key={cert.value}
                                value={cert.value}
                                onSelect={(currentValue) => {
                                  setTempCertType(currentValue === tempCertType ? "" : currentValue);
                                  setCertOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    tempCertType === cert.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {cert.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Value Input */}
                <div className="flex-1 w-full">
                  <Label className="mb-2">Value</Label>
                  <Input
                    type="text"
                    value={tempCertValue}
                    onChange={(e) => setTempCertValue(e.target.value)}
                    placeholder="Enter value"
                    className="mt-2"
                  />
                </div>

                {/* Add Button */}
                <Button
                  type="button"
                  onClick={handleAddCertificate}
                  className="cursor-pointer w-full sm:w-auto"
                  disabled={!tempCertType || !tempCertValue.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Display Added Certificates */}
              {selectedCertificates.length > 0 && (
                <div className="mt-5">
                  <Label className="text-base font-semibold mb-2">Added Certificates:</Label>
                  <div className="border rounded-md mt-2 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-3 font-semibold">Certificate</th>
                          <th className="text-left p-3 font-semibold">Value</th>
                          <th className="text-center p-3 font-semibold w-20">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCertificates.map((cert, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="p-3">{cert.name}</td>
                            <td className="p-3">{cert.value}</td>
                            <td className="p-3 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveCertificate(index)}
                                className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full">
              {isDisabled ? (
                <Button disabled className="w-full cursor-pointer">
                  Submit
                </Button>
              ) : (
                <Button type="submit" className="w-full cursor-pointer">
                  Update Company
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateCompanyMigration;
