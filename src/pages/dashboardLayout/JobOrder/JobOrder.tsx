// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAllJobOrders from "@/hooks/useAllJobOrders";
import { updateData } from "@/lib/updateData";
import { AlignJustify, Plus, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const JobOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, setReload, pagination } = useAllJobOrders(searchTerm, currentPage, 20, statusFilter);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleStatusChange = (value, data) => {
    const url = `${config.apiBaseUrlAlt}/jobOrder/update-status`;
    const updatedData = {
      orderId: data?.orderId,
      jobId: data?.jobId,
      status: value,
    };
    updateData(url, updatedData, setReload);
  };

  return (
    <div className="pb-8">
      <div className="flex max-md:flex-col max-md:gap-2 justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">Job Orders List</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Link className=" inline-block" to={"/dashboard/create-job-order"}>
            <Button className="cursor-pointer mr-2">
              <Plus />
              Order A Job
            </Button>
          </Link>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full max-lg:hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  Tender Id
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Ordered
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Egp Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Bank Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Liquid Asset
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading && data?.length > 0 ? (
                data?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                  >
                    <td className="px-4 py-2">{item?.tenderId}</td>

                    <td className="px-4 py-2">{item?.userMail}</td>
                    <td className="px-4 py-2">{item?.egpMail}</td>
                    <td className="px-4 py-2">{item?.bankName}</td>
                    <td className="px-4 py-2">
                      {item?.liquidAssetsTenderAmount}
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        onValueChange={(value) =>
                          handleStatusChange(value, item)
                        }
                      >
                        <SelectTrigger
                          className={`border-none shadow-none bg-orange-300 w-full data-[placeholder]:font-semibold data-[placeholder]:text-orange-900 ${item?.status === "fulfilled" &&
                            "bg-green-300 data-[placeholder]:text-green-900"
                            } ${item?.status === "canceled" &&
                            "bg-red-400 data-[placeholder]:text-red-900"
                            }`}
                        >
                          <SelectValue
                            className="text-orange-900"
                            placeholder={item?.status || "Loading..."}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="!text-orange-900">
                              {item?.status || "Loading..."}
                            </SelectLabel>
                            <SelectItem value="working">Working</SelectItem>
                            <SelectItem value="fulfilled">Fulfill</SelectItem>
                            <SelectItem value="canceled">Cancel</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-3">
                    No Order Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <MobileTableLayout data={data} handleStatusChange={handleStatusChange} />
        </div>
      }

      {/* Pagination Controls */}
      {!loading && data?.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 border-t pt-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{((currentPage - 1) * 20) + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(currentPage * 20, pagination?.totalCount || 0)}
            </span>{" "}
            of <span className="font-semibold">{pagination?.totalCount || 0}</span> results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="cursor-pointer flex items-center gap-1"
            >
              <ChevronsLeft size={16} />
              First
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!pagination?.hasPreviousPage}
              className="cursor-pointer"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pagination?.totalPages || 1, 5) }, (_, i) => {
                let pageNum;
                if (pagination?.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= (pagination?.totalPages - 2)) {
                  pageNum = pagination?.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="cursor-pointer w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination?.hasNextPage}
              className="cursor-pointer"
            >
              Next
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination?.totalPages || 1)}
              disabled={currentPage === pagination?.totalPages}
              className="cursor-pointer flex items-center gap-1"
            >
              Last
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const MobileTableLayout = ({
  data,
  handleStatusChange,
}: {
  data: any;
  handleStatusChange: any;
}) => {
  // console.log(data);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const buttonVariants = {
    rest: {
      scale: 1,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-6 my-8 lg:hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data?.map((item: any, idx: number) => (
        <motion.div
          key={idx}
          className="flex flex-col gap-2 border rounded-xl p-4 md:p-8 py-6"
          variants={cardVariants}
          whileHover={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 },
          }}
        >
          <div className="">
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Tender Id: </h1>
              <h1 className="text-gray-700 text-2xl">{item?.tenderId}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Ordered: </h1>
              <h1 className="text-gray-700 ">{item?.userMail}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Egp Email: </h1>
              <h1 className="text-gray-700 ">{item?.egpMail}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Bank Name: </h1>
              <h1 className="text-gray-700 ">{item?.bankName}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Liquid Asset: </h1>
              <h1 className="text-gray-700 ">
                {item?.liquidAssetsTenderAmount}
              </h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Status: </h1>
              <Select
                onValueChange={(value) => handleStatusChange(value, item)}
              >
                <SelectTrigger
                  className={`border-none shadow-none bg-orange-300 w-full data-[placeholder]:font-semibold data-[placeholder]:text-orange-900 ${item?.status === "fulfilled" &&
                    "bg-green-300 data-[placeholder]:text-green-900"
                    } ${item?.status === "canceled" &&
                    "bg-red-400 data-[placeholder]:text-red-900"
                    }`}
                >
                  <SelectValue
                    className="text-orange-900"
                    placeholder={item?.status || "Loading..."}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="!text-orange-900">
                      {item?.status || "Loading..."}
                    </SelectLabel>
                    <SelectItem value="working">Working</SelectItem>
                    <SelectItem value="fulfilled">Fulfill</SelectItem>
                    <SelectItem value="canceled">Cancel</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default JobOrder;
