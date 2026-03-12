// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUsersCompanyMigration from "@/hooks/useUsersCompanyMigrations";
import { AuthContext } from "@/provider/AuthProvider";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { AlignJustify, Plus, SquarePen, FilePenLine } from "lucide-react";
import { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const UsersCompanyMigrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { user } = useContext(AuthContext);
  const { companyMigrations, loading, setReload } = useUsersCompanyMigration(
    user?.email,
    searchTerm
  );

  // Filter data by status
  const filteredData = useMemo(() => {
    if (!companyMigrations) return [];
    if (statusFilter === "All") return companyMigrations;
    return companyMigrations.filter(
      (item) => item?.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [companyMigrations, statusFilter]);

  // Predefined status options for filter dropdown
  const statusOptions = ["All", "Active", "Pending", "In Progress", "Rejected", "Completed"];



  return (
    <div>
      <div className="flex max-md:flex-col max-md:gap-2 justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">
            Company Migration List
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Link
            className=" inline-block"
            to={"/dashboard/create-company-registration"}
          >
            <Button className="cursor-pointer mr-2">
              <Plus />
              Migrate Company
            </Button>
          </Link>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
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
                  User
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  E-GP Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Company Name
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Remarks
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Contact
                </th>
                <th className="whitespace-nowrap px-4 py-2  rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading && filteredData?.length ? (
                filteredData?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                  >
                    <td className="px-4 py-2">{item?.user}</td>
                    <td className="px-4 py-2">{item?.egpEmail}</td>
                    <td className="px-4 py-2">{item?.companyName}</td>
                    <td className="px-4 py-2 min-w-32">{item?.status}</td>
                    <td className="px-4 py-2  min-w-48">{item?.remarks}</td>
                    <td className="px-4 py-2">
                      <a
                        href={`https://api.whatsapp.com/send?phone=${config.supportWhatsApp}&text=I am ${encodeURIComponent(
                          item?.user
                        )}. Please Update ${encodeURIComponent(item?.egpEmail)} Information immediately.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                          WhatsApp
                        </Button>
                      </a>
                    </td>
                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                      <Link
                        to={`/dashboard/edit-company-registration/${item?._id}`}
                        title="Edit"
                      >
                        <SquarePen className="mt-2 hover:text-blue-600 transition-colors" size={24} />
                      </Link>
                      <Link
                        to={
                          item?.status?.toLowerCase() === "active"
                            ? `/dashboard/update-company-migration/${item?._id}`
                            : "#"
                        }
                        onClick={(e) => {
                          if (item?.status?.toLowerCase() !== "active") {
                            e.preventDefault();
                          }
                        }}
                      >
                        <button
                          disabled={item?.status?.toLowerCase() !== "active"}
                          className={`mt-2 ${item?.status?.toLowerCase() === "active"
                            ? "cursor-pointer text-blue-600 hover:text-blue-800"
                            : "cursor-not-allowed text-gray-400 opacity-50"
                            }`}
                          title={
                            item?.status?.toLowerCase() === "active"
                              ? "Update"
                              : "Update disabled - Status is not active"
                          }
                        >
                          <FilePenLine size={24} />
                        </button>
                      </Link>
                      <DeleteDataModal
                        setReload={setReload}
                        url={`${config.apiBaseUrl}/companyMigration/${item?._id}`}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="col-span-full">
                    <p className="text-xl py-2 mx-auto text-center">
                      You Have Not Registered Any Company Yet!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <MobileTableLayout data={filteredData} setReload={setReload} />
        </div>
      }
    </div>
  );
};

const MobileTableLayout = ({
  data,
  setReload,
}: {
  data: any;
  setReload: any;
}) => {
  return (
    <div className="flex flex-col gap-6 my-8 lg:hidden px-2">
      {data?.map((item: any, idx: number) => (
        <div
          key={idx}
          className="flex flex-col gap-2 border rounded-xl p-4 py-6 shadow-sm bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Status:</span>
            <span className="text-gray-800 break-words sm:text-right font-bold text-xl">{item?.status}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">E-GP Email:</span>
            <span className="text-gray-800 break-all sm:text-right font-medium">{item?.egpEmail}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Company Name:</span>
            <span className="text-gray-800 break-words sm:text-right font-medium">{item?.companyName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">User:</span>
            <span className="text-gray-800 break-all sm:text-right font-medium">{item?.user}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Remarks:</span>
            <span className="text-gray-800 break-words sm:text-right font-medium">{item?.remarks || "N/A"}</span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-4">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Actions:</span>
            <div className="flex items-center gap-4">
              <a
                href={`https://api.whatsapp.com/send?phone=${config.supportWhatsApp}&text=I am ${encodeURIComponent(
                  item?.user
                )}. Please Update ${encodeURIComponent(item?.egpEmail)} Information immediately.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-500 hover:bg-green-600 text-white text-xs h-8 px-3">
                  WA
                </Button>
              </a>
              <Link 
                to={`/dashboard/edit-company-registration/${item?._id}`}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Edit"
              >
                <SquarePen size={22} className="text-blue-600" />
              </Link>
              <Link
                to={
                  item?.status?.toLowerCase() === "active"
                    ? `/dashboard/update-company-migration/${item?._id}`
                    : "#"
                }
                onClick={(e) => {
                  if (item?.status?.toLowerCase() !== "active") {
                    e.preventDefault();
                  }
                }}
                className={item?.status?.toLowerCase() !== "active" ? "pointer-events-none opacity-50" : ""}
              >
                <FilePenLine size={22} className={item?.status?.toLowerCase() === "active" ? "text-blue-600" : "text-gray-400"} />
              </Link>
              <DeleteDataModal
                setReload={setReload}
                url={`${config.apiBaseUrl}/companyMigration/${item?._id}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersCompanyMigrations;
