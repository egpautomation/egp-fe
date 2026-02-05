// @ts-nocheck

import useAllBOQ from "@/hooks/useAllBOQ"
import { useState } from "react";

export default function ALLBOQ() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(20);
    const {data, setReload, loading} = useAllBOQ(searchTerm, currentPage, pageLimit)
  return (
      <table className="mt-5 w-full max-lg:hidden">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    {[
                      "S. No. ",
                      "Tender ID",
                      "Division",
                      "Item no.",
                      "Group",
                      "Item Code",
                      "Description of Item",
                      "Measurement",
                      "Unit",
                      "Quantity",
                      "Unit Price",
                      "Required Document",
                      "File Name",
                    ].map((item, index) => (
                      <th
                        key={index}
                        className="whitespace-nowrap px-2 py-2 text-start relative group"
                      >
                        <span>
                          {item.split("").length > 12
                            ? item.slice(0, 12) + "..."
                            : item}
                        </span>
                        {/* Hover Popup */}
                        <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-fit text-center">
                          {item}
                          {/* Arrow pointing down */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 z-20 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data?.map((item, idx) => <tr  className={`border ${idx % 2 == 1 && "bg-gray-100"}`} key={idx}>
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{item?.tenderId}</td>
                    <td className="px-4 py-2">{item?.division_no}</td>
                    <td className="px-4 py-2">{item?.itemNo}</td>
                    <td className="px-4 py-2">{item?.group}</td>
                    <td className="px-4 py-2">{item?.itemCode}</td>
                    <td className="px-4 py-2 min-w-sm">{item?.descriptionOfItem}</td>
                    <td className="px-4 py-2">{item?.measurement}</td>
                    <td className="px-4 py-2">{item?.unit}</td>
                    <td className="px-4 py-2">{item?.quantity}</td>
                    <td className="px-4 py-2">{item?.unitPrice}</td>
                    <td className="px-4 py-2">{item?.requiredDocument}</td>
                    <td className="px-4 py-2">{item?.fileName}</td>
                    
                  </tr>)}
                </tbody>
            </table>
  )
}





