// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import useFormattedTenders from "@/hooks/useAllFormattedTenders";
import { createData } from "@/lib/createData";
import { formatDate } from "@/lib/formateDate";
import Pagination from "@/shared/Pagination/Pagination";
import { AlignJustify, SendHorizontal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const TenderDataEntry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const { tenders, loading, setReload, count } = useFormattedTenders(currentPage, pageLimit);
  const sendToDB = (id) => {
    const url = `${config.apiBaseUrl}/tender-dataEntry/create-tenderId`;
    createData(url, { tenderId: id }, setReload);
  };

  const handleSendTender = async (tenderData, id) => {
    const updatedTender = {
      ...tenderData,
      tender_id: Number(`${tenderData?.tender_id}${0}${0}`),
    };

    try {
      const response = await fetch(`${config.exinApiBaseUrl}/add_tender`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(updatedTender),
      });

      const data = await response.json();
      if (data?.status == "success" && data?.code === 200) {
        sendToDB(id);
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

  const handleSendAllTenders = async () => {
    const updatedTenders = tenders?.map((tender) => ({
      ...tender,
      tender_id: Number(`${tender?.tender_id}${0}${0}`),
    }));
    const tenderIds = tenders?.map((tender) => ({ tenderId: tender?.tender_id }));

    try {
      const response = await fetch(`${config.exinApiBaseUrl}/add_tenders`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          tenders: updatedTenders,
        }),
      });

      const res = await response.json();

      if (res?.status == "success" && res?.code === 200) {
        const url = `${config.apiBaseUrl}/tender-dataEntry/create-tenderId`;
        createData(url, tenderIds, setReload);
        // toast.success("Successfully Create Tenders");

        return res;
      } else {
        console.log(res);
        toast.error(res.message || "Failed to Create");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      console.log("");
    }
  };
  const skeleton = new Array(20).fill(Math?.random());
  return (
    <div>
      <div className="flex justify-between my-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">All Tenders</h1>
        </div>
        <div>
          <Button className="cursor-pointer" onClick={() => handleSendAllTenders()}>
            Send All
            <SendHorizontal />
          </Button>
        </div>
      </div>

      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full table-fixed">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">Action</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Tender Id</th>

                <th className="whitespace-nowrap px-4 py-2  text-start">Method</th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">Publish Date</th>

                {/* <th className="whitespace-nowrap px-4 py-2  rounded-tr text-start ">
                  Details
                </th> */}
              </tr>
            </thead>

            <tbody>
              {!loading
                ? tenders?.map((item, idx) => (
                    <tr key={idx} className={`border ${idx % 2 == 1 && "bg-gray-100"}`}>
                      <td className="px-4 py-2 align-top">
                        <Button
                          className="cursor-pointer"
                          onClick={() => handleSendTender(item, item?.tender_id)}
                        >
                          Send <SendHorizontal />
                        </Button>
                      </td>
                      <td className="px-4 py-2 align-top">{item?.tender_id}</td>

                      <td className="px-4 py-2 align-top">{item?.procurement_method}</td>
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
                        className={`h-20 ${idx % 2 == 1 ? "bg-gray-300" : "bg-white"}`}
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
            count,
            currentPage,
          }}
        />
      )}
    </div>
  );
};

export default TenderDataEntry;
