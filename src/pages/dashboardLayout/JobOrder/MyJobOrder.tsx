// @ts-nocheck

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
import useAllJobOrders from "@/hooks/useAllJobOrders";
import useMyJobOrders from "@/hooks/useMyJobOrders";
import { updateData } from "@/lib/updateData";
import { AuthContext } from "@/provider/AuthProvider";
import { AlignJustify, Plus, XCircle, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyJobOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, setReload, pagination } = useMyJobOrders(searchTerm, user?.email, currentPage, 20, statusFilter);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleCancelRequest = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const confirmCancel = () => {
    if (selectedItem) {
      const url =
        "https://egp-tender-automation-server.vercel.app/api/v1/jobOrder/update-status";
      const updatedData = {
        orderId: selectedItem?.orderId,
        jobId: selectedItem?.jobId,
        status: "canceled",
      };
      updateData(url, updatedData, setReload);
      setIsDialogOpen(false);
      setSelectedItem(null);
    }
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
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  Action
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
                    <td className={`px-4 py-2 `}>
                      <span
                        className={`border-none shadow-none rounded inline-block py-0.5 px-1.5 bg-orange-300 w-full font-semibold text-orange-900 ${item?.status === "fulfilled" &&
                          "bg-green-300 text-green-900"
                          } ${item?.status === "canceled" &&
                          "bg-red-400 text-red-900"
                          }`}
                      >
                        {" "}
                        {item?.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {item?.status !== "canceled" && item?.status !== "fulfilled" ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelRequest(item)}
                          className="flex items-center gap-1"
                        >
                          <XCircle size={16} />
                          Cancel Req
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="flex items-center gap-1 opacity-50"
                        >
                          <XCircle size={16} />
                          {item?.status === "canceled" ? "Canceled" : "Fulfilled"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-3">
                    No Order Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <MobileTableLayout data={data} handleCancelRequest={handleCancelRequest} />
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


      {/* Custom Cancel Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Cancel Job Order</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p className="text-base">Are you sure you want to cancel this job order?</p>
              {selectedItem && (
                <div className="bg-gray-50 border rounded-lg p-4 space-y-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Tender ID:</span>
                    <span className="text-gray-900 font-medium">{selectedItem?.tenderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">EGP Email:</span>
                    <span className="text-gray-900 font-medium">{selectedItem?.egpMail}</span>
                  </div>
                </div>
              )}
              <p className="text-sm text-red-600 mt-3">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              No, Keep It
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const MobileTableLayout = ({ data, handleCancelRequest }: { data: any, handleCancelRequest: any }) => {
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
              <h1 className="text-gray-700 ">
                <span
                  className={`border-none shadow-none rounded inline-block py-0.5 px-1.5 bg-orange-300 w-full font-semibold text-orange-900 ${item?.status === "fulfilled" &&
                    "bg-green-300 text-green-900"
                    } ${item?.status === "canceled" && "bg-red-400 text-red-900"
                    }`}
                >
                  {" "}
                  {item?.status}
                </span>
              </h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-2 mt-4"
              initial={{ opacity: 0, y: 10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + idx * 0.05, duration: 0.3 }}
            >
              {item?.status !== "canceled" && item?.status !== "fulfilled" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelRequest(item)}
                  className="flex items-center gap-1 w-full"
                >
                  <XCircle size={16} />
                  Cancel Request
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center gap-1 opacity-50 w-full"
                >
                  <XCircle size={16} />
                  {item?.status === "canceled" ? "Canceled" : "Fulfilled"}
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MyJobOrder;
