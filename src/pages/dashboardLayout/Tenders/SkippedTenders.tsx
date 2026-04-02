// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSkippedTenders from "@/hooks/useSkippedTender";
import Pagination from "@/shared/Pagination/Pagination";
import { AlignJustify } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SkippedTenders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const { tenders, loading, tendersCount, setReload } = useSkippedTenders(
    searchTerm,
    currentPage,
    pageLimit
  );

  const skeleton = new Array(pageLimit).fill(Math?.random());

  return (
    <div>
      <div className="grid  justify-between my-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlignJustify />
            <h1 className="text-2xl font-semibold mb-1">
              {tendersCount} Tenders Found That Were Skipped
            </h1>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-5 justify-between">
        <Input
          value={searchTerm}
          placeholder="Search by Tender Id"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[300px]"
        />
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">Action</th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">Tender Id</th>
                <th className="whitespace-nowrap px-4 py-2 text-start">Category</th>
                <th className="whitespace-nowrap px-4 py-2 text-start">Description Of Work</th>

                <th className="whitespace-nowrap px-4 py-2 text-start ">TDS</th>

                <th className="whitespace-nowrap px-4 py-2">Sub Categories</th>
              </tr>
            </thead>

            <tbody>
              {!loading
                ? tenders?.map((item, idx) => (
                    <tr key={idx} className={`border ${idx % 2 == 1 && "bg-gray-100"}`}>
                      <td className="px-4 py-2 align-top">
                        <Link to={`/public/find-tender-subCategory/${item?.tenderId}`}>
                          {" "}
                          <Button className="cursor-pointer">Find Sub Categories</Button>
                        </Link>
                        {/* <TenderExtractor setReload={setReload} data={item} /> */}
                      </td>
                      <td className="px-4 py-2 align-top">{item?.tenderId}</td>

                      <td className="px-4 py-2 align-top min-w-48">{item?.tenderCategory}</td>
                      <td className="px-4 py-2 text-justify min-w-xl align-top">
                        {item?.descriptionOfWorks}
                      </td>

                      <td
                        className={`px-4 py-2 ${
                          (item?.tds ||
                            item?.tds_01 ||
                            item?.tds_03 ||
                            item?.tds_05 ||
                            item?.tds_06 ||
                            item?.tds_07 ||
                            item?.tds_08 ||
                            item?.tds_09 ||
                            item?.tds_14 ||
                            item?.tds_10) &&
                          "min-w-2xl"
                        } align-top text-justify whitespace-break-spaces`}
                      >
                        {item?.tds ||
                        item?.tds_01 ||
                        item?.tds_03 ||
                        item?.tds_05 ||
                        item?.tds_06 ||
                        item?.tds_07 ||
                        item?.tds_08 ||
                        item?.tds_09 ||
                        item?.tds_14 ||
                        item?.tds_10
                          ? [
                              item?.tds,
                              item?.tds_01,
                              item?.tds_03,
                              item?.tds_05,
                              item?.tds_06,
                              item?.tds_07,
                              item?.tds_08,
                              item?.tds_09,
                              item?.tds_14,
                              item?.tds_10,
                            ]
                              .filter(Boolean)
                              .join(", ")
                          : "Not Applicable"}
                      </td>

                      <td className="px-4 py-2 align-top">
                        {item?.tender_subCategories ? item?.tender_subCategories : "Not Available"}
                      </td>
                    </tr>
                  ))
                : skeleton.map((item, idx) => (
                    <tr key={idx}>
                      <td
                        colSpan={6}
                        className={`h-12 ${idx % 2 == 1 ? "bg-gray-300" : "bg-white"}`}
                      ></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      }
      {!loading && tenders?.length > 0 && (
        <Pagination
          data={{
            pageLimit,
            setCurrentPage,
            setPageLimit,
            count: tendersCount,
            currentPage,
          }}
        />
      )}
    </div>
  );
}
