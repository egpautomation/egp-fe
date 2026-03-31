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
import { CirclePlus, Download, Edit, File, Paperclip } from "lucide-react";
import EditSORForm from "./EditSORForm";
import ViewSORModal from "./ViewSORForm";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import DownloadSOR from "./DownloadSOR";

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
  
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 mb-5 gap-5">
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
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
         <Dialog>
          <DialogTrigger asChild>
            <Button><CirclePlus /> Add SOR</Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create SOR</DialogTitle>
            </DialogHeader>
            <CreateSORForm setReload={setReload} />
          </DialogContent>
        </Dialog>
            <DownloadSOR sors={sors} />
       </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm ">
        <table className="w-full overflow-x-auto">
          <thead>
            <tr className="bg-primary text-primary-foreground">
                  <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">Item Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold ">Department <br /> Year Of Rate</th>
              
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Category, Sub-category, <br /> Sub-sub category
              </th>
          
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
           
            
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
                    <td className="px-4 py-3 text-sm align-top">
                      Department: {item?.departmentShortName || "NOT AVAILABLE"}
                      <br />
                      Year of Rate: {item?.yearOfRate || "NOT AVAILABLE"}
                    </td>
 {/* Year */}
                    
                    {/* Category */}
                    <td className="px-4 py-3 text-sm align-top">
                      {item?.category && <p>Category : {item?.category}</p>}
                      {item?.subCategory && <p>Sub-category : {item?.subCategory}</p>}
                      {item?.subSubCategory && <p>Sub-sub category : {item?.subSubCategory}</p>}
                      {!item?.category && !item?.subCategory && !item?.subSubCategory && (
                        <p>NOT AVAILABLE</p>
                      )}
                    </td>

                   

                    {/* Description */}
                    <td className="px-4 py-3 text-xs text-justify min-w-50 align-top">
                      {item?.description || "NOT AVAILABLE"}
                    </td>

                    

                    

                    {/* Actions */}
                    <td className="px-4 py-3 align-top grid grid-cols-3 gap-2">
<ViewSORModal data={item}/>
                      <EditSORForm data={item} setReload={setReload} />
                      <DeleteDataModal url={`/sor/delete-sor/${item?._id}`} setReload={setReload}/>
                      {item?.attachment ? (
                        <a
                          href={item.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center justify-center gap-1 rounded border border-blue-300 bg-[#4874c7] text-nowrap px-1.5 mt-2 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 col-span-3"
                        >
                        <Paperclip size={14} /> View File
                        </a>
                      ) : (
                        <span
                          
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center justify-center gap-1 rounded border border-gray-300 bg-gray-100 text-gray-500 text-nowrap px-1.5 mt-2 py-1.5 text-xs font-semibold col-span-3"
                        >
                        <Paperclip size={14} /> No File
                        </span>
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
