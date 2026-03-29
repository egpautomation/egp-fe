// @ts-nocheck
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateSORForm from "./CreateSORForm";
import { useState } from "react";
import useAllSOR from "@/hooks/useAllSor";
import { Input } from "@/components/ui/input";
import useAllDepartments from "@/hooks/useAllDepartments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Pagination from "@/shared/Pagination/Pagination";

export default function SOR() {
  const [searchTerm, setSearchTerm] = useState({
    description: "",
    departmentShortName: "",
    itemCode: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const { sors, count, loading,setReload } = useAllSOR(searchTerm, 1, 10);
  const {departments} = useAllDepartments();
  const skeleton = new Array(pageLimit).fill(Math?.random());
  return (
    <div className="p-6 container mx-auto">
      <div className="grid grid-cols-4 mb-5 gap-5">
        <Input
          placeholder="Search by Description..."
          value={searchTerm.description}
          onChange={(e) => setSearchTerm({ ...searchTerm, description: e.target.value })}
        />
        
        <Select onValueChange={(v) => setSearchTerm({ ...searchTerm, departmentShortName: v == "all" ? "" : v })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All</SelectItem>
              {departments?.map((dept) => (
                <SelectItem key={dept.shortName} value={dept.shortName}>
                  {dept.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        <Input
          placeholder="Search by Item Code..."
          value={searchTerm.itemCode}
          onChange={(e) => setSearchTerm({ ...searchTerm, itemCode: e.target.value })}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add SOR</Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create SOR</DialogTitle>
            </DialogHeader>
            <CreateSORForm setReload={setReload} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">Item Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Category, Sub-category, <br /> Sub-sub category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Year Of Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Details</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Rates</th>
              <th className="px-4 py-3 text-center text-sm font-semibold rounded-tr-lg">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading
              ? sors?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 1 ? "bg-slate-50" : "bg-white"
                    } hover:bg-slate-100 transition-colors`}
                  >
                    {/* Item Code */}
                    <td className="px-4 py-3 text-sm align-top">
                      {item?.itemCode || "NOT AVAILABLE"}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-sm align-top">
                      {item?.category && <p>Category : {item?.category}</p>}
                      {item?.subCategory && <p>Sub-category : {item?.subCategory}</p>}
                      {item?.subSubCategory && <p>Sub-sub category : {item?.subSubCategory}</p>}
                      {!item?.category && !item?.subCategory && !item?.subSubCategory && (
                        <p>NOT AVAILABLE</p>
                      )}
                    </td>

                    {/* Year */}
                    <td className="px-4 py-3 text-sm align-top">
                      {item?.yearOfRate || "NOT AVAILABLE"}
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 text-xs text-justify min-w-50 align-top">
                      {item?.description || "NOT AVAILABLE"}
                    </td>

                    {/* Details */}
                    <td className="px-4 py-3 text-sm align-top whitespace-nowrap">
                      <p>
                        <span className="font-medium text-slate-600">Department:</span>{" "}
                        {item?.departmentShortName || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-600">Unit:</span>{" "}
                        {item?.unit || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-600">Source:</span>{" "}
                        {item?.sourceOfRate || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-600">Reference:</span>{" "}
                        {item?.reference || "N/A"}
                      </p>
                    </td>

                    {/* Rates */}
                    <td className="px-4 py-3 text-sm align-top whitespace-nowrap">
                      {item?.rate_1 && <p>Rate 1: {item?.rate_1 ?? "N/A"}</p>}
                      {item?.rate_2 && <p>Rate 2: {item?.rate_2 ?? "N/A"}</p>}
                      {item?.rate_3 && <p>Rate 3: {item?.rate_3 ?? "N/A"}</p>}
                      {item?.rate_4 && <p>Rate 4: {item?.rate_4 ?? "N/A"}</p>}
                      {item?.rate_5 && <p>Rate 5: {item?.rate_5 ?? "N/A"}</p>}
                      {item?.rate_6 && <p>Rate 6: {item?.rate_6 ?? "N/A"}</p>}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center align-top">
                      {item?.attachment ? (
                        <a
                          href={item.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center justify-center gap-2 rounded-full border border-blue-300 bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
                        >
                          View File
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">No File</span>
                      )}
                    </td>
                  </tr>
                ))
              : skeleton.map((_, idx) => (
                  <tr key={idx}>
                    <td
                      colSpan={7}
                      className={`h-20 ${idx % 2 === 1 ? "bg-slate-200" : "bg-white"}`}
                    />
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <Pagination data={{ setCurrentPage, count, currentPage, pageLimit }} />
    </div>
  );
}
