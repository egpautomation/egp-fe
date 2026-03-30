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
import useAllTenderPreparation from "@/hooks/useAllTenderPreparation";
import axiosInstance from "@/lib/axiosInstance";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PgTwoTowOtmGoods = () => {
  const { user } = useContext(AuthContext);
  const { setReload } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10000);
  const {
    data,
    setReload: dataReload,
    loading,
    count,
  } = useAllTenderPreparation(searchTerm, currentPage, pageLimit, user?.email);

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
    const url = `${config.apiBaseUrl}/tender-preparation/create-tender-preparation`;
    const orderToAdd = {
      ...currentOTMGoods,
      egpEmail: currentOTMGoods?.egpMail,
      tenderId: Number(currentOTMGoods.tenderId),
      tenderType: currentOTMGoods.tenderType,
    };

    setOTMGoods((prev) => [...prev, orderToAdd]);
    createData(url, orderToAdd, dataReload);
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
      setUpdating((prev) => ({ ...prev, [`${id}-${field}`]: true }));

      await axiosInstance.patch(`/tender-preparation/${id}`, {
        [field]: value,
      });

      // Reload data to reflect changes
      dataReload((prev) => prev + 1);
    } catch (error) {
      console.error("Update failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to update. Please try again.";
      alert(errorMessage);
    } finally {
      setUpdating((prev) => ({ ...prev, [`${id}-${field}`]: false }));
    }
  };

  // Group data by opening date
  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Build nested grouping: Closing Date -> Organization -> TenderId -> items[]
    const grouped: Record<string, Record<string, Record<string, any[]>>> = {};

    data.forEach((item) => {
      const openingDate = item.openingDateTime
        ? new Date(item.openingDateTime).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "No Closing Date";

      const orgName = item?.organization || item?.egpEmail || "Unknown Organization";
      const tenderKey = item?.tenderId ? String(item.tenderId) : "No Tender ID";

      if (!grouped[openingDate]) grouped[openingDate] = {};
      if (!grouped[openingDate][orgName]) grouped[openingDate][orgName] = {};
      if (!grouped[openingDate][orgName][tenderKey]) grouped[openingDate][orgName][tenderKey] = [];

      grouped[openingDate][orgName][tenderKey].push({ ...item, formattedDate: openingDate });
    });

    // Sort closing dates (most recent first), then orgs and tenderIds
    const sortedGrouped: Record<string, Record<string, Record<string, any[]>>> = {};
    Object.keys(grouped)
      .sort((a, b) => {
        if (a === "No Closing Date") return 1;
        if (b === "No Closing Date") return -1;

        const dateA = Object.values(grouped[a])
          .flatMap(Object.values)
          .flat()
          .find((item) => item.openingDateTime)?.openingDateTime;
        const dateB = Object.values(grouped[b])
          .flatMap(Object.values)
          .flat()
          .find((item) => item.openingDateTime)?.openingDateTime;

        if (!dateA) return 1;
        if (!dateB) return -1;

        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .forEach((closingDate) => {
        const orgs = grouped[closingDate];
        const sortedOrgs: Record<string, Record<string, any[]>> = {};

        Object.keys(orgs)
          .sort((a, b) => a.localeCompare(b))
          .forEach((orgName) => {
            const tenders = orgs[orgName];
            const sortedTenders: Record<string, any[]> = {};

            Object.keys(tenders)
              .sort((x, y) => {
                const nx = Number(x);
                const ny = Number(y);
                if (!isNaN(nx) && !isNaN(ny)) return nx - ny;
                return String(x).localeCompare(String(y));
              })
              .forEach((tenderKey) => {
                sortedTenders[tenderKey] = tenders[tenderKey].sort((a, b) => {
                  if (a.tenderId < b.tenderId) return -1;
                  if (a.tenderId > b.tenderId) return 1;
                  return 0;
                });
              });

            sortedOrgs[orgName] = sortedTenders;
          });

        sortedGrouped[closingDate] = sortedOrgs;
      });

    // Convert sortedGrouped object into an array structure:
    // [{ closingDate, organizations: [{ orgName, tenders: [{ tenderId, items }] }] }]
    const result = Object.keys(sortedGrouped).map((closingDate) => ({
      closingDate,
      organizations: Object.keys(sortedGrouped[closingDate]).map((orgName) => ({
        orgName,
        tenders: Object.keys(sortedGrouped[closingDate][orgName]).map((tenderKey) => ({
          tenderId: tenderKey,
          items: sortedGrouped[closingDate][orgName][tenderKey],
        })),
      })),
    }));

    return result;
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
      <div>
        {/* Header Section */}
        <div className="flex max-md:flex-col max-md:gap-4 justify-between mt-5">
          <div className="flex items-center gap-2">
            <AlignJustify />
            <h1 className="text-2xl max-sm:text-xl font-semibold mb-1">Tender Preparation</h1>
          </div>

          {/* Search Input - Mobile Full Width */}
          <div className="max-md:w-full">
            <Input placeholder="Search" className="max-md:w-full" />
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
              <UserEgpMail setFormData={setCurrentOTMGoods} value={currentOTMGoods.egpMail} />
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
              <Button type="button" className="w-full" onClick={handleAddOrder}>
                Create OTM
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section - Desktop */}
        <div className=" overflow-x-auto mt-5">
          {!loading &&
            groupedData?.length > 0 &&
            groupedData?.map((item) => (
              <Fragment key={item.closingDate}>
                {/* Group Header Row */}
                <div className="hidden lg:block mb-12">
                  <div className=" flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <p className="font-semibold text-blue-900 text-2xl">
                      Closing Date: {item.closingDate}
                    </p>
                  </div>
                  <Accordion type="single" collapsible defaultValue="shipping" className="w-full">
                    {item?.organizations?.map((item, idx) => (
                      <AccordionItem
                        className="bg-gray-100 mb-4 px-2 rounded"
                        key={idx}
                        value={item?.orgName}
                      >
                        <AccordionTrigger>
                          {item?.orgName} &nbsp; &nbsp; &nbsp;({item?.tenders?.length}) Tenders
                        </AccordionTrigger>
                        <AccordionContent className="w-full overflow-x-auto">
                          {
                            <table className="w-full max-lg:hidden overflow-x-auto">
                              <tbody>
                                {item?.tenders.map((tender, idx) => (
                                  <Fragment key={tender.tenderId}>
                                    <tr className=" from-primary/10 to-blue-100 border-primary">
                                      <td
                                        colSpan={10}
                                        className="p-2 font-bold text-primary text-lg"
                                      >
                                        Tender ID: {tender.tenderId}{" "}
                                        <span className="inline-block  font-normal">
                                          Description: {tender?.items[0]?.descriptionOfWorks}
                                        </span>
                                      </td>
                                    </tr>

                                    <tr className="bg-[#dbeafe] text-primary-foreground">
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start rounded-tl">
                                        SL
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start">
                                        Date
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start">
                                        Tender Id
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start">
                                        Egp Info
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start">
                                        Tender Type
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start">
                                        Method
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start">
                                        Line of Credit
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start">
                                        Pay Order Status
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start">
                                        Working Status
                                      </th>
                                      <th className="whitespace-nowrap text-blue-900 px-4 py-2 text-start rounded-tr">
                                        Dashboard
                                      </th>
                                    </tr>

                                    {tender?.items?.map((row, key) => (
                                      <tr
                                        key={row._id}
                                        className="border bg-gray-100 hover:bg-gray-200 "
                                      >
                                        <td className="px-4 py-2">{key + 1}</td>
                                        <td className="px-4 py-2">
                                          {row?.documentLastSelling
                                            ? new Date(row.createdAt).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })
                                            : "N/A"}
                                        </td>
                                        <td className="px-4 py-2">{row?.tenderId} </td>
                                        <td className="px-4 py-2">
                                          <div className="flex flex-col">
                                            <span className="font-medium">{row?.egpEmail}</span>
                                            <span className="text-xs text-slate-500">
                                              {row?.egpCompanyName || "N/A"}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-2">{row?.tenderType}</td>
                                        <td className="px-4 py-2">{row?.tenderMethod}</td>
                                        <td className="px-4 py-2">
                                          <Select
                                            value={row?.lineOfCredit || ""}
                                            onValueChange={(value) =>
                                              handleUpdate(row._id, "lineOfCredit", value)
                                            }
                                            disabled={updating[`${row._id}-lineOfCredit`]}
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
                                        <td className="px-4 py-2">
                                          <Select
                                            value={row?.payOrderStatus || ""}
                                            onValueChange={(value) =>
                                              handleUpdate(row._id, "payOrderStatus", value)
                                            }
                                            disabled={updating[`${row._id}-payOrderStatus`]}
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
                                        <td className="px-4 py-2">
                                          <Select
                                            value={row?.status || ""}
                                            onValueChange={(value) =>
                                              handleUpdate(row._id, "status", value)
                                            }
                                            disabled={updating[`${row._id}-status`]}
                                          >
                                            <SelectTrigger className="w-36 h-8">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="under_preparation">
                                                Under Preparation
                                              </SelectItem>
                                              <SelectItem value="wait_for_submit">
                                                Wait for Submit
                                              </SelectItem>
                                              <SelectItem value="submitted">Submitted</SelectItem>
                                              <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </td>
                                        <td className="px-4 py-2">
                                          <Link to={`/dashboard/tenderdashboard/${row?._id}`}>
                                            <LayoutDashboard className="cursor-pointer hover:text-primary" />
                                          </Link>
                                        </td>
                                      </tr>
                                    ))}
                                  </Fragment>
                                ))}
                              </tbody>
                            </table>
                          }
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Tender Rows for this group */}
              </Fragment>
            ))}

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-3 mt-3">
            {!loading &&
              Object.entries(groupedData).map(([closingDate, items]) => (
                <div key={`mobile-group-${closingDate}`}>
                  {/* Group Header */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-900 text-sm">
                        Closing: {items?.closingDate}
                      </span>
                    </div>
                  </div>

                  {/* Tender Cards for this group */}

                  <Accordion type="single" collapsible defaultValue="shipping" className="w-full">
                    {items?.organizations?.map((item, idx) => (
                      <AccordionItem
                        className="bg-gray-100 mb-4 px-2 rounded"
                        key={idx}
                        value={item?.orgName}
                      >
                        <AccordionTrigger>
                          {item?.orgName} &nbsp; &nbsp; &nbsp;({item?.tenders?.length}) Tenders
                        </AccordionTrigger>
                        <AccordionContent className="w-full overflow-x-auto">
                          {item?.tenders?.map((tender, idx) => (
                            <div key={idx}>
                              {" "}
                              <div>
                                <span className="font-semibold text-lg">
                                  ID: {tender?.tenderId}
                                </span>
                              </div>
                              {tender?.items?.map((item, idx) => (
                                <div key={idx} className="bg-white border rounded-lg p-4 shadow-sm">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                                        #{idx + 1}
                                      </span>
                                      <span className="font-semibold text-lg">
                                        ID: {item?.tenderId}
                                      </span>
                                    </div>
                                    <Link to={`/dashboard/tenderdashboard/${item?._id}`}>
                                      <LayoutDashboard
                                        className="cursor-pointer hover:text-primary"
                                        size={24}
                                      />
                                    </Link>
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Date:</span>
                                      <span className="font-medium">
                                        {item?.createdAt
                                          ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })
                                          : "N/A"}
                                      </span>
                                    </div>

                                    <div className="flex justify-between">
                                      <span className="text-gray-600">EGP Email:</span>
                                      <span className="font-medium text-xs break-all">
                                        {item?.egpEmail}
                                      </span>
                                    </div>

                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Company:</span>
                                      <span className="font-medium text-xs">
                                        {item?.egpCompanyName || "N/A"}
                                      </span>
                                    </div>

                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Tender Type:</span>
                                      <span className="font-medium">{item?.tenderType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Method:</span>
                                      <span className="font-medium">
                                        {item?.tenderMethod || "N/A"}
                                      </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Line of Credit:</span>
                                      <Select
                                        value={item?.lineOfCredit || ""}
                                        onValueChange={(value) =>
                                          handleUpdate(item._id, "lineOfCredit", value)
                                        }
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

                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Pay Order:</span>
                                      <Select
                                        value={item?.payOrderStatus || ""}
                                        onValueChange={(value) =>
                                          handleUpdate(item._id, "payOrderStatus", value)
                                        }
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

                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Working Status:</span>
                                      <Select
                                        value={item?.status || ""}
                                        onValueChange={(value) =>
                                          handleUpdate(item._id, "status", value)
                                        }
                                        disabled={updating[`${item._id}-status`]}
                                      >
                                        <SelectTrigger className="w-32 h-8">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="under_preparation">
                                            Under Preparation
                                          </SelectItem>
                                          <SelectItem value="wait_for_submit">
                                            Wait for Submit
                                          </SelectItem>
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
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}

            {/* Loading State */}
            {loading && <div className="text-center py-8 text-gray-500">Loading...</div>}

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
