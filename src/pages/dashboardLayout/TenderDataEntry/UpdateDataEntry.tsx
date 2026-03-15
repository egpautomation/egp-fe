// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFormattedTenders from "@/hooks/useAllFormattedTenders";
import useAllTenders from "@/hooks/useAllTenders";
import { createData } from "@/lib/createData";
import { formatDate } from "@/lib/formateDate";
import Pagination from "@/shared/Pagination/Pagination";
import axiosInstance from "@/lib/axiosInstance";
import { AlignJustify, SendHorizontal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const UpdateTenderDataEntry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { tenders, loading, setReload, tendersCount } = useAllTenders(
    searchTerm,
    "",
    "",
    "",
    "",
    "",
    "",
    currentPage,
    pageLimit
  );
  const formattedTenders = tenders?.map((t) => ({
    tender_id: t.tenderId,
    procurement_type: t.procurementType,
    procurement_nature: t.procurementNature,
    procurement_method: t.procurementMethod,
    tender_status: t.tenderStatus,
    designation_of_official: `${
      t?.NameofOfficialInviting ? t?.NameofOfficialInviting + "," : ""
    }${t?.officialDesignation ? t?.officialDesignation + "," : ""} ${
      t?.Address ? t?.Address : ""
    } ${t?.Thana ? t?.Thana + "," : ""} ${t?.City ? t?.City : ""}`,
    ministry: t.ministry,
    organization: t.organization,
    division: t.division,
    procuring_entity_name: t.procuringEntityName,
    district: t.locationDistrict,
    project_name: t.projectName,
    source_of_funds: t.sourceOfFunds,
    package_no: t.packageNo,
    tender_category: t.tenderCategory,
    description_of_works: t.descriptionOfWorks,
    publication_date: t.publicationDateTime,
    last_selling_date: t.documentLastSelling,
    opening_date: t.openingDateTime,
    document_price: t.documentPrice,
    tender_security: t.tenderSecurity,
    estimated_cost: t.estimatedCost,
    types_of_similar_nature: t.typesOfSimilarNature,
    general_experience: t.generalExperience,
    jvca: t.jvca,
    similar_nature: t.similarNatureWork,
    turnover_amount: t.turnoverAmount,
    liquid_assets: t.liquidAssets,
    tender_capacity: t.tenderCapacity,
    working_location: t.workingLocation,
  }));

  const handleSendTender = async (tenderData) => {
    try {
      const response = await fetch(
        `${config.exinApiBaseUrl}/tender_update`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(tenderData),
        }
      );

      const data = await response.json();

      if (data?.status == "success" && data?.code === 200) {
        toast.success("Successfully Updated");
        return data;
      } else {
        console.log(data);
        toast.error(data.message || "Failed to Create");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      console.log("");
    }
  };

  const handleDeleteTender = async (tenderData) => {
    const toastId = toast.loading("Deleting...");
    const tenderId = { tender_id: Number(`${tenderData?.tender_id}${0}${0}`) };
    try {
      const response = await fetch(
        `${config.exinApiBaseUrl}/delete_tender`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(tenderId),
        }
      );

      const data = await response.json();
 
      if ((data?.status == "success") && (data?.code === 200)) {
        const url = `${config.apiBaseUrl}/tender-dataEntry/${tenderData?.tender_id}`;
        const response = await axiosInstance.delete(url, { withCredentials: false });
        if (response.status === 200) {
          toast.dismiss(toastId);
          toast.success("Successfully Deleted");
        }else{
          toast.dismiss(toastId);
        }
        
      } else {
        toast.dismiss(toastId);
        toast.error(data.status || "Failed to delete");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const skeleton = new Array(20).fill(Math?.random());
  return (
    <div>
      <div className="flex justify-between my-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">
            {tendersCount} All Tenders
          </h1>
        </div>
        <div>
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </div>
      </div>

      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full table-fixed">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  Action
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Tender Id
                </th>

                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Method
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  Publish Date
                </th>

                {/* <th className="whitespace-nowrap px-4 py-2  rounded-tr text-start ">
                  Details
                </th> */}
              </tr>
            </thead>

            <tbody>
              {!loading
                ? formattedTenders?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                    >
                      <td className="px-4 py-2 align-top">
                        <Button
                          className="cursor-pointer"
                          onClick={() =>
                            handleSendTender(item, item?.tender_id)
                          }
                        >
                          Update <SendHorizontal />
                        </Button>
                        <Button
                          className="cursor-pointer ml-2"
                          onClick={() => handleDeleteTender(item)}
                        >
                          Delete <SendHorizontal />
                        </Button>
                      </td>
                      <td className="px-4 py-2 align-top">{item?.tender_id}</td>

                      <td className="px-4 py-2 align-top">
                        {item?.procurement_method}
                      </td>
                      <td className="px-4 py-2 align-top">
                        {formatDate(item?.publication_date, "MM-dd-yyyy")}
                      </td>

                      {/* <td className="px-4 py-2 flex items-center align-top ">
                        {item?.designation_of_official}
                      </td> */}
                    </tr>
                  ))
                : skeleton.map((item, idx) => (
                    <tr key={idx}>
                      <td
                        colSpan={4}
                        className={`h-20 ${
                          idx % 2 == 1 ? "bg-gray-300" : "bg-white"
                        }`}
                      ></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      }
      {tenders.length > 0 && (
        <Pagination
          data={{
            pageLimit,
            setCurrentPage,
            setPageLimit,
            tendersCount,
            currentPage,
          }}
        />
      )}
    </div>
  );
};

export default UpdateTenderDataEntry;
