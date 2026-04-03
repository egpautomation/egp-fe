// @ts-nocheck

import { TenderMethodComboBox } from "@/components/mainlayout/Tenders/TenderMethodComboBox";
import { Input } from "@/components/ui/input";
import useAllNullCategoryTenders from "@/hooks/useAllNullCategoryTenders";
import Pagination from "@/shared/Pagination/Pagination";
import { AlignJustify } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TenderExtractor from "./TenderExtractor";
import { Button } from "@/components/ui/button";

const NullCategoryTenders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [method, setMethod] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageLimit, setPageLimit] = useState(Number(searchParams.get("limit")) || 20);

  const { tenders, loading, tendersCount, setReload } = useAllNullCategoryTenders(
    searchTerm,
    method,
    currentPage,
    pageLimit
  );
  const skeleton = new Array(pageLimit).fill(Math?.random());
  const removeDuplicatePhrases = (text) => {
    if (!text) return "";

    // Split on punctuation followed by optional space
    const rawParts = text.split(/(?<=[.,;])\s*/);

    const seen = new Set();
    const result = [];

    for (const part of rawParts) {
      const cleaned = part.replace(/\s+/g, " ").trim(); // Normalize whitespace

      if (!seen.has(cleaned)) {
        seen.add(cleaned);
        result.push(part.trim());
      }
    }

    return result.join(" ");
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", pageLimit);
    setSearchParams(params);
  }, [currentPage, pageLimit]);

  return (
    <div>
      <div className="grid  justify-between my-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlignJustify />
            <h1 className="text-2xl font-semibold mb-1">
              {tendersCount} {method && `${method}`} Tenders Found That Need To Update
            </h1>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-5 justify-between">
        <Input
          value={searchTerm}
          placeholder="Search by Tender Id or Type"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[300px]"
        />
        <TenderMethodComboBox setMethod={setMethod} />
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
                      {/* <td className="px-4 py-2 align-top">
                        {item?.selectedTenderCategory
                          ? item?.selectedTenderCategory
                          : "Not Available"}
                      </td> */}
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

                      {/* <td className="px-4 py-2 align-top">
                        {item?.identificationOfLot
                          ? item?.identificationOfLot
                          : "Not Available"}
                      </td> */}
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
      {tenders?.length > 0 && (
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
};

export default NullCategoryTenders;
