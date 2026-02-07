// @ts-nocheck
import { config } from "@/lib/config";
import UserEgpMail from "@/components/dashboard/UserEgpMail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createData } from "@/lib/createData";
import { AuthContext } from "@/provider/AuthProvider";
import { CartContext } from "@/provider/CartContext";
import { AlignJustify, LayoutDashboard, Plus, X, Calendar } from "lucide-react";
import { useContext, useState, useMemo, Fragment } from "react";
import { Link } from "react-router-dom";
import useAllTenderPreparation from "@/hooks/useAllTenderPreparation"
import axiosInstance from "@/lib/axiosInstance";

const PgTwoTowOtmGoods = () => {
  const { user } = useContext(AuthContext);
  const { setReload } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10000);
  const { data, setReload: dataReload, loading, count } = useAllTenderPreparation(searchTerm, currentPage, pageLimit, user?.email)

  // State for tracking which items are being updated
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    userMail: user?.email,
    egpMail: "",
    tenderId: "",
  });

  const [OTMGoods, setOTMGoods] = useState([]);

  // Temporary single order form
  const [currentOTMGoods, setCurrentOTMGoods] = useState({
    userMail: user?.email,
    serviceId: 1003,
    egpMail: "",
    tenderId: "",
    tenderType: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOTMGoods((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrder = () => {
    if (!currentOTMGoods.egpMail || !currentOTMGoods.tenderId || !currentOTMGoods.tenderType) {
      alert("Please fill all required fields");
      return;
    }
    const url = `${config.apiBaseUrl}/tender-preparation/create-tender-preparation`
    const orderToAdd = {
      ...currentOTMGoods,
      egpEmail: currentOTMGoods?.egpMail,
      tenderId: Number(currentOTMGoods.tenderId),
      tenderType: currentOTMGoods.tenderType,
    };

    setOTMGoods((prev) => [...prev, orderToAdd]);
    createData(url, orderToAdd, dataReload)
    // Reset egpMail & tenderId but keep userMail
    // setCurrentOrder({
    //     userMail: user?.email,
    //     egpMail: "",
    //     tenderId: "",
    // });
  };

  const handleRemoveOrder = (index) => {
    setOTMGoods((prev) => prev.filter((_, i) => i !== index));
  };

  const setReset = () => {
    setOTMGoods([]);
  };

  // Handle field updates via PATCH API
  const handleUpdate = async (id: string, field: string, value: string) => {
    try {
      setUpdating(prev => ({ ...prev, [`${id}-${field}`]: true }));

      await axiosInstance.patch(`/tender-preparation/${id}`, {
        [field]: value
      });

      // Reload data to reflect changes
      dataReload(prev => prev + 1);


    } catch (error) {
      console.error('Update failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update. Please try again.';
      alert(errorMessage);
    } finally {
      setUpdating(prev => ({ ...prev, [`${id}-${field}`]: false }));
    }
  };

  // Group data by opening date
  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return {};

    const grouped: Record<string, any[]> = {};

    data.forEach((item) => {
      // Format opening date
      const openingDate = item.openingDateTime
        ? new Date(item.openingDateTime).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
        : 'No Closing Date';

      if (!grouped[openingDate]) {
        grouped[openingDate] = [];
      }

      grouped[openingDate].push({
        ...item,
        formattedDate: openingDate
      });
    });

    // Sort groups by date (most recent first)
    const sortedGrouped: Record<string, any[]> = {};
    Object.keys(grouped)
      .sort((a, b) => {
        if (a === 'No Closing Date') return 1;
        if (b === 'No Closing Date') return -1;

        // Find first item with valid date in each group
        const dateA = grouped[a].find(item => item.openingDateTime)?.openingDateTime;
        const dateB = grouped[b].find(item => item.openingDateTime)?.openingDateTime;

        if (!dateA) return 1;
        if (!dateB) return -1;

        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .forEach(key => {
        // Sort items within each group by tender ID
        // This ensures same tender IDs appear together
        sortedGrouped[key] = grouped[key].sort((a, b) => {
          // Sort by tender ID
          if (a.tenderId < b.tenderId) return -1;
          if (a.tenderId > b.tenderId) return 1;
          return 0;
        });
      });

    return sortedGrouped;
  }, [data]);

  // Final submit to backend
  const handleFinalSubmit = async () => {
    if (OTMGoods.length === 0) {
      alert("No orders to submit");
      return;
    }

    const url = `${config.apiBaseUrl}/jobOrder-cart/create-multiple-jobOrderCart`;
    createData(url, OTMGoods, setReload, setReset);
  };
  return (
    <div className="min-h-lvh p-5">
      {/* <div className="flex gap-5 max-sm:gap-3 flex-wrap max-w-2xl shadow mx-auto p-5 rounded-lg">
        <div className="max-sm:w-full">
          <Label htmlFor="egpEmail">
            E-GP Email<span className="text-red-700">*</span>
          </Label>
          <UserEgpMail
            setFormData={setCurrentOTMGoods}
            value={currentOTMGoods.egpMail}
          />
        </div>

        
        <div className="max-sm:w-full">
          <Label htmlFor="tenderId">
            Tender Id<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="tenderId"
            onChange={handleInputChange}
            value={currentOTMGoods.tenderId}
            placeholder="Enter Tender Id"
            className="mt-2"
            required
          />
        </div>

        <div className="max-sm:w-full">
          <Label className="invisible" htmlFor="addOrder">
            Add
          </Label>
          <Button
            type="button"
            className="mt-2 max-sm:w-full"
            onClick={handleAddOrder}
          >
            Create OTM Goods
          </Button>
        </div>
      </div> */}

      {/* Show added orders */}
      {/* {OTMGoods.length > 0 && (
        <div className="max-w-xl mx-auto mt-5 p-4 border rounded max-sm:w-full">
          <h3 className="font-semibold mb-2">Added Orders:</h3>
          <div className="list-disc pl-5">
            {OTMGoods.map((order, idx) => (
              <div
                key={idx}
                className="mb-3 shadow-sm p-2 rounded bg-gray-50 flex justify-between"
              >
                <div>
                  <strong>{order.egpMail}</strong> - {order.tenderId}
                </div>
                <X
                  onClick={() => handleRemoveOrder(idx)}
                  className="cursor-pointer"
                  size={16}
                />
              </div>
            ))}
          </div>

           <Button
            type="button"
            className="mt-4 max-sm:w-full"
            onClick={handleFinalSubmit}
          >
            Submit All Orders
          </Button>
        </div>
      )} */}

      <div>
        {/* Header Section */}
        <div className="flex max-md:flex-col max-md:gap-4 justify-between mt-5">
          <div className="flex items-center gap-2">
            <AlignJustify />
            <h1 className="text-2xl max-sm:text-xl font-semibold mb-1">Tender Preparation</h1>
          </div>

          {/* Search Input - Mobile Full Width */}
          <div className="max-md:w-full">
            <Input
              placeholder="Search"
              className="max-md:w-full"
            />
          </div>
        </div>

        {/* Form Section - Responsive */}
        <div className="mt-5 p-4 max-sm:p-3 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-sm:gap-3">
            {/* E-GP Email */}
            <div className="w-full">
              <Label htmlFor="egpEmail" className="text-sm">
                E-GP Email<span className="text-red-700">*</span>
              </Label>
              <UserEgpMail
                setFormData={setCurrentOTMGoods}
                value={currentOTMGoods.egpMail}
              />
            </div>

            {/* Tender Type */}
            <div className="w-full">
              <Label htmlFor="tenderType" className="text-sm">
                Tender Type<span className="text-red-700">*</span>
              </Label>
              <Select
                value={currentOTMGoods.tenderType}
                onValueChange={(value) =>
                  setCurrentOTMGoods((prev) => ({ ...prev, tenderType: value }))
                }
              >
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OTM Goods">OTM Goods</SelectItem>
                  <SelectItem value="OTM Works">OTM Works</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tender Id */}
            <div className="w-full">
              <Label htmlFor="tenderId" className="text-sm">
                Tender Id<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="tenderId"
                onChange={handleInputChange}
                value={currentOTMGoods.tenderId}
                placeholder="Enter Tender Id"
                className="mt-2 w-full"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="w-full flex items-end">
              <Button
                type="button"
                className="w-full"
                onClick={handleAddOrder}
              >
                Create OTM
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section - Desktop */}
        <div className="overflow-x-auto mt-5">
          <table className="w-full max-lg:hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  SL
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Tender Id
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Egp Info
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Tender Type
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Method
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Line of Credit
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Pay Order Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Working Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  Dashboard
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading && Object.entries(groupedData).map(([closingDate, items]) => (
                <Fragment key={closingDate}>
                  {/* Group Header Row */}
                  <tr className="bg-blue-50 border-t-2 border-blue-200">
                    <td colSpan={10} className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">
                          Closing Date: {closingDate}
                        </span>
                        <span className="text-sm text-blue-600">
                          ({items.length} tender{items.length > 1 ? 's' : ''})
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Tender Rows for this group */}
                  {items.map((item, idx) => (
                    <tr key={item._id} className="border bg-gray-100 hover:bg-gray-200">
                      <td className="px-4 py-2">{idx + 1}</td>

                      {/* Created Date */}
                      <td className="px-4 py-2">
                        {item?.createdAt
                          ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                          : 'N/A'
                        }
                      </td>

                      <td className="px-4 py-2">{item?.tenderId}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{item?.egpEmail}</span>
                          <span className="text-xs text-slate-500">{item?.egpCompanyName || 'N/A'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-2">{item?.tenderType}</td>
                      <td className="px-4 py-2">{item?.tenderMethod}</td>

                      {/* Line of Credit Dropdown */}
                      <td className="px-4 py-2">
                        <Select
                          value={item?.lineOfCredit || ''}
                          onValueChange={(value) => handleUpdate(item._id, 'lineOfCredit', value)}
                          disabled={updating[`${item._id}-lineOfCredit`]}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Pay Order Status Dropdown */}
                      <td className="px-4 py-2">
                        <Select
                          value={item?.payOrderStatus || ''}
                          onValueChange={(value) => handleUpdate(item._id, 'payOrderStatus', value)}
                          disabled={updating[`${item._id}-payOrderStatus`]}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Working Status Dropdown */}
                      <td className="px-4 py-2">
                        <Select
                          value={item?.status || ''}
                          onValueChange={(value) => handleUpdate(item._id, 'status', value)}
                          disabled={updating[`${item._id}-status`]}
                        >
                          <SelectTrigger className="w-36 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under_preparation">Under Preparation</SelectItem>
                            <SelectItem value="wait_for_submit">Wait for Submit</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Link to={`/dashboard/tenderdashboard/${item?._id}`}>
                          <LayoutDashboard className="cursor-pointer hover:text-primary" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-3 mt-3">
            {!loading && Object.entries(groupedData).map(([closingDate, items]) => (
              <div key={`mobile-group-${closingDate}`}>
                {/* Group Header */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-900 text-sm">
                      Closing: {closingDate}
                    </span>
                    <span className="text-xs text-blue-600">
                      ({items.length})
                    </span>
                  </div>
                </div>

                {/* Tender Cards for this group */}
                {items.map((item, idx) => (
                  <div key={item._id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-lg">ID: {item?.tenderId}</span>
                      </div>
                      <Link to={`/dashboard/tenderdashboard/${item?._id}`}>
                        <LayoutDashboard className="cursor-pointer hover:text-primary" size={24} />
                      </Link>
                    </div>

                    <div className="space-y-2 text-sm">
                      {/* Created Date */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {item?.createdAt
                            ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                            : 'N/A'
                          }
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">EGP Email:</span>
                        <span className="font-medium text-xs break-all">{item?.egpEmail}</span>
                      </div>

                      {/* Company Name */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-medium text-xs">{item?.egpCompanyName || 'N/A'}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Tender Type:</span>
                        <span className="font-medium">{item?.tenderType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium">{item?.tenderMethod || 'N/A'}</span>
                      </div>

                      {/* Line of Credit Dropdown */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Line of Credit:</span>
                        <Select
                          value={item?.lineOfCredit || ''}
                          onValueChange={(value) => handleUpdate(item._id, 'lineOfCredit', value)}
                          disabled={updating[`${item._id}-lineOfCredit`]}
                        >
                          <SelectTrigger className="w-20 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Pay Order Status Dropdown */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pay Order:</span>
                        <Select
                          value={item?.payOrderStatus || ''}
                          onValueChange={(value) => handleUpdate(item._id, 'payOrderStatus', value)}
                          disabled={updating[`${item._id}-payOrderStatus`]}
                        >
                          <SelectTrigger className="w-20 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Working Status Dropdown */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Working Status:</span>
                        <Select
                          value={item?.status || ''}
                          onValueChange={(value) => handleUpdate(item._id, 'status', value)}
                          disabled={updating[`${item._id}-status`]}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under_preparation">Under Preparation</SelectItem>
                            <SelectItem value="wait_for_submit">Wait for Submit</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 text-gray-500">
                Loading...
              </div>
            )}

            {/* Empty State */}
            {!loading && Object.keys(groupedData).length === 0 && (
              <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
                No tender preparation data found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PgTwoTowOtmGoods;
