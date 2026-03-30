// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAllCompanyMigration from "@/hooks/useAllCompanyMigration";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { AlignJustify, Eye, Plus, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CompnayMigrationRow from "./CompnayMigrationRow";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompanyMigrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { companyMigrations, loading, setReload } = useAllCompanyMigration(searchTerm);
  const [statusFilter, setStatusFilter] = useState("");

  const filteredMigrations = companyMigrations?.filter((item) => {
    if (!statusFilter || statusFilter === "all") return true; // show all

    if (statusFilter === "not-registered") {
      return (
        !item.status ||
        item.status.trim() === "" ||
        ["undefined", "not registered", "null"].includes(item.status.toLowerCase())
      );
    }

    return item.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div>
      <div className="flex max-md:flex-col max-md:gap-2 justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">Company Migration List</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Link className=" inline-block" to={"/dashboard/create-company-registration"}>
            <Button className="cursor-pointer mr-2">
              <Plus />
              Migrate Company
            </Button>
          </Link>
          <Input
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">InActive</SelectItem>
                <SelectItem value="not-registered">Not Registered</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full max-lg:hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">User</th>
                <th className="whitespace-nowrap px-4 py-2 text-start">E-GP Email</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Company Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Updated date</th>
                <th className="whitespace-nowrap px-4 py-2  text-start">Status</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Remarks</th>

                <th className="whitespace-nowrap px-4 py-2  rounded-tr">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                filteredMigrations?.map((item, idx) => (
                  <CompnayMigrationRow key={idx} idx={idx} item={item} setReload={setReload} />
                ))}
            </tbody>
          </table>
          <MobileTableLayout data={companyMigrations} setReload={setReload} />
        </div>
      }
    </div>
  );
};

const MobileTableLayout = ({ data, setReload }: { data: any; setReload: any }) => {
  return (
    <div className="flex flex-col gap-6 my-8 lg:hidden px-2">
      {data?.map((item: any, idx: number) => (
        <div
          key={idx}
          className="flex flex-col gap-2 border rounded-xl p-4 py-6 shadow-sm bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              User:
            </span>
            <span className="text-gray-800 break-all sm:text-right font-medium">{item?.user}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              E-GP Email:
            </span>
            <span className="text-gray-800 break-all sm:text-right font-medium">
              {item?.egpEmail}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              Company Name:
            </span>
            <span className="text-gray-800 break-words sm:text-right font-medium">
              {item?.companyName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              Status:
            </span>
            <span className="text-gray-800 break-words sm:text-right font-medium">
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs ${item?.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
              >
                {item?.status || "Not Registered"}
              </span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              Remarks:
            </span>
            <span className="text-gray-800 break-words sm:text-right font-medium">
              {item?.remarks || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-4">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              Actions:
            </span>
            <div className="flex items-center gap-4">
              <Link
                to={`/dashboard/edit-company-registration/${item?._id}`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Edit"
              >
                <SquarePen size={22} className="text-blue-600" />
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

export default CompanyMigrations;
