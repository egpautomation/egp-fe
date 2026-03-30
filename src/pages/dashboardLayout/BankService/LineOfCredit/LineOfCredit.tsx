// @ts-nocheck
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSingleData from "@/hooks/useSingleData";
import { formatDate } from "@/lib/formateDate";
import { AuthContext } from "@/provider/AuthProvider";
import { useContext, useReducer, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AccountHolderEgpMail } from "../AccountHolderDetails/AccountHolderEgpMail";

const LineOfCredit = () => {
  const [creditAmount, setCreditAmount] = useState(0);
  const { user } = useContext(AuthContext);
  const [tenderId, setTenderId] = useState("");
  const [egpMail, setEgpMail] = useState("");
  const contentRef = useReducer(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Line-Of-Credit-Letter",
  });
  const { data: tender } = useSingleData(`${config.apiBaseUrl}/tenders/tenderId/${tenderId}`);

  const { data: accountData } = useSingleData(
    `${config.apiBaseUrl}/accounts/egp-email?egpMail=${egpMail}`
  );

  const { data: bankData } = useSingleData(`${config.apiBaseUrl}/banks/user?user=${user?.email}`);

  // Display settings state
  const [displaySettings, setDisplaySettings] = useState({
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 1.5,
  });

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setDisplaySettings((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const numberToWords = (num) => {
    const a = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    const b = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    if (num === 0) return "zero";

    const numToWordsBelowThousand = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      return (
        a[Math.floor(n / 100)] +
        " hundred" +
        (n % 100 ? " " + numToWordsBelowThousand(n % 100) : "")
      );
    };

    let result = "";

    if (Math.floor(num / 10000000) > 0) {
      result += numToWordsBelowThousand(Math.floor(num / 10000000)) + " crore ";
      num %= 10000000;
    }
    if (Math.floor(num / 100000) > 0) {
      result += numToWordsBelowThousand(Math.floor(num / 100000)) + " lakh ";
      num %= 100000;
    }
    if (Math.floor(num / 1000) > 0) {
      result += numToWordsBelowThousand(Math.floor(num / 1000)) + " thousand ";
      num %= 1000;
    }
    if (Math.floor(num / 100) > 0) {
      result += numToWordsBelowThousand(Math.floor(num / 100)) + " hundred ";
      num %= 100;
    }
    if (num > 0) {
      result += numToWordsBelowThousand(num) + " ";
    }

    return result.trim();
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex flex-col  gap-6">
        {/* Settings Controls */}
        <div className=" rounded-lg flex-1">
          <h3 className="text-xl font-semibold mb-3">Display Settings</h3>
          <div className="grid grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Margin Top ({displaySettings.paddingTop}px)
              </label>
              <input
                type="range"
                name="paddingTop"
                min="5"
                max="200"
                value={displaySettings.paddingTop}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Margin Bottom ({displaySettings.paddingBottom}px)
              </label>
              <input
                type="range"
                name="paddingBottom"
                min="5"
                max="200"
                value={displaySettings.paddingBottom}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Margin Left ({displaySettings.paddingLeft}px)
              </label>
              <input
                type="range"
                name="paddingLeft"
                min="20"
                max="200"
                value={displaySettings.paddingLeft}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Margin Right ({displaySettings.paddingRight}px)
              </label>
              <input
                type="range"
                name="paddingRight"
                min="20"
                max="200"
                value={displaySettings.paddingRight}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Font Size ({displaySettings.fontSize}px)
              </label>
              <input
                type="range"
                name="fontSize"
                min="10"
                max="24"
                value={displaySettings.fontSize}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Line Height ({displaySettings.lineHeight})
              </label>
              <input
                type="range"
                name="lineHeight"
                min="1"
                max="2"
                step="0.1"
                value={displaySettings.lineHeight}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Settings and Form Panel */}
        <div className="w-full   gap-5 ">
          <div className="flex-1 grid grid-cols-3 gap-5 space-y-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">E-GP Email</label>
              <AccountHolderEgpMail setEgpMail={setEgpMail} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">TenderId</label>
              <Input
                type="number"
                name="tenderId"
                value={tenderId}
                onChange={(e) => setTenderId(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm  mb-1">
                <span className="font-medium inline-block"> Credit Amount</span>{" "}
                {tender?.liquidAssets && `(${tender?.liquidAssets})`}
              </label>
              <Input
                type="number"
                name="creditAmount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex justify-end">
          {" "}
          <Button onClick={() => reactToPrintFn()}>Print</Button>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Bank Commitment Letter Generator</h2>
        <div className="border rounded ">
          <div ref={contentRef} className="w-full print-content text-justify border border-red">
            <div className="">
              <div
                className=" bg-white"
                style={{
                  fontSize: `${displaySettings.fontSize}px`,
                  paddingTop: `${displaySettings.paddingTop}px`,
                  paddingBottom: `${displaySettings.paddingBottom}px`,
                  paddingLeft: `${displaySettings.paddingLeft}px`,
                  paddingRight: `${displaySettings.paddingRight}px`,
                  lineHeight: displaySettings.lineHeight,
                }}
              >
                <div className="flex justify-end text-end">
                  <div>
                    <p className="text-sm leading-snug">
                      <b>Chandpur Sub-Branch (Matlab Branch)</b>
                    </p>
                    <p className="text-sm leading-snug">Zara Palace, Holding No-0716-01</p>
                    <p className="text-sm leading-snug">Chitro Lekha Mor, Ward #08,</p>
                    <p className="text-sm leading-snug">Chandpur Pourashova, Chandpur.</p>
                    <p className="text-sm leading-snug">Cell 01720472243</p>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <p className="font-semibold mt-2 underline">
                    Letter of Commitment for Bank's Undertaking for Line of Credit
                  </p>
                </div>

                <div className="mb-4">
                  <p>
                    <strong>Tender Invitation Ref no:</strong>{" "}
                    {tender?.InvitationReferenceNo || "N/A"} &nbsp; &nbsp; <strong>Date:</strong>{" "}
                    {formatDate(tender?.openingDateTime, "MM-dd-yyyy")}
                  </p>
                  <p>
                    <strong>Tender Package No:</strong> {tender?.packageNo || "N/A"}{" "}
                  </p>
                  <p>
                    <strong>Tender ID:</strong> {tender?.tenderId || "N/A"}{" "}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="font-bold">{tender?.officialDesignation || "Executive Engineer"}</p>
                  <p>
                    {tender?.organization || "Executive Engineer"},{" "}
                    {tender?.locationDistrict || "LGED, Chandpur."}
                  </p>
                  <div className="flex justify-between">
                    <p>
                      <strong>Credit Commitment No:</strong> {bankData?.creditCommitmentNo || "N/A"}
                    </p>
                    <p className="font-bold">{formatDate(new Date(), "dd-MM-yyyy")}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p>
                    We have been informed that <strong>{accountData?.bankAccName || "N/A"}</strong>,
                    Proprietor <strong>{accountData?.accHolderName || "N/A"}</strong>, Address:{" "}
                    <strong>{accountData?.accHolderAddress || "N/A"}</strong> (herein after called
                    The Tenderer) intends to submit to you it's Tender for the execution of the
                    works of <strong> "{tender?.descriptionOfWorks || "N/A"}" </strong>
                    under the above invitation of Tenders (herein after called "the IFT").
                  </p>
                </div>

                <div className="mb-4">
                  <p>
                    Furthermore, we understand that, according to your conditions, The Tender's
                    financial capacity i.e Liquid Asset must be substantiated by a letter of
                    commitment of Bank's undertaking for Line of Credit.
                  </p>
                </div>

                <div className="mb-4">
                  <p>
                    At the request of, and arrangement with the Tenderer,{" "}
                    <span className="font-bold inline-block">
                      {bankData?.bankName}, {bankData?.branchName}, {tender?.locationDistrict}
                    </span>{" "}
                    do hereby agree and undertake that{" "}
                    <strong>{accountData?.bankAccName || "N/A"}</strong>, Proprietor{" "}
                    <strong>{accountData?.accHolderName || "N/A"}</strong>, Address{" "}
                    <strong>{accountData?.accHolderAddress || "N/A"}</strong>, will be provided by
                    us with a revolving line of credit, in case awarded the contract, for execution
                    of the Works Viz "<strong>{tender?.descriptionOfWorks || "N/A"}</strong> " for
                    the amount not less than BDT <strong>{creditAmount || "N/A"}</strong>&nbsp;{" "}
                    {creditAmount ? `(${numberToWords(Number(creditAmount))} taka only)` : ""} for
                    the sole purpose of the execution of the above contract. This revolving line of
                    Credit will be maintained by us until issuance of Taking Over Certificate by the
                    Procuring Entity.
                  </p>
                </div>

                <div className="mt-8">
                  <p>
                    In witness whereof, authorized representative of the Bank has hereunto signed
                    and sealed this letter of commitment.
                  </p>
                  <p className="mt-8">With regards</p>
                </div>
                <div className="flex justify-evenly mt-16 text-center">
                  <div>
                    <p>
                      <strong>{bankData?.officerName1 || ""}</strong>
                    </p>
                    <p className="">Junior Office</p>
                  </div>
                  <div>
                    <p>
                      <strong>{bankData?.officerName2 || ""}</strong>
                    </p>
                    <p className="">Junior Office</p>
                  </div>
                  <div>
                    <p>
                      <strong>{bankData?.officerName3 || ""}</strong>
                    </p>
                    <p className="">Head Sub Brunch</p>
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

export default LineOfCredit;
