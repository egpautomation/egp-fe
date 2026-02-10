import useAllTenderIds from "@/hooks/useAllTenderIds";
import Pagination from "@/shared/Pagination/Pagination";
import { AlignJustify } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatDate } from "@/lib/formateDate";
export default function LiveTendersFromTenderIds() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(
      Number(searchParams.get("page")) || 1
    );
    const [pageLimit, setPageLimit] = useState(
      Number(searchParams.get("limit")) || 20
    );
  const { tenders:data, loading, error, tendersCount } = useAllTenderIds("", "", currentPage, pageLimit);
  const skeleton = new Array(pageLimit).fill(Math?.random());
  return (
    <div>
      
      {
              <div className="overflow-x-auto">
                <div className="flex items-center gap-2 mt-8 lg:hidden">
                  <AlignJustify />
                  <h1 className="text-2xl font-semibold">
                    {tendersCount} Live Tenders
                  </h1>
                </div>
                <table className="mt-5 w-full max-lg:hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                       S. <br /> NO
                      </th>
      
                      <th className="whitespace-nowrap px-4 py-2 text-start">
                         Tender Id
                      </th>
      
                      <th className="whitespace-nowrap px-4 py-1 text-start">
                        Procurement Nature <br /> Title
                      </th>
                      <th className="whitespace-nowrap px-4 py-2">Ministry, Division, Organization, PE</th>
      
                      <th className="whitespace-nowrap  px-4 py-2 text-center">
                        Type <br />
                        Method
                      </th>
      
                      <th className="whitespace-nowrap px-4 py-2 text-start">
                        Publishing Date And Time <br />
                        Closing Date And Time
                      </th>
                      
                    </tr>
                  </thead>
      
                  <tbody>
                    {!loading
                      ? data?.map((item, idx) => (
                        <tr
                          key={idx}
                          className={` ${idx % 2 == 1 && "bg-gray-100"}`}
                        >
                          <td
                            style={{ textAlign: "start", verticalAlign: "top" }}
                            className="px-4 py-2 text-sm"
                          >
                            {idx + 1}
                          </td>
      
                          <td
                            style={{ textAlign: "start", verticalAlign: "top" }}
                            className="px-4 py-2 text-sm"
                          >
                          {item?.tenderId}
                          </td>
      
                          <td
                            style={{
                              textAlign: "start",
                              verticalAlign: "top",
                            }}
                            className="px-4 py-2 text-[12px] text-justify min-w-50 max-w-75"
                          >
                            
                          </td>
                          <td
                            style={{ textAlign: "start", verticalAlign: "top" }}
                            className="px-4 py-2 text-sm"
                          >
                            {item?.organization}
                            <br />
                            {item?.ProcurementType}
                          </td>
      
                          <td
                            style={{ textAlign: "start", verticalAlign: "top" }}
                            className="text-center px-4 py-2 text-sm text-nowrap"
                          >
                            
                            <p className="text-center">
                              {item?.ProcurementType}
                            <br />
                            {item?.procurementMethod}
                            </p>

                          </td>
      
                          <td
                            style={{ textAlign: "start", verticalAlign: "top" }}
                            className="px-4 py-2 text-sm text-nowrap"
                          >
                            <p className="text-center">
                              {" "}
                              <span className="font-medium text-gray-600">
                               
                              </span>
                              {formatDate(item?.publicationDateTime, "MM-dd-yyyy")}
                            </p>
                            <p className="text-center">
                              {" "}
                              <span className="font-medium text-gray-600">
                             
                              </span>
                              {formatDate(item?.openingDateTime, "MM-dd-yyyy")}
                            </p>
                          </td>
                          
                        </tr>
                      ))
                      : skeleton.map((item, idx) => (
                        <tr key={idx}>
                          <td
                            colSpan={6}
                            className={`h-20 ${idx % 2 == 1 ? "bg-gray-300" : "bg-white"
                              }`}
                          ></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              
              </div>
            }
            <Pagination
              data={{
                pageLimit,
                setCurrentPage,
                setPageLimit,
                count: tendersCount,
                currentPage,
              }}
            />
    </div>
  )
}
