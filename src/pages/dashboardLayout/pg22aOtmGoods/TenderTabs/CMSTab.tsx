// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Filter, Search, Trash2, X, Edit, Plus, ChevronsUpDown, Check, FileText, Building2, CalendarDays, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { config } from "@/lib/config";
import useSingleData from "@/hooks/useSingleData";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useAllDepartments from "@/hooks/useAllDepartments";

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

const OrganizationSearchDropdown = ({ value, onChange, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={value || undefined}
        className={`flex h-9 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-all text-left ${
          isOpen
            ? "border-[#4874c7] ring-2 ring-[#4874c7]/20"
            : "border-slate-200 hover:border-[#4874c7]/50"
        }`}
      >
        <span className={`truncate ${!value ? "text-slate-400" : "text-slate-700 font-medium"}`}>
          {value || "Select organization..."}
        </span>
        <ChevronsUpDown className={`h-4 w-4 shrink-0 ml-2 transition-colors ${isOpen ? "text-[#4874c7]" : "text-slate-400"}`} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-xl ring-1 ring-[#4874c7]/10 overflow-hidden">
          {/* Search header */}
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 bg-[#4874c7]/5">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#4874c7]" />
            <input
              autoFocus
              placeholder="Search organization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-800"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-0.5 hover:bg-[#4874c7]/10 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-[#4874c7]" />
              </button>
            )}
          </div>
          {/* Items list */}
          <div className="max-h-52 overflow-y-auto py-1">
            {filteredData.length === 0 ? (
              <div className="py-5 text-center text-sm text-slate-400">No organization found.</div>
            ) : (
              filteredData.map((item) => {
                const selected = value === item;
                return (
                  <button
                    key={item}
                    type="button"
                    title={item}
                    onClick={() => {
                      onChange(item);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`relative flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors text-left ${
                      selected
                        ? "bg-[#4874c7]/10 text-[#4874c7] font-semibold"
                        : "text-slate-700 hover:bg-[#4874c7]/5 hover:text-[#4874c7]"
                    }`}
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {selected && <Check className="h-3.5 w-3.5 stroke-[3px] text-[#4874c7]" />}
                    </span>
                    <span className="truncate">{item}</span>
                  </button>
                );
              })
            )}
          </div>
          {/* Footer count */}
          <div className="border-t border-slate-100 px-3 py-1.5 bg-slate-50">
            <span className="text-[10px] text-slate-400">{filteredData.length} organization{filteredData.length !== 1 ? "s" : ""} found</span>
          </div>
        </div>
      )}
    </div>
  );
};


export const CMSTab = ({
  completedContracts,
  ongoingContracts,
  loading,
  setReload,
  setActiveTab,
  onEditContract,
  egpEmail,
}) => {
  const { departments } = useAllDepartments();
  const organizations = useMemo(() => {
    if (!departments || !Array.isArray(departments)) return [];
    return [...new Set(departments.map((d) => d.organization).filter(Boolean))];
  }, [departments]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tenderId: "",
    companyId: "",
    financialYear: "",
    Name_Of_Contractor: "",
    Role_in_Contract: "1",
    procurementMethod: "",
    organization: "",
    contractValue: "",
    commencementDate: "",
    intendedCompletionDate: "",
    contractPeriodExtendedUpTo: "",
    Status_Complite_ongoing: "Ongoing",
    contractSigningDate: "",
    descriptionOfWorks: "",
    paymentAmount: "",
    WorksInHand: "",
    jvShare: "",
    procuringEntityName: "",
  });
  const financialYears = useMemo(() => generateFinancialYears(), []);

  const url = egpEmail ? `${config.apiBaseUrl}/egp-listed-company/get-by-mail?mail=${egpEmail}` : null;
  const { data: egpListedCompany } = useSingleData(url);

  React.useEffect(() => {
    if (egpListedCompany?.companyUniqueEGP_ID && !formData.companyId) {
      setFormData(prev => ({ ...prev, companyId: egpListedCompany.companyUniqueEGP_ID }));
    }
  }, [egpListedCompany]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Adding contract information...");
    try {
      const contractVal = parseFloat(formData.contractValue) || 0;
      const paymentAmt = parseFloat(formData.paymentAmount) || 0;
      const calculatedWorksInHand = Math.max(0, contractVal - paymentAmt);

      const dataToSubmit = {
        ...formData,
        contractValue: contractVal,
        paymentAmount: paymentAmt,
        WorksInHand: calculatedWorksInHand,
        jvShare: parseFloat(formData.jvShare) || 0,
      };
      
      const response = await axiosInstance.post("/contract-information/create-contract-information", [dataToSubmit]);
      
      if (response.data) {
        toast.success("Contract information added successfully", { id: toastId });
        setIsAddDialogOpen(false);
        setFormData({
          tenderId: "",
          companyId: egpListedCompany?.companyUniqueEGP_ID || "",
          financialYear: "",
          Name_Of_Contractor: "",
          Role_in_Contract: "1",
          procurementMethod: "",
          organization: "",
          contractValue: "",
          commencementDate: "",
          intendedCompletionDate: "",
          contractPeriodExtendedUpTo: "",
          Status_Complite_ongoing: "Ongoing",
          contractSigningDate: "",
          descriptionOfWorks: "",
          paymentAmount: "",
          WorksInHand: "",
          jvShare: "",
          procuringEntityName: "",
        });
        if (setReload) setReload((prev) => prev + 1);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add contract";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine all contracts (completed + ongoing)
  const allContracts = useMemo(() => {
    const completed =
      completedContracts?.map((contract) => ({
        ...contract,
        contractStatus: "Completed",
      })) || [];

    const ongoing =
      ongoingContracts?.map((contract) => ({
        ...contract,
        contractStatus: "Ongoing",
      })) || [];

    return [...completed, ...ongoing].sort(
      (a, b) => b.financialYear?.localeCompare(a.financialYear || "") || 0
    );
  }, [completedContracts, ongoingContracts]);

  // Extract unique location districts for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = new Set();
    allContracts.forEach((contract) => {
      if (contract.locationDistrict && contract.locationDistrict !== "N/A") {
        locations.add(contract.locationDistrict);
      }
    });
    return Array.from(locations).sort();
  }, [allContracts]);

  // Apply filters to contracts
  const filteredContracts = useMemo(() => {
    return allContracts.filter((contract) => {
      // Search filter - multi-field search
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          contract.tenderId?.toLowerCase().includes(search) ||
          contract.Name_Of_Contractor?.toLowerCase().includes(search) ||
          contract.organization?.toLowerCase().includes(search) ||
          contract.procuringEntityName?.toLowerCase().includes(search) ||
          contract.companyId?.toLowerCase().includes(search) ||
          contract.descriptionOfWorks?.toLowerCase().includes(search);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        const contractStatusLower = contract.contractStatus?.toLowerCase();
        if (contractStatusLower !== statusFilter) return false;
      }

      // Location filter
      if (locationFilter !== "all") {
        if (contract.locationDistrict !== locationFilter) return false;
      }

      return true;
    });
  }, [allContracts, searchTerm, statusFilter, locationFilter]);

  // Group filtered contracts by financial year
  const groupedByYear = useMemo(() => {
    const groups = {};
    filteredContracts.forEach((contract) => {
      const year = contract.financialYear || "Unknown";
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(contract);
    });
    return groups;
  }, [filteredContracts]);

  // Get sorted years (newest first)
  const sortedYears = useMemo(() => {
    return Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));
  }, [groupedByYear]);

  // Calculate filtered summary counts
  const filteredSummary = useMemo(() => {
    const completed = filteredContracts.filter((c) => c.contractStatus === "Completed").length;
    const ongoing = filteredContracts.filter((c) => c.contractStatus === "Ongoing").length;
    return { total: filteredContracts.length, completed, ongoing };
  }, [filteredContracts]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLocationFilter("all");
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (contract) => {
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (contract) => {
    if (onEditContract && setActiveTab) {
      onEditContract(contract._id);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!contractToDelete?._id) {
      toast.error("Contract ID is missing");
      return;
    }

    setDeletingId(contractToDelete._id);
    setDeleteDialogOpen(false);
    const toastId = toast.loading("Deleting contract...");

    try {
      const response = await axiosInstance.delete(`/contract-information/${contractToDelete._id}`);

      if (response.data?.success) {
        toast.success("Contract deleted successfully", { id: toastId });
        // Trigger parent reload to refresh all tabs
        if (setReload) {
          setReload((prev) => prev + 1);
        }
      } else {
        throw new Error(response.data?.message || "Failed to delete");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to delete contract";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setDeletingId(null);
      setContractToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-gray-500">Loading CMS data...</p>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-purple-800 text-xl">Contract Management System (CMS)</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex gap-2 items-center bg-blue-600 rounded-md px-3 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            Add New <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex gap-2 items-center bg-black rounded-md px-3 py-2 text-white hover:bg-gray-800 transition-colors"
          >
            {showFilter ? "Hide Filter" : "Show Filter"} <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilter && (
        <div className="p-4 bg-white rounded-md border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tender ID, Contractor, Organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location District</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 invisible">Clear</label>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== "all" || locationFilter !== "all") && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Status: {statusFilter}
                </span>
              )}
              {locationFilter !== "all" && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                  Location: {locationFilter}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Total Contracts</p>
          <p className="text-2xl font-bold text-purple-600">{filteredSummary.total}</p>
          {filteredSummary.total !== allContracts.length && (
            <p className="text-xs text-gray-500 mt-1">of {allContracts.length} total</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{filteredSummary.completed}</p>
          {filteredSummary.total !== allContracts.length && (
            <p className="text-xs text-gray-500 mt-1">of {completedContracts?.length || 0} total</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Ongoing</p>
          <p className="text-2xl font-bold text-orange-600">{filteredSummary.ongoing}</p>
          {filteredSummary.total !== allContracts.length && (
            <p className="text-xs text-gray-500 mt-1">of {ongoingContracts?.length || 0} total</p>
          )}
        </div>
      </div>

      {/* Contracts Grouped by Financial Year */}
      <div className="space-y-6">
        {sortedYears.length > 0 ? (
          sortedYears.map((year) => {
            const contracts = groupedByYear[year];
            let serialCounter = 0;

            return (
              <div key={year} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Year Header */}
                <div className="bg-gray-700 text-white px-4 py-3">
                  <h4 className="text-lg font-bold">Financial Year: {year}</h4>
                  <p className="text-sm text-gray-300">{contracts.length} contract(s)</p>
                </div>

                {/* Contracts Table for this year */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                      <tr>
                        <th className="p-3">SL</th>
                        <th className="p-3">Actions</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Company ID</th>
                        <th className="p-3">Tender ID</th>
                        <th className="p-3">Procurement Type</th>
                        <th className="p-3">Procurement Nature</th>
                        <th className="p-3">Procurement Method</th>
                        <th className="p-3">APP ID</th>
                        <th className="p-3">Budget Type</th>
                        <th className="p-3">Dev Partner</th>
                        <th className="p-3">Ministry</th>
                        <th className="p-3">Organization</th>
                        <th className="p-3">Division</th>
                        <th className="p-3">Location District</th>
                        <th className="p-3">LTM License</th>
                        <th className="p-3">PE Name</th>
                        <th className="p-3">PE Designation</th>
                        <th className="p-3">PE Address</th>
                        <th className="p-3">PE City</th>
                        <th className="p-3">PE Thana</th>
                        <th className="p-3">PE District</th>
                        <th className="p-3">Project Name</th>
                        <th className="p-3">Project Code</th>
                        <th className="p-3">Source of Funds</th>
                        <th className="p-3">Package No</th>
                        <th className="p-3">Tender Category</th>
                        <th className="p-3">Sub Categories</th>
                        <th className="p-3">Lot ID</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Publication Date</th>
                        <th className="p-3">Opening Date</th>
                        <th className="p-3">Tentative Start</th>
                        <th className="p-3">Tentative Completion</th>
                        <th className="p-3">NOA Date</th>
                        <th className="p-3">Signing Date</th>
                        <th className="p-3">Commencement Date</th>
                        <th className="p-3">Contract Start</th>
                        <th className="p-3">Intended Completion</th>
                        <th className="p-3">Contract End</th>
                        <th className="p-3">Extended Up To</th>
                        <th className="p-3 text-right">Estimated Cost</th>
                        <th className="p-3 text-right">Contract Value</th>
                        <th className="p-3 text-right">Revised Value</th>
                        <th className="p-3 text-right">Payment Amount</th>
                        <th className="p-3 text-right">JV Share (%)</th>
                        <th className="p-3 text-right">Actual Payment (JV)</th>
                        <th className="p-3">JVCA</th>
                        <th className="p-3">Contractor Name</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Memo No (WCC)</th>
                        <th className="p-3">Memo Date</th>
                        <th className="p-3">Bill Payment Date</th>
                        <th className="p-3">WCC File</th>
                        <th className="p-3">Payment Cert File</th>
                        <th className="p-3 text-right">Works In Hand</th>
                        <th className="p-3">Created At</th>
                        <th className="p-3">Updated At</th>
                      </tr>
                    </thead>
                    <tbody className="whitespace-nowrap">
                      {contracts.map((contract, index) => {
                        serialCounter++;
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3">{serialCounter}</td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditClick(contract)}
                                  className="h-8 px-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                                  title="Edit Contract"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteClick(contract)}
                                  disabled={deletingId === contract._id}
                                  className="h-8 px-2"
                                  title="Delete Contract"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  contract.contractStatus === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {contract.contractStatus}
                              </span>
                            </td>
                            <td className="p-3">{contract.companyId || "N/A"}</td>
                            <td className="p-3">{contract.tenderId || "N/A"}</td>
                            <td className="p-3">{contract.procurementType || "N/A"}</td>
                            <td className="p-3">{contract.procurementNature || "N/A"}</td>
                            <td className="p-3">{contract.procurementMethod || "N/A"}</td>
                            <td className="p-3">{contract.appId || "N/A"}</td>
                            <td className="p-3">{contract.budgetType || "N/A"}</td>
                            <td className="p-3">{contract.development_partner || "N/A"}</td>
                            <td className="p-3">{contract.ministry || "N/A"}</td>
                            <td className="p-3">{contract.organization || "N/A"}</td>
                            <td className="p-3">{contract.division || "N/A"}</td>
                            <td className="p-3">{contract.locationDistrict || "N/A"}</td>
                            <td className="p-3">{contract.LtmLicenseNameCode || "N/A"}</td>
                            <td className="p-3">{contract.procuringEntityName || "N/A"}</td>
                            <td className="p-3">{contract.PE_officialDesignation || "N/A"}</td>
                            <td className="p-3">{contract.PE_Address || "N/A"}</td>
                            <td className="p-3">{contract.PE_City || "N/A"}</td>
                            <td className="p-3">{contract.PE_Thana || "N/A"}</td>
                            <td className="p-3">{contract.PE_District || "N/A"}</td>
                            <td className="p-3">{contract.ProjectName || "N/A"}</td>
                            <td className="p-3">{contract.ProjectCode || "N/A"}</td>
                            <td className="p-3">{contract.sourceOfFunds || "N/A"}</td>
                            <td className="p-3">{contract.packageNo || "N/A"}</td>
                            <td className="p-3">{contract.selectedTenderCategory || "N/A"}</td>
                            <td className="p-3">{contract.tender_subCategories || "N/A"}</td>
                            <td className="p-3">{contract.identificationOfLot || "N/A"}</td>
                            <td className="p-3 truncate">{contract.descriptionOfWorks || "N/A"}</td>
                            <td className="p-3">{contract.publicationDateTime ? new Date(contract.publicationDateTime).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.openingDateTime ? new Date(contract.openingDateTime).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.TentativeStartDate ? new Date(contract.TentativeStartDate).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.TentativeCompletionDate ? new Date(contract.TentativeCompletionDate).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.noaIssueDate ? new Date(contract.noaIssueDate).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.contractSigningDate ? new Date(contract.contractSigningDate).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.commencementDate ? new Date(contract.commencementDate).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.contractStartDate ? new Date(contract.contractStartDate).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.intendedCompletionDate ? new Date(contract.intendedCompletionDate).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.contractEndDate ? new Date(contract.contractEndDate).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.contractPeriodExtendedUpTo ? new Date(contract.contractPeriodExtendedUpTo).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3 text-right">{contract.estimatedCost ? Number(contract.estimatedCost).toLocaleString("en-IN") : "0"}</td>
                            <td className="p-3 text-right">{contract.contractValue ? Number(contract.contractValue).toLocaleString("en-IN") : "0"}</td>
                            <td className="p-3 text-right">{contract.revisedContractValue ? Number(contract.revisedContractValue).toLocaleString("en-IN") : "0"}</td>
                            <td className="p-3 text-right">{contract.paymentAmount ? Number(contract.paymentAmount).toLocaleString("en-IN") : "0"}</td>
                            <td className="p-3 text-right">{contract.jvShare || "0"}%</td>
                            <td className="p-3 text-right">{contract.actualPaymentJvShare ? Number(contract.actualPaymentJvShare).toLocaleString("en-IN") : "0"}</td>
                            <td className="p-3">{contract.jvca || "N/A"}</td>
                            <td className="p-3">{contract.Name_Of_Contractor || "N/A"}</td>
                            <td className="p-3">{contract.Role_in_Contract === "1" ? "Prime" : contract.Role_in_Contract === "2" ? "Sub" : contract.Role_in_Contract === "3" ? "Mgmt" : "N/A"}</td>
                            <td className="p-3">{contract.Memo_Number_WCC || "N/A"}</td>
                            <td className="p-3">{contract.Memo_Date_WCC ? new Date(contract.Memo_Date_WCC).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.Bill_Payment_Date ? new Date(contract.Bill_Payment_Date).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.workCompletationCertificateFileName || "N/A"}</td>
                            <td className="p-3">{contract.paymentCertificateFileName || "N/A"}</td>
                            <td className="p-3 text-right">{contract.WorksInHand || "0"}</td>
                            <td className="p-3">{contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : "N/A"}</td>
                            <td className="p-3">{contract.updatedAt ? new Date(contract.updatedAt).toLocaleDateString() : "N/A"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || locationFilter !== "all"
                ? "No contracts found matching your filters"
                : "No contracts found"}
            </p>
            {(searchTerm || statusFilter !== "all" || locationFilter !== "all") && (
              <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contract?
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <p>
                  <strong>Tender ID:</strong> {contractToDelete?.tenderId || "N/A"}
                </p>
                <p>
                  <strong>Contractor:</strong> {contractToDelete?.Name_Of_Contractor || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {contractToDelete?.contractStatus || "N/A"}
                </p>
              </div>
              <p className="mt-2 text-red-600 font-medium">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add New Contract Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden max-h-[92vh] flex flex-col">
          {/* Header — matches app brand color #4874c7 */}
          <div className="bg-[#4874c7] px-7 py-5 flex items-start gap-4 shrink-0">
            <div className="bg-white/20 rounded-xl p-2.5 mt-0.5">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight leading-tight">
                Add New Contract
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-sm mt-0.5">
                Fill in the details below to create a new contract entry.
              </DialogDescription>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="overflow-y-auto flex-1 px-7 py-5 space-y-6">

              {/* Section 1 – Contract Identity */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-[#4874c7]" />
                  <span className="text-xs font-semibold text-[#4874c7] uppercase tracking-widest">Contract Identity</span>
                  <div className="flex-1 h-px bg-[#4874c7]/20" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="tenderId" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tender ID <span className="text-red-500">*</span></Label>
                    <Input
                      id="tenderId"
                      required
                      value={formData.tenderId}
                      onChange={(e) => setFormData({ ...formData, tenderId: e.target.value })}
                      placeholder="e.g. TND-2024-001"
                      className="h-9 text-sm border-slate-200 focus:border-[#4874c7] focus:ring-[#4874c7]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="companyId" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Company ID</Label>
                    <Input
                      id="companyId"
                      disabled
                      value={formData.companyId}
                      placeholder="Auto-loaded..."
                      className="h-9 text-sm bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="financialYear" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Financial Year <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.financialYear}
                      onValueChange={(value) => setFormData({ ...formData, financialYear: value })}
                      required
                    >
                      <SelectTrigger className="h-9 text-sm border-slate-200">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {financialYears.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="Name_Of_Contractor" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Contractor Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="Name_Of_Contractor"
                      required
                      value={formData.Name_Of_Contractor}
                      onChange={(e) => setFormData({ ...formData, Name_Of_Contractor: e.target.value })}
                      placeholder="Enter contractor name"
                      className="h-9 text-sm border-slate-200 focus:border-[#4874c7] focus:ring-[#4874c7]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Role in Contract <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.Role_in_Contract}
                      onValueChange={(value) => setFormData({ ...formData, Role_in_Contract: value })}
                      required
                    >
                      <SelectTrigger className="h-9 text-sm border-slate-200 focus:border-[#4874c7]">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Prime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.Status_Complite_ongoing}
                      onValueChange={(value) => setFormData({ ...formData, Status_Complite_ongoing: value })}
                      required
                    >
                      <SelectTrigger className="h-9 text-sm border-slate-200 focus:border-[#4874c7]">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section 2 – Financial */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-[#4874c7]" />
                  <span className="text-xs font-semibold text-[#4874c7] uppercase tracking-widest">Financial Details</span>
                  <div className="flex-1 h-px bg-[#4874c7]/20" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contractValue" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Contract Value <span className="text-red-500">*</span></Label>
                    <Input
                      id="contractValue"
                      required
                      type="number"
                      value={formData.contractValue}
                      onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                      placeholder="0.00"
                      className="h-9 text-sm border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="paymentAmount" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Payment Amount</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                      placeholder="0.00"
                      className="h-9 text-sm border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Procurement Method</Label>
                    <Select
                      value={formData.procurementMethod}
                      onValueChange={(value) => setFormData({ ...formData, procurementMethod: value })}
                    >
                      <SelectTrigger className="h-9 text-sm border-slate-200">
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OTM">OTM</SelectItem>
                        <SelectItem value="LTM">LTM</SelectItem>
                        <SelectItem value="OSTETM">OSTETM</SelectItem>
                        <SelectItem value="RFQ">RFQ</SelectItem>
                        <SelectItem value="DPM">DPM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="jvShare" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">JV Share (%)</Label>
                    <Input
                      id="jvShare"
                      type="number"
                      value={formData.jvShare}
                      onChange={(e) => setFormData({ ...formData, jvShare: e.target.value })}
                      placeholder="0"
                      className="h-9 text-sm border-slate-200 focus:border-[#4874c7] focus:ring-[#4874c7]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 – Dates */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-4 h-4 text-[#4874c7]" />
                  <span className="text-xs font-semibold text-[#4874c7] uppercase tracking-widest">Key Dates</span>
                  <div className="flex-1 h-px bg-[#4874c7]/20" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="commencementDate" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Work Order Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="commencementDate"
                      required
                      type="date"
                      value={formData.commencementDate}
                      onChange={(e) => setFormData({ ...formData, commencementDate: e.target.value })}
                      className="h-9 text-sm border-slate-200 focus:border-[#4874c7] focus:ring-[#4874c7]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="intendedCompletionDate" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Work Completion Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="intendedCompletionDate"
                      required
                      type="date"
                      value={formData.intendedCompletionDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          intendedCompletionDate: val,
                          contractPeriodExtendedUpTo: val,
                        }));
                      }}
                      className="h-9 text-sm border-slate-200 focus:border-[#4874c7] focus:ring-[#4874c7]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4 – Organization & Additional */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-[#4874c7]" />
                  <span className="text-xs font-semibold text-[#4874c7] uppercase tracking-widest">Organization & Additional</span>
                  <div className="flex-1 h-px bg-[#4874c7]/20" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="procuringEntityName" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">PE Name</Label>
                    <Input
                      id="procuringEntityName"
                      value={formData.procuringEntityName}
                      onChange={(e) => setFormData({ ...formData, procuringEntityName: e.target.value })}
                      placeholder="Procuring entity name"
                      className="h-9 text-sm border-slate-200 focus:border-[#4874c7] focus:ring-[#4874c7]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Organization</Label>
                    <OrganizationSearchDropdown
                      value={formData.organization}
                      onChange={(val) => setFormData((prev) => ({ ...prev, organization: val }))}
                      data={organizations || []}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="descriptionOfWorks" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Description of Works</Label>
                    <Textarea
                      id="descriptionOfWorks"
                      value={formData.descriptionOfWorks}
                      onChange={(e) => setFormData({ ...formData, descriptionOfWorks: e.target.value })}
                      placeholder="Brief description of the work scope..."
                      rows={3}
                      className="text-sm border-slate-200 resize-none focus:border-[#4874c7] focus:ring-[#4874c7]/20"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-7 py-4 flex items-center justify-between shrink-0">
              <p className="text-xs text-slate-400"><span className="text-red-400">*</span> Required fields</p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="h-9 px-5 text-sm border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-6 text-sm bg-[#4874c7] hover:bg-[#3a5fa8] text-white shadow-sm transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
                  ) : "Save Contract"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
