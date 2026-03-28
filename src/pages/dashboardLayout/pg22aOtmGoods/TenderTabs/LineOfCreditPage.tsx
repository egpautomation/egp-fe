// @ts-nocheck
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import useSingleData from "@/hooks/useSingleData";
import { formatDate } from "@/lib/formateDate";
import { downloadCreditLineAsWord } from "@/lib/utils";
import { useRef } from "react";

import type { 
  Tender, 
  TenderPreparation, 
  EgpListedCompany, 
  CompanyMigration,
  LineOfCreditTenderData 
} from "@/types/tender";
import { useParams, useSearchParams } from "react-router-dom";
import useAllEgpListedCompanies from "@/hooks/useAllEgpListedCompany";
import { numberToWords } from "@/utils/numberToWords";




export default function LineOfCreditPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement>(null);
  const { id } = useParams(); 
  const [searchParams] = useSearchParams();
  const egpEmail = searchParams.get('egpEmail');
  const tenderId = Number(id)

  const { data: currentTender } = useSingleData(`${config.apiBaseUrl}/tenders/tenderId/${tenderId}` );

  const { egpListedCompanies,  } = useAllEgpListedCompanies(egpEmail || "Skip"); 
  const companyData = egpListedCompanies?.[0];

  // Fetch live tender data if not provided via prop
  const { data: fetchedLiveTender } = useSingleData(
    currentTender?.tenderId
      ? `${config.apiBaseUrl}/tenders/tenderId/${currentTender.tenderId}`
      : null
  );

  // Use prop if available, otherwise use fetched data
  const liveTender =  fetchedLiveTender;

  // Merge data: prioritize liveTender for fields that come from Tender model
  // Fall back to currentTender (TenderPreparation) for other fields
  const mergedTenderData: LineOfCreditTenderData = {
    ...currentTender,
    // Override with live tender data (from Tender model - has the missing fields)
    packageNo: liveTender?.packageNo || currentTender?.packageNo,
    InvitationReferenceNo: liveTender?.InvitationReferenceNo || currentTender?.InvitationReferenceNo,
    procuringEntityName: liveTender?.procuringEntityName || currentTender?.procuringEntityName,
    division: liveTender?.division || currentTender?.division,
    openingDateTime: liveTender?.openingDateTime || currentTender?.openingDateTime,
    liquidAssets: liveTender?.liquidAssets || currentTender?.liquidAssets,
    officialDesignation: liveTender?.officialDesignation || currentTender?.officialDesignation,
    locationDistrict: liveTender?.locationDistrict || currentTender?.locationDistrict,
    descriptionOfWorks: liveTender?.descriptionOfWorks || currentTender?.descriptionOfWorks,
    procurementNature: liveTender?.procurementNature || currentTender?.procurementNature,
    tenderId: currentTender?.tenderId || liveTender?.tenderId,
  };

  

  

  return (
   <div>
      <div className="container max-w-4xl my-10 mx-auto p-5">
        <div className="flex flex-col gap-6">
          <div className="flex justify-end gap-2">
            <Button onClick={()=> downloadCreditLineAsWord(contentRef.current, "Line Of Credit.doc")}>Download DOC</Button>
          </div>

          <div className="border rounded">
            <div ref={contentRef} className="w-full print-content text-justify border ">
              <div className="">
                <div className="bg-white p-8 ">
                  <div className="text-center mb-6">
                    <p className="font-bold mt-2 underline text-center ">
                      {liveTender?.procurementNature == "Goods"
                        ? "Letter of Commitment for Bank&apos;s Undertaking for Line of Credit (Form e-PG2-7)"
                        : "Letter of Commitment for Bank’s Undertaking for Line of Credit (Form e-PW2A-8)"}
                    </p>
                  </div>

                  <br />
                  <div className="mb-4">
                    <p>
                      Invitation for Tender No:
                      {liveTender?.InvitationReferenceNo || "N/A"} &nbsp; &nbsp;&nbsp;
                      &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                      &nbsp;&nbsp; Date:
                      {formatDate(currentTender?.openingDateTime, "MM-dd-yyyy")}
                    </p>
                    <p>Tender Package No:{liveTender?.packageNo || "N/A"} </p>
                    <p>Lot No : {liveTender?.tenderId || "N/A"} </p>
                    <p>
                      To: {mergedTenderData?.officialDesignation ? `${mergedTenderData?.officialDesignation},${<br />}` : ""} {" "}
                      {liveTender?.procuringEntityName
                        ? liveTender?.procuringEntityName
                        : liveTender?.division || "N/A"}
                      , <br />
                      {liveTender?.locationDistrict
                        ? liveTender?.locationDistrict
                        : "N/A"}{" "}
                      <br />
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-center">CREDIT COMMITTMENT No: [insert number]</p>
                  </div>

                  <div className="mb-4 mt-4 text-justify">
                    <p className="text-justify">
                      We have been informed that{" "}
                      <span className="font-bold">
                        {companyData
                          ? `${companyData?.companyName},${companyData?.companyAddress} `
                          : "[name of Tenderer] "}
                      </span>{" "}
                      (hereinafter called “the Tenderer”) intends to submit to you its Tender
                      (hereinafter called “the Tender”) for the execution of the{" "}
                      {currentTender?.procurementNature == "Goods" ? "Supply" : "Works"} of{" "}
                      <span className="font-bold">
                        {currentTender?.descriptionOfWorks
                          ? currentTender?.descriptionOfWorks
                          : `[description of ${currentTender?.procurementNature}]`}{" "}
                      </span>
                      under the above Invitation for Tenders (hereinafter called “the IFT”).
                    </p>
                  </div>

                  <div className="mb-4  text-justify">
                    <p className="text-justify">
                      Furthermore, we understand that, according to your conditions, the Tenderer’s
                      Financial Capacity i.e. Liquid Asset must be substantiated by a Letter of
                      Commitment of Bank’s Undertaking for Line of Credit.
                    </p>
                  </div>

                  <div className="mb-4  text-justify">
                    <p className="text-justify">
                      At the request of, and arrangement with, the Tenderer, we{" "}
                      <span className="font-bold">
                        {companyData
                          ? `${companyData?.bankName},${companyData?.bankAddress} `
                          : "[name and address of the Bank] "}
                      </span>{" "}
                      do hereby agree and undertake that{" "}
                      <span className="font-bold">
                        {companyData
                          ? `${companyData?.companyName},${companyData?.companyAddress} `
                          : "[name of Tenderer] "}
                      </span>
                      will be provided by us with a revolving line of credit, in case awarded the
                      Contract, for the delivery of {currentTender?.procurementNature} viz.{" "}
                      <span className="font-bold">
                        {currentTender?.descriptionOfWorks
                          ? currentTender?.descriptionOfWorks
                          : `[insert name of ${currentTender?.procurementNature}]`}{" "}
                      </span>{" "}
                      for an amount not less than BDT{" "}
                      <span className="font-bold">
                        {mergedTenderData?.liquidAssets || "[in figure]"} ({numberToWords(mergedTenderData?.liquidAssets)})
                      </span>{" "}
                      for the sole purpose of the execution of the above Contract. This Revolving
                      Line of Credit will be maintained by us until issuance of “Acceptance
                      Certificate” by the Procuring Entity.
                    </p>
                  </div>

                  <div className="mt-8  text-justify">
                    <p className="text-justify">
                      In witness whereof, authorised representative of the Bank has hereunto signed
                      and sealed this Letter of Commitment.
                    </p>
                  </div>
                  <br />
                  <div>
                    <p>
                      Signature
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Signature
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
