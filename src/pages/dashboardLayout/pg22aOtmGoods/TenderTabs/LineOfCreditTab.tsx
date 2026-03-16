/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSingleData from "@/hooks/useSingleData";
import { formatDate } from "@/lib/formateDate";
import { AuthContext } from "@/provider/AuthProvider";
import { useContext, useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

interface LineOfCreditTabProps {
  currentTender: any;
  egpEmail: string;
  companyData: any;
  companyMigration?: any;
}

export const LineOfCreditTab: React.FC<LineOfCreditTabProps> = ({
  currentTender,
  egpEmail,
  companyData,
  companyMigration,
}) => {
  const { user } = useContext(AuthContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "Line-Of-Credit-Letter",
  });

  console.log(currentTender);

  const handleDownloadDoc = () => {
    const el = contentRef.current;
    if (!el) return;

    let content = el.innerHTML.replace(
      /<br\s*\/?>(?=)/gi,
      '<br style="mso-special-character:line-break;" />'
    );

    // Convert spans with font-bold into <strong> for reliable Word rendering
    content = content.replace(/<span\b[^>]*\bclass\s*=\s*(['"])>?/gi, (m) => m);
    content = content.replace(
      /<span\b[^>]*\bclass\s*=\s*(['"])\s*[^"']*\bfont-bold\b[^"']*\1[^>]*>([\s\S]*?)<\/span>/gi,
      "<strong>$2</strong>"
    );

    // Force margin-left for the Date span in the exported HTML (Word-safe)
    content = content.replace(
      /(<span[^>]*>\s*Date:\s*<span[^>]*>)/i,
      "$1".replace("<span", '<span style="margin-left:320px;display:inline-block;"')
    );

    // Force exported H2 with text-lg to 16px (Word may apply default heading sizes)
    content = content.replace(/<h2([^>]*)class=(['"][^'"\]]*text-lg[^'"\]]*['"][^>]*)>/gi, (m) =>
      m.replace("<h2", '<h2 style="font-size:20px;"')
    );
    // Force exported H3 to be purple and centered (inline styles so Word preserves them)
    content = content.replace(/<h3\b([^>]*)>/gi, (match, attrs) => {
      try {
        if (/style=(['"]).*?\1/i.test(attrs)) {
          return `<h3${attrs.replace(
            /style=(['"])(.*?)\1/i,
            (s, q, v) => `style=${q}${v}; font-size:20px; color:#6D28D9; text-align:center;${q}`
          )}>`;
        }
        return `<h3${attrs} style="font-size:20px; color:#6D28D9; text-align:center;">`;
      } catch (e) {
        return `<h3${attrs}>`;
      }
    });
    // Force inline style for text-align: justify on the main justified content div for Word compatibility
    content = content.replace(
      /<div([^>]*class=["'][^"']*text-justify[^"']*["'][^>]*)>/,
      (match, p1) => `<div${p1} style="text-align:justify;">`
    );

    // Ensure table and cell borders are inlined so Word preserves them
    // Add table style (collapse borders and full width)
    content = content.replace(/<table([^>]*)>/gi, (m, attrs) => {
      if (/style=/.test(attrs)) {
        return `<table${attrs.replace(
          /style=(["'])(.*?)\1/,
          (s, q, v) =>
            `style=${q}${v}; border-collapse:collapse; width:100%; border:1px solid #000;${q}`
        )}>`;
      }
      return `<table${attrs} style="border-collapse:collapse; width:100%; border:1px solid #000;">`;
    });

    // Add border style to all table cells (td/th)
    content = content.replace(/<(td|th)([^>]*)>/gi, (m, tag, attrs) => {
      if (/style=/.test(attrs)) {
        return `<${tag}${attrs.replace(
          /style=(["'])(.*?)\1/,
          (s, q, v) => `style=${q}${v}; border:1px solid #000;${q}`
        )}>`;
      }
      return `<${tag}${attrs} style="border:1px solid #000;">`;
    });

    // Inline font-size for elements with class text-xs so Word preserves the sizing
    content = content.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
      try {
        if (!/class=(["']).*?\btext-xs\b.*?\1/i.test(attrs)) return full;
        if (/style=(["'])(.*?)\1/i.test(attrs)) {
          return `<${tag}${attrs.replace(
            /style=(["'])(.*?)\1/i,
            (s, q, v) => `style=${q}${v}; font-size:9px;${q}`
          )}>`;
        }
        return `<${tag}${attrs} style="font-size:9px;">`;
      } catch (e) {
        return full;
      }
    });

    // Inline font-size for elements with class text-sm so Word preserves the sizing (prevent Word shrinking)
    content = content.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
      try {
        if (
          !/class=(['"]) .*?\btext-sm\b.*?\1/i.test(attrs) &&
          !/class=(['"])\btext-sm\b.*?\1/i.test(attrs)
        )
          return full;
        if (/style=(["'])(.*?)\1/i.test(attrs)) {
          return `<${tag}${attrs.replace(
            /style=(["'])(.*?)\1/i,
            (s, q, v) => `style=${q}${v}; font-size:10px;${q}`
          )}>`;
        }
        return `<${tag}${attrs} style="font-size:10px;">`;
      } catch (e) {
        return full;
      }
    });

    // Inline padding-left for elements with class pl-3 (0.75rem = 12px)
    content = content.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
      try {
        if (!/class=(['"]).*?\bpl-3\b.*?\1/i.test(attrs)) return full;
        if (/style=(["'])(.*?)\1/i.test(attrs)) {
          return `<${tag}${attrs.replace(
            /style=(["'])(.*?)\1/i,
            (s, q, v) => `style=${q}${v}; padding-left:12px;${q}`
          )}>`;
        }
        return `<${tag}${attrs} style="padding-left:12px;">`;
      } catch (e) {
        return full;
      }
    });

    // Inline font-style for elements with class italic so Word preserves italic styling
    content = content.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
      try {
        if (!/class=(["']).*?\bitalic\b.*?\1/i.test(attrs)) return full;
        if (/style=(["'])(.*?)\1/i.test(attrs)) {
          return `<${tag}${attrs.replace(
            /style=(["'])(.*?)\1/i,
            (s, q, v) => `style=${q}${v}; font-style:italic;${q}`
          )}>`;
        }
        return `<${tag}${attrs} style="font-style:italic;">`;
      } catch (e) {
        return full;
      }
    });

    const html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="ProgId" content="Word.Document" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <style>
            @page Section1 { size: Legal; margin: 0; mso-page-orientation: portrait; }
            div.Section1 { page: Section1; }
            body { font-family: Arial, Helvetica, sans-serif; color: #000; margin: 0; }
            .font-bold, strong, b { font-weight: 700; }
            .underline { text-decoration: underline; }
            .italic, em { font-style: italic; }
            .text-center { text-align: center; }
            .uppercase { text-transform: uppercase; }
            .border-t { border-top: 1px solid #000; }
            .pt-2 { padding-top: 0.5rem; }
            .text-sm { font-size: 10px; }
            .text-xs { font-size: 9px; }
            .text-justify { text-align: justify !important; }
            .text-lg { font-size: 16px; }
            .text-xl { font-size: 18px; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mt-10 { margin-top: 2.5rem; }
            .mt-16 { margin-top: 4rem; }
            .mt-24 { margin-top: 94px; }
            .mt-20 { margin-top: 80px; }
            .mb-24 { margin-bottom: 94px; }
            .ml-80 { margin-bottom: 320px; }
            .ml-3 { padding-left: 12px; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .ml-80 { margin-left: 320px !important; }
          </style>
        </head>
        <body>${content}</body>
      </html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "LineOfCreditLetter.doc";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Fetch tender data using tenderId from currentTender
  const { data: tender } = useSingleData(
    currentTender?.tenderId
      ? `${config.apiBaseUrl}/tenders/tenderId/${currentTender.tenderId}`
      : null
  );

  

  // Prefer company details from tender preparation company over account holder details

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
      <div className="flex flex-col gap-6">
        {/* Preview Panel */}
        <div className="flex justify-end gap-2">
          <Button onClick={() => reactToPrintFn()}>Print</Button>
          <Button onClick={handleDownloadDoc}>Download DOC</Button>
        </div>

        <div className="border rounded">
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
                    {currentTender?.InvitationReferenceNo || "N/A"} &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    Date:
                    {formatDate(tender?.openingDateTime, "MM-dd-yyyy")}
                  </p>
                  <p>Tender Package No:{currentTender?.packageNo || "N/A"} </p>
                  <p>Lot No : {tender?.tenderId || "N/A"} </p>
                  <p>
                    To: {currentTender?.officialDesignation || "N/A"}, <br />{" "}
                    {currentTender?.procuringEntityName
                      ? currentTender?.procuringEntityName
                      : currentTender?.division || "N/A"}
                    , <br />
                    {currentTender?.locationDistrict ? currentTender?.locationDistrict : "N/A"}{" "}
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
                      {currentTender?.liquidAssets || "[in figure]"} ({numberToWords(10000000)})
                    </span>{" "}
                    for the sole purpose of the execution of the above Contract. This Revolving Line
                    of Credit will be maintained by us until issuance of “Acceptance Certificate” by
                    the Procuring Entity.
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
  );
};
