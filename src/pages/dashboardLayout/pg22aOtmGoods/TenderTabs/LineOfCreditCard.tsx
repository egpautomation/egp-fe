// @ts-nocheck
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useAllEgpListedCompanies from '@/hooks/useAllEgpListedCompany';
import { formatDate } from '@/lib/formateDate';
import { downloadCreditLineAsWord } from '@/lib/utils';
import { numberToWords } from '@/utils/numberToWords';
import { FileDown, FileSpreadsheet, FileText } from 'lucide-react'
import { useRef } from 'react';
import { Link } from 'react-router-dom'
interface authorizationCardProps {
    tenderId : string;
    egpEmail : string;
    currentTender?: any;
}

export default function LineOfCreditCard({tenderId, egpEmail, currentTender}: authorizationCardProps) {
   const contentRef = useRef<HTMLDivElement>(null);
  
  const { egpListedCompanies  } = useAllEgpListedCompanies(egpEmail || "Skip");
  const companyData = egpListedCompanies?.[0];
  return (
    <div>
        <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <CardTitle>Line Of Credit</CardTitle>
                                <CardDescription></CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                                <p>• Filtered Years: <span className="font-semibold">3</span></p>
                                <p>• Data Source: <span className="font-semibold">Saved Turnover Years</span></p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                  onClick={()=> downloadCreditLineAsWord(contentRef.current, "Line Of Credit.doc")}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    variant="default"
                                >
                                    <FileDown className="w-4 h-4 mr-1.5" />
                                  Download  PDF
                                </Button>
                                <Button

                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    variant="default"
                                >
                                    <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                                    <Link target='_blank' to={`/line-of-credit/${tenderId}?egpEmail=${egpEmail}`}>View </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <div className="border rounded hidden">
                            <div ref={contentRef} className="w-full print-content text-justify border ">
                              <div className="">
                                <div className="bg-white p-8 ">
                                  <div className="text-center mb-6">
                                    <p className="font-bold mt-2 underline text-center ">
                                      {currentTender?.procurementNature == "Goods"
                                        ? "Letter of Commitment for Bank&apos;s Undertaking for Line of Credit (Form e-PG2-7)"
                                        : "Letter of Commitment for Bank’s Undertaking for Line of Credit (Form e-PW2A-8)"}
                                    </p>
                                  </div>
                
                                  <br />
                                  <div className="mb-4">
                                    <p>
                                      Invitation for Tender No:
                                      {currentTender?.InvitationReferenceNo || "N/A"} &nbsp; &nbsp;&nbsp;
                                      &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                                      &nbsp;&nbsp; Date:
                                      {formatDate(currentTender?.openingDateTime, "MM-dd-yyyy")}
                                    </p>
                                    <p>Tender Package No:{currentTender?.packageNo || "N/A"} </p>
                                    <p>Lot No : {currentTender?.tenderId || "N/A"} </p>
                                    <p>
                                      To: {currentTender?.officialDesignation ? `${currentTender?.officialDesignation},${<br />}` : ""} {" "}
                                      {currentTender?.procuringEntityName
                                        ? currentTender?.procuringEntityName
                                        : currentTender?.division || "N/A"}
                                      , <br />
                                      {currentTender?.locationDistrict
                                        ? currentTender?.locationDistrict
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
                                        {currentTender?.liquidAssets || "[in figure]"} ({numberToWords(currentTender?.liquidAssets)})
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
  )
}
