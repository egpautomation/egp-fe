// @ts-nocheck
import { Button } from "@/components/ui/button";
import useSingleData from "@/hooks/useSingleData";
import { formatDate } from "@/lib/formateDate";

import { useParams, useSearchParams } from "react-router-dom";
import { config } from "@/lib/config";
import useAllEgpListedCompanies from "@/hooks/useAllEgpListedCompany";
import { handleDownloadManufacturerAuthorization } from "@/utils/handleManufacturerAuthorization";



const ManufacturerAuthorizationForGoods = () => {
 const { id } = useParams(); 
  const [searchParams] = useSearchParams();
  const egpEmail = searchParams.get('egpEmail');
  const tenderId = Number(id)

  const { data: currentTender } = useSingleData(`${config.apiBaseUrl}/tenders/tenderId/${tenderId}` );

  const { egpListedCompanies,  } = useAllEgpListedCompanies(egpEmail || "Skip"); 
  const companyData = egpListedCompanies?.[0];

  return (
    <div className="container max-w-4xl mx-auto  my-10  bg-white">
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={()=>handleDownloadManufacturerAuthorization(companyData, currentTender)}>Download PDF</Button>
      </div>

      {/* Preview Area (remains same for UI) */}
      <div className="border p-10 mt-5" id="print-area">
        {/* Company Section */}
        <div className="mb-6 text-center border-b-2 border-purple-900">
          <h1 className="font-bold text-4xl text-blue-900">{companyData?.companyName || "N/A"}</h1>
          <p className="text-purple-900 font-bold">
          Proprietor Name: {companyData?.proprietorName}, <br />   Address: {companyData?.companyAddress}, <br /> E-mail: {companyData?.egpEmail} 
          </p>
          <br />
        </div>

        {/* Date Section */}
        <div className="flex justify-between mb-10">
          <p>Ref:</p>
          <p>Date: {formatDate(new Date(), "dd-MM-yyyy")}</p>
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-lg mb-6 underline">Manufacturer&nbsp;s Authorisation Letter (Form e-PG2-5)</h2>

        {/* Tender Info */}
        <div className="mb-4 ">
          <p className="text-black grid grid-cols-3">
            <strong>Invitation for Tender No:</strong>
            <span className="col-span-1">{currentTender?.tenderId}</span>
            <span className="col-span-1">Date:</span>
          </p>
        </div>

        <div className="mb-4">
          <p className="text-black grid grid-cols-3">
            <strong>Tender Package No:</strong>
            <span className="col-span-2">{currentTender?.packageNo || "N/A"}</span>
          </p>
        </div>

        {/* Lot Description */}
        <div className="mb-6">
          <p className="font-semibold text-black grid grid-cols-3">
            <strong>Tender Lot No (when applicable):</strong>{" "}
            
          </p>
        </div>

        {/* To Section */}
        <div className="mb-6">
          <p className="text-black">
            To: {currentTender?.officialDesignation || "N/A"}, <br />{" "}
            {currentTender?.procuringEntityName
              ? currentTender?.procuringEntityName
              : currentTender?.division || "N/A"}
            , <br />
            {currentTender?.locationDistrict ? currentTender?.locationDistrict : "N/A"}{" "}
          </p>
        </div>

        {/* Body */}
        <div>
          <div className="mb-4 mt-4 text-justify ">
            <p className="text-justify text-black">
              WHEREAS
            </p>
            <br />
            <p className=" text-black">
             We [insert complete name of Manufacturer], 
            </p>
          </div>

          <div className="mb-4  text-justify">
            <p className="text-justify text-black">
              who are official manufacturers of [insert type of goods manufactured], having factories at [insert full address of Manufacturer’s factories], do hereby 
            </p>
          </div>

          <div className="mt-8  text-justify">
            <p className="text-justify text-black">
              authorize [insert complete name of Tenderer] to supply the following Goods, manufactured by us [insert name and or brief description of the Goods].
            </p>
          </div>
          <div className="mt-8  text-justify">
            <p className="text-justify text-black">
             We hereby extend our full guarantee and warranty as stated under GCC Clause 32 of the General Conditions of Contract, with respect to the Goods offered by the above Tenderer.
            </p>
          </div>
          <div className="mt-8  text-justify">
            <p className=" text-black">
            Signed: [insert signature(s) of authorized representative(s) of the Manufacturer] 
            </p>
            <p className=" text-black">
           Name: [insert complete name(s) of authorized representative(s) of the Manufacturer]	
            </p>
            <p className=" text-black">
           Address: [insert full address including Fax and e-mail]	
            </p>
            <p className=" text-black">
           Address: [insert full address including Fax and e-mail]	
            </p>
            <p className=" text-black">
           Title: [insert title] 
            </p>
            <p className=" text-black">
           Date: [insert date of signing] 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerAuthorizationForGoods;
