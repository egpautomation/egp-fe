// @ts-nocheck

import { useContext, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AuthContext } from "@/provider/AuthProvider";
import { createData } from "@/lib/createData";
import { Link } from "react-router-dom";
import { MoveLeft, Check, Plus, X } from "lucide-react";
import useSingleData from "@/hooks/useSingleData";
import { cn } from "@/lib/utils";
import useAllDepartments from "@/hooks/useAllDepartments";


// 64 Districts of Bangladesh
const bangladeshDistricts = [
  // Dhaka Division (13 districts)
  "Dhaka",
  "Faridpur",
  "Gazipur",
  "Gopalganj",
  "Kishoreganj",
  "Madaripur",
  "Manikganj",
  "Munshiganj",
  "Narayanganj",
  "Narsingdi",
  "Rajbari",
  "Shariatpur",
  "Tangail",

  // Chittagong Division (11 districts)
  "Bandarban",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Cumilla",
  "Cox's Bazar",
  "Feni",
  "Khagrachhari",
  "Lakshmipur",
  "Noakhali",
  "Rangamati",

  // Rajshahi Division (8 districts)
  "Bogura",
  "Joypurhat",
  "Naogaon",
  "Natore",
  "Chapainawabganj",
  "Pabna",
  "Rajshahi",
  "Sirajganj",

  // Khulna Division (10 districts)
  "Bagerhat",
  "Chuadanga",
  "Jashore",
  "Jhenaidah",
  "Khulna",
  "Kushtia",
  "Magura",
  "Meherpur",
  "Narail",
  "Satkhira",

  // Barishal Division (6 districts)
  "Barguna",
  "Barishal",
  "Bhola",
  "Jhalokathi",
  "Patuakhali",
  "Pirojpur",

  // Sylhet Division (4 districts)
  "Habiganj",
  "Moulvibazar",
  "Sunamganj",
  "Sylhet",

  // Rangpur Division (8 districts)
  "Dinajpur",
  "Gaibandha",
  "Kurigram",
  "Lalmonirhat",
  "Nilphamari",
  "Panchagarh",
  "Rangpur",
  "Thakurgaon",

  // Mymensingh Division (4 districts)
  "Jamalpur",
  "Mymensingh",
  "Netrokona",
  "Sherpur",
];

const CreateEgpListedCompany = () => {
  const { transformedDepartments: AGENCIES, loading: departmentsLoading } = useAllDepartments();
  const [egpEmailError, setEgpEmailError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [tempAgency, setTempAgency] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [open, setOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userMail: user?.email,
    egpEmail: "",
    companyName: "",
    password: "",
    status: "",
    remarks: "",
    bankName: "",
    bankAddress: "",
    companyAddress: "",
    autho: "",
    nid: "",
    trade: "",
    tin: "",
    tinReturnCertificate: "",
    vat: "",
    vatReturnCertificate: "",
    updateAuditReportFileName: "",
    ltmDistrict: "",
    equipment: "",
    manpower: "",
    companyUniqueEGP_ID: "",
    yearsOfGeneralExperience: ""
  });

  const url = `https://egpserver.jubairahmad.com/api/v1/egp-listed-company/check-egpEmail-exist?egpEmail=${formData?.egpEmail}`;
  const { data } = useSingleData(url);

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
    setSelectedAgencies((prev) => [
      ...prev,
      { name: tempAgency, value: tempValue.trim() },
    ]);

    // Reset temporary values
    setTempAgency("");
    setTempValue("");
    setOpen(false);
  };

  // Handle removing agency from selected list
  const handleRemoveAgency = (agencyName) => {
    setSelectedAgencies((prev) => prev.filter((a) => a.name !== agencyName));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    if (name === "egpEmail") {
      const startsWithCapital = /^[A-Z]/.test(trimmedValue);
      const containsUpperCase = /[A-Z]/.test(trimmedValue);
      const missingDotCom = !/\.com$/.test(trimmedValue);

      if (startsWithCapital) {
        setEgpEmailError("Email should not start with a capital letter.");
        setIsDisabled(true);
      } else if (containsUpperCase) {
        setEgpEmailError("Email should not contain uppercase letters.");
        setIsDisabled(true);
      } else if (missingDotCom) {
        setEgpEmailError("Email must end with '.com'.");
        setIsDisabled(true);
      } else {
        setEgpEmailError("");
        setIsDisabled(false);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "egpEmail" ? trimmedValue : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transform selectedAgencies array to departmentLicenses object
    const departmentLicenses = {};
    selectedAgencies.forEach((agency) => {
      departmentLicenses[agency.name] = agency.value;
    });

    // Merge with existing formData
    const submitData = {
      ...formData,
      departmentLicenses,  // Send as nested object
    };

    const url =
      "https://egpserver.jubairahmad.com/api/v1/egp-listed-company/create-egp-listed-company";
    createData(url, submitData);
  };

  useEffect(() => {
    if (data?.egpEmail == formData?.egpEmail) {
      setEgpEmailError("This Email Is Taken");
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [data]);

  return (
    <section className="min-h-lvh">
      <Link to={"/dashboard/all-egp-listed-company"}>
        <Button className="flex items-center gap-1.5 mt-4 cursor-pointer">
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">
        Create Egp Listed Company
      </h1>

      {/* Informational Note */}
      <div className="w-full max-w-full md:max-w-2xl lg:max-w-4xl mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700 leading-relaxed">
          এই ফর্মে প্রয়োজনীয় সকল তথ্য হবে আপনার eGP অ্যাকাউন্টে Map-এর ফাইল নামসমূহ (উদাহরণস্বরূপ: Tin Certificate 25 26.pdf)।
          ফাইল নাম লেখার পূর্বে নিম্নলিখিত বিষয়গুলি যাচাই করুন: 1) eGP-তে উক্ত নাম দিয়ে সার্চ করলে সংশ্লিষ্ট ফাইল ফিল্টার হয় কি না। 2) ফাইল নামের শুরুতে বা শেষে কোনো স্পেস (SPACE) আছে কি না। যদি থাকে, তা অপসারণ করুন।
        </p>
      </div>
      <div className=" flex justify-center items-center">
        <div className="w-full max-w-full md:max-w-2xl lg:max-w-4xl shadow-2xl p-4 md:p-6 lg:p-8 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-8"
          >
            {/* Section 1: Company Information */}
            <div className="space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">Company Information</h2>
                <p className="text-sm text-gray-600 mt-1">Basic company details and credentials</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* egp email */}
                <div className="">
                  <Label htmlFor="egpEmail">
                    E-GP Email<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="egpEmail"
                    onChange={handleInputChange}
                    value={formData.egpEmail}
                    placeholder="Enter Egp Email"
                    className="mt-2"
                    required
                  />
                  <p className="text-sm mt-2 text-red-700">{egpEmailError}</p>
                </div>

                {/* company name */}
                <div className="">
                  <Label htmlFor="district">
                    Company Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="companyName"
                    onChange={handleInputChange}
                    value={formData.companyName}
                    placeholder="Enter Company Name"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Password */}
                <div className="">
                  <Label htmlFor="Password">
                    Password<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    placeholder="Enter Password"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Status */}
                <div className="">
                  <Label className=" mb-2" htmlFor="Password">
                    Status<span className="text-red-700">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* remarks */}
                <div className="">
                  <Label className="mb-2" htmlFor="lastUsePassDate">
                    Remarks<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="remarks"
                    onChange={handleInputChange}
                    value={formData.remarks}
                    placeholder="Reason of Deactivate"
                    className="mt-2"
                    required
                  />
                </div>

                {/* bankName */}
                <div className="">
                  <Label className="mb-2" htmlFor="lastUsePassDate">
                    Bank Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="bankName"
                    onChange={handleInputChange}
                    value={formData.bankName}
                    placeholder="Bank Name"
                    className="mt-2"
                    required
                  />
                </div>

                {/* bankAddress */}
                <div className="">
                  <Label className="mb-2" htmlFor="bankAddress">
                    Bank Address for Contact Details<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="bankAddress"
                    onChange={handleInputChange}
                    value={formData.bankAddress}
                    placeholder="Enter Bank Address for Contact Details"
                    className="mt-2"
                    required
                  />
                </div>

                <div className="">
                  <Label className="mb-2" htmlFor="companyUniqueEGP_ID">
                    Company Unique EGP ID
                  </Label>
                  <Input
                    type="text"
                    name="companyUniqueEGP_ID"
                    onChange={handleInputChange}
                    value={formData.companyUniqueEGP_ID}
                    placeholder="Company Unique EGP ID"
                    className="mt-2"
                  />
                </div>

                {/* Years of General Experience */}
                <div className="">
                  <Label className="mb-2" htmlFor="yearsOfGeneralExperience">
                    Years of General Experience
                  </Label>
                  <Input
                    type="number"
                    name="yearsOfGeneralExperience"
                    onChange={handleInputChange}
                    value={formData.yearsOfGeneralExperience}
                    placeholder="Enter Years of General Experience"
                    className="mt-2"
                    min="0"
                  />
                </div>

                {/* Company Address */}
                <div className="">
                  <Label className="mb-2" htmlFor="lastUsePassDate">
                    Company Address<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="companyAddress"
                    onChange={handleInputChange}
                    value={formData.companyAddress}
                    placeholder="Enter Company Address"
                    className="mt-2"
                    required
                  />
                </div>

                {/* LTM District */}
                <div className="">
                  <Label className="mb-2" htmlFor="ltmDistrict">
                    LTM District<span className="text-red-700">*</span>
                  </Label>
                  <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-2"
                      >
                        {formData.ltmDistrict || "Search district..."}
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
                                  setFormData((prev) => ({
                                    ...prev,
                                    ltmDistrict: currentValue === prev.ltmDistrict ? "" : currentValue
                                  }));
                                  setDistrictOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.ltmDistrict === district ? "opacity-100" : "opacity-0"
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
              </div>
            </div>

            {/* Section 2: Legal & Authorization Documents */}
            <div className="space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">Legal & Authorization Documents</h2>
                <p className="text-sm text-gray-600 mt-1">File names for required documents in eGP account</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Trade Certificate - First */}
                <div className="">
                  <Label className="mb-2" htmlFor="trade">
                    Trade Certificate File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="trade"
                    onChange={handleInputChange}
                    value={formData.trade}
                    placeholder="Enter Trade"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Authorization Letter File Name - Second */}
                <div className="">
                  <Label className="mb-2" htmlFor="autho">
                    Authorization Letter File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="autho"
                    onChange={handleInputChange}
                    value={formData.autho}
                    placeholder="Enter Auto"
                    className="mt-2"
                    required
                  />
                </div>

                {/* TIN Certificate - Third */}
                <div className="">
                  <Label className="mb-2" htmlFor="tin">
                    TIN Certificate File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="tin"
                    onChange={handleInputChange}
                    value={formData.tin}
                    placeholder="Enter TIN Certificate"
                    className="mt-2"
                    required
                  />
                </div>

                {/* TIN Return Certificate - Fourth */}
                <div className="">
                  <Label className="mb-2" htmlFor="tinReturnCertificate">
                    TIN Return Certificate File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="tinReturnCertificate"
                    onChange={handleInputChange}
                    value={formData.tinReturnCertificate}
                    placeholder="Enter TIN Return Certificate"
                    className="mt-2"
                    required
                  />
                </div>

                {/* VAT Certificate - Fifth */}
                <div className="">
                  <Label className="mb-2" htmlFor="vat">
                    VAT Certificate File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="vat"
                    onChange={handleInputChange}
                    value={formData.vat}
                    placeholder="Enter Vat Certificate"
                    className="mt-2"
                    required
                  />
                </div>

                {/* VAT Return Certificate - Sixth */}
                <div className="">
                  <Label className="mb-2" htmlFor="vatReturnCertificate">
                    VAT Return Certificate File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="vatReturnCertificate"
                    onChange={handleInputChange}
                    value={formData.vatReturnCertificate}
                    placeholder="Enter VAT Return Certificate"
                    className="mt-2"
                    required
                  />
                </div>

                {/* NID - Seventh */}
                <div className="">
                  <Label className="mb-2" htmlFor="nid">
                    NID File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="nid"
                    onChange={handleInputChange}
                    value={formData.nid}
                    placeholder="NID"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Equipment - Eighth */}
                <div className="">
                  <Label className="mb-2" htmlFor="equipment">
                    Equipment List File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="equipment"
                    onChange={handleInputChange}
                    value={formData.equipment}
                    placeholder="Enter Equipment Requirement"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Manpower - Ninth */}
                <div className="">
                  <Label className="mb-2" htmlFor="manpower">
                    Manpower List File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="manpower"
                    onChange={handleInputChange}
                    value={formData.manpower}
                    placeholder="Enter Manpower Requirement"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Audit Report - Tenth */}
                <div className="">
                  <Label className="mb-2" htmlFor="updateAuditReportFileName">
                    Audit Report File Name<span className="text-red-700">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="updateAuditReportFileName"
                    onChange={handleInputChange}
                    value={formData.updateAuditReportFileName}
                    placeholder="Enter Audit Report File Name"
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </div>


            {/* Section 3: Departmental Wise LTM Enlistment Certificate */}
            <div className="space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">Departmental Wise LTM Enlistment Certificate</h2>
                <p className="text-sm text-gray-600 mt-1">Add department-specific license information</p>
              </div>

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
                          <tr
                            key={index}
                            className="border-t hover:bg-gray-50 transition-colors"
                          >
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

            <div className="col-span-full">
              {isDisabled ? (
                <Button disabled className="w-full cursor-pointer">
                  Submit
                </Button>
              ) : (
                <Button type="submit" className="w-full cursor-pointer">
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div >
    </section >
  );
};

export default CreateEgpListedCompany;
