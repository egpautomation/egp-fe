// @ts-nocheck
import { Button } from "@/components/ui/button";
import useSingleData from "@/hooks/useSingleData";
import { formatDate } from "@/lib/formateDate";

import { useParams, useSearchParams } from "react-router-dom";
import { config } from "@/lib/config";
import useAllEgpListedCompanies from "@/hooks/useAllEgpListedCompany";
import { handleAuthorizationLetterDownload } from "@/utils/handleDownloadAuthorization";

const LetterOfAuthorization = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const egpEmail = searchParams.get("egpEmail");
  const { data: currentTender } = useSingleData(`${config.apiBaseUrl}/tenders/tenderId/${id}`);
  const { egpListedCompanies } = useAllEgpListedCompanies(egpEmail || "Skip");
  const companyData = egpListedCompanies?.[0];

  return (
    <div className="container max-w-4xl mx-auto  my-10  bg-white">
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={() => handleAuthorizationLetterDownload(companyData, currentTender)}>
          Download PDF
        </Button>
      </div>

      {/* Preview Area (remains same for UI) */}
      <div className="border p-10 mt-5" id="print-area">
        {/* Company Section */}
        <div className="mb-6 text-center border-b-2 border-purple-900">
          <h1 className="font-bold text-4xl text-blue-900">{companyData?.companyName || "N/A"}</h1>
          <p className="text-purple-900 font-bold">
            Proprietor Name: {companyData?.proprietorName}, <br /> Address:{" "}
            {companyData?.companyAddress}, <br /> E-mail: {companyData?.egpEmail}
          </p>
          <br />
        </div>

        {/* Date Section */}
        <div className="flex justify-between mb-10">
          <p>Ref:</p>
          <p>Date: {formatDate(new Date(), "dd-MM-yyyy")}</p>
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-lg mb-6 underline">Letter of Authorization</h2>

        {/* Tender Info */}
        <div className="mb-4 ">
          <p className="text-black grid grid-cols-3">
            <strong>Invitation for Tender No:</strong>
            <span className="col-span-2 ">{currentTender?.tenderId}</span>
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
            <strong>Lot Description</strong>{" "}
            <span className="col-span-2 text-justify">
              {currentTender?.procurementNature || "N/A"} <br />{" "}
              {currentTender?.descriptionOfWorks || "N/A"}
            </span>{" "}
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
              I, the undersigned, being the Sole Proprietor of the firm{" "}
              <span className="font-bold">{companyData?.companyName || "N/A"}</span>, do hereby
              authorize Md Didarul Alam, Proprietor, residing at{" "}
              <span className="font-bold">
                {companyData?.companyAddress || "N/A"}, to sign and execute all documents related to
                the tender on behalf of the firm. His specimen signatures are provided below for
                verification.
              </span>
            </p>
          </div>

          <div className="mb-4  text-justify">
            <p className="text-justify text-black">
              Furthermore, we understand that, according to your conditions, the Tenderer’s
              Financial Capacity i.e. Liquid Asset must be substantiated by a Letter of Commitment
              of Bank’s Undertaking for Line of Credit.
            </p>
          </div>

          <div className="mt-8  text-justify">
            <p className="text-justify text-black">
              In witness whereof, authorised representative of the Bank has hereunto signed and
              sealed this Letter of Commitment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterOfAuthorization;
