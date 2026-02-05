// @ts-nocheck
import { Input } from "@/components/ui/input";
import { AlignJustify, Filter, Printer, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DatePickerWithRange } from "@/components/mainlayout/DatePickerWithRage";
import { TenderDepartmentsComboBox } from "@/components/mainlayout/Tenders/TenderDepartmentComboBox";
import { TenderCategoriesComboBox } from "@/components/mainlayout/Tenders/TenderCategoriesDepartments";
import { TenderLocationsComboBox } from "@/components/mainlayout/Tenders/TenderLocationComboBox";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "@/shared/Pagination/Pagination";

import useAllMethodTenders from "@/hooks/useAllMethodTenders";
import { useReactToPrint } from "react-to-print";
import "./printPdf.css";

import { formatDate } from "@/lib/formateDate";
import { Button } from "@/components/ui/button";
import DownloadPDF from "./TestDownloadPdf";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import autoTable from "jspdf-autotable";
import { overflow } from "html2canvas-pro/dist/types/css/property-descriptors/overflow";
import { motion } from "framer-motion";
const LtmTenders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const componentRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    Number(searchParams.get("limit")) || 20
  );
  const [date, setDate] = useState({
    from: "",
    to: "",
  });

  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { tenders, loading, tendersCount } = useAllMethodTenders(
    "LTM",
    searchTerm,
    date?.from,
    date?.to,
    department,
    category,
    location,
    currentPage,
    pageLimit
  );

  const skeleton = new Array(pageLimit).fill(Math?.random());

  const downloadPdf = () => {
    const doc = new jsPDF("p", "mm", "legal");

    const tableColumn = [
      "Tender ID",
      "Department",
      "Description",
      "Location",
      "Details",
    ];
    const tableRows = [];

    tenders.forEach((item) => {
      const details = [
        `Last Selling Date: ${formatDate(
          item?.documentLastSelling,
          "MM-dd-yyyy"
        )}`,
        `Closing Date: ${formatDate(item?.openingDateTime, "MM-dd-yyyy")}`,
        `Document Price: ${item?.documentPrice}`,
        `Tender Security: ${item?.tenderSecurity}`,
        `Estimated Amount: ${item?.estimatedCost}`,
        `Line Of Credit: ${item?.liquidAssets}`,
      ].join("\n");

      const rowData = [
        item?.tenderId,
        item?.organization,
        item?.descriptionOfWorks,
        item?.locationDistrict,
        details,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      margin: { top: 20, bottom: 25, left: 10, right: 10 }, // ensures safe print area
      styles: {
        fontSize: 10,
        cellPadding: 2.5,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Tender ID
        1: { cellWidth: 30 }, // Department
        2: { cellWidth: 50 }, // Description
        3: { cellWidth: 30 }, // Location
        4: { cellWidth: 60 }, // Details
      },
      headStyles: {
        fillColor: [37, 37, 37],
        textColor: 255,
        fontSize: 12,
        fontStyle: "bold",
        halign: "start",
        whiteSpace: "nowrap",
      },
      didDrawPage: (data) => {
        const pageNumber = doc.internal.getNumberOfPages();

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(
          "E-GP Tender Automation (LTM Live Tenders)",
          data.settings.margin.left,
          15
        );

        const date = new Date();
        const formattedDate = `${date.getDate()} ${date.toLocaleString(
          "default",
          { month: "long" }
        )} ${date.getFullYear()}`;
        doc.setFontSize(10);
        doc.text(
          formattedDate,
          doc.internal.pageSize.width -
          data.settings.margin.right -
          doc.getTextWidth(formattedDate),
          15
        );

        const pageHeight = doc.internal.pageSize.height;
        const centerX = doc.internal.pageSize.width / 2;

        const line1Y = pageHeight - 18;
        const line2Y = line1Y + 4;
        const line3Y = line2Y + 4;

        doc.setFontSize(8);
        doc.setTextColor(37, 37, 37);

        doc.text(
          `© ${new Date().getFullYear()} E-GP Tender Automation — All Rights Reserved.`,
          centerX,
          line1Y,
          { align: "center" }
        );
        // Line 2 – full text, centered with links
        const prefix = "Visit us: ";
        const website = "egp.jubairahmad.com";
        const mid = " | WhatsApp: ";
        const whatsapp = "01926-959331";

        const fullText = prefix + website + mid + whatsapp;
        const fullWidth = doc.getTextWidth(fullText);
        const startX = centerX - fullWidth / 2;

        // Draw prefix
        doc.text(prefix, startX, line2Y);

        // Website link
        const prefixWidth = doc.getTextWidth(prefix);
        doc.textWithLink(website, startX + prefixWidth, line2Y, {
          url: "https://egp.jubairahmad.com",
        });

        // Mid text
        const websiteWidth = doc.getTextWidth(website);
        doc.text(mid, startX + prefixWidth + websiteWidth, line2Y);

        // WhatsApp link
        const midWidth = doc.getTextWidth(mid);
        doc.textWithLink(
          whatsapp,
          startX + prefixWidth + websiteWidth + midWidth,
          line2Y,
          {
            url: "https://wa.me/8801926959331",
          }
        );
        doc.text(`Page ${pageNumber}`, centerX, line3Y, { align: "center" });
      },

      pageBreak: "auto",
    });

    doc.save("ltm-tenders.pdf");
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", pageLimit);
    setSearchParams(params);
  }, [currentPage, pageLimit]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <div className="w-full">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2  justify-between">
          <div className="flex items-center gap-2 flex-1 ">
            <AlignJustify />
            <h1 className="text-2xl font-semibold mb-1">
              {tendersCount} LTM Tenders Are Live
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex md:justify-end  flex-1">
              <Button onClick={() => downloadPdf()}>
                <Printer /> Print as PDF
              </Button>
            </div>
            <div className="lg:hidden">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="cursor-pointer"
              >
                <Filter className="" />
              </Button>
            </div>{" "}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-5 max-lg:hidden">
        <Input
          value={searchTerm}
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[200px]"
        />

        <TenderDepartmentsComboBox setDepartment={setDepartment} />
        <TenderLocationsComboBox setLocation={setLocation} />
        <TenderCategoriesComboBox setCategory={setCategory} />

        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      {/*  */}
      {isFilterOpen && (
        <div className="flex lg:!hidden max-md:flex-col items-center gap-2 flex-wrap mt-5">
          <div className="lg:hidden w-full">
            <Input
              value={searchTerm}
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <TenderDepartmentsComboBox
            setDepartment={setDepartment}
            className="w-full"
          />
          <TenderLocationsComboBox
            setLocation={setLocation}
            className="w-full"
          />
          <TenderCategoriesComboBox
            setCategory={setCategory}
            className="w-full"
          />

          <DatePickerWithRange
            date={date}
            setDate={setDate}
            className="w-full"
          />
        </div>
      )}
      {/*  */}
      <div>
        <div id="table-to-download" className="overflow-x-auto">
          <div className="print-header hidden justify-between items-center">
            <h2 className="text-3xl font-bold mt-2">
              E-GP Tender Automation (LTM Live Tenders)
            </h2>
            <p className="text-lg text-gray-700">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <table className="mt-5 min-w-full print-content max-lg:hidden">
            <thead className="mt-5">
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl ">
                  Tender Id
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Organization
                </th>

                <th className="whitespace-nowrap px-4 py-1 text-start w-96  ">
                  Description
                </th>
                <th className="whitespace-nowrap px-4 py-2">Location</th>

                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Details
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-center rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading
                ? tenders?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={` ${idx % 2 == 1 && "bg-gray-100"}`}
                  >
                    <td
                      style={{ textAlign: "start", verticalAlign: "top" }}
                      className="px-4 py-2 text-sm"
                    >
                      {item?.tenderId}
                    </td>

                    <td
                      style={{ textAlign: "start", verticalAlign: "top" }}
                      className="px-4 py-2 text-sm"
                    >
                      {item?.organization}
                    </td>

                    <td
                      style={{
                        textAlign: "start",
                        verticalAlign: "top",
                        minWidth: "400px",
                      }}
                      className="px-4 py-2 text-[12px] text-justify w-96"
                    >
                      <Link
                        className="underline text-justify whitespace-break-spaces"
                        to={`/dashboard/view-tender/${item?._id}`}
                      >
                        {item?.descriptionOfWorks}
                      </Link>
                    </td>
                    <td
                      style={{ textAlign: "start", verticalAlign: "top" }}
                      className="px-4 py-2 text-sm"
                    >
                      {item?.locationDistrict}
                    </td>

                    <td
                      style={{ textAlign: "start", verticalAlign: "top" }}
                      className="px-4 py-2 text-sm text-nowrap"
                    >
                      <p>
                        {" "}
                        <span className="font-medium text-gray-600">
                          Last Selling Date:{" "}
                        </span>
                        {/* {format(item?.documentLastSelling, "MM-dd-yyyy")} */}
                        {formatDate(item?.documentLastSelling, "MM-dd-yyyy")}
                      </p>
                      <p>
                        {" "}
                        <span className="font-medium text-gray-600">
                          Closing Date:{" "}
                        </span>
                        {/* {format(item?.openingDateTime, "MM-dd-yyyy")} */}
                        {formatDate(item?.openingDateTime, "MM-dd-yyyy")}
                      </p>
                      <p>
                        {" "}
                        <span className="font-medium text-gray-600">
                          Document Price:{" "}
                        </span>
                        {item?.documentPrice}
                      </p>
                      <p>
                        {" "}
                        <span className="font-medium text-gray-600">
                          Tender Security:{" "}
                        </span>
                        {item?.tenderSecurity}
                      </p>
                      <p>
                        {" "}
                        <span className="font-medium text-gray-600">
                          Estimated Amount:{" "}
                        </span>
                        {item?.estimatedCost}
                      </p>
                      <p>
                        {" "}
                        <span className="font-medium text-gray-600">
                          Line Of Credit:{" "}
                        </span>
                        {item?.liquidAssets}
                      </p>
                    </td>
                    <td className="px-4 py-2 text-center" style={{ verticalAlign: "top" }}>
                      <a
                        href={`https://www.eprocure.gov.bd/resources/common/ViewTender.jsp?id=${item?.tenderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                        title="View on e-GP"
                      >
                        <ExternalLink className="h-4 w-4" />
                        e-GP
                      </a>
                    </td>
                  </tr>
                ))
                : skeleton.map((item, idx) => (
                  <tr key={idx}>
                    <td
                      colSpan={6}
                      className={`h-20 ${idx % 2 == 1 ? "bg-gray-300" : "bg-white"
                        }`}
                    ></td>
                  </tr>
                ))}
            </tbody>
          </table>
          <MobileTableLayout data={tenders} />
          <div className=" py-5 font-medium hidden">
            © {new Date().getFullYear()} E-GP Tender Automation — All Rights
            Reserved. <br />
            Visit us at{" "}
            <a
              href="https://egp.jubairahmad.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              egp.jubairahmad.com
            </a>{" "}
            | Contact:{" "}
            <a
              href="https://wa.me/8801926959331"
              target="_blank"
              rel="noopener noreferrer"
            >
              01926-959331 (WhatsApp)
            </a>
          </div>
        </div>
      </div>

      {/* <DownloadPDF /> */}

      <Pagination
        data={{
          pageLimit,
          setCurrentPage,
          setPageLimit,
          count: tendersCount,
          currentPage,
        }}
      />
    </div>
  );
};

const MobileTableLayout = ({
  data,
  setReload,
}: {
  data: any;
  setReload: any;
}) => {
  console.log(data);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const buttonVariants = {
    rest: {
      scale: 1,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-6 my-8 lg:hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data?.map((item: any, idx: number) => (
        <motion.div
          key={idx}
          className="flex flex-col gap-2 border rounded-xl p-4 md:p-8 py-6"
          variants={cardVariants}
          whileHover={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 },
          }}
        >
          <div className="">
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Tender Id: </h1>
              <h1 className="text-gray-700 text-2xl">{item?.tenderId}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Organization: </h1>
              <h1 className="text-gray-700 ">{item?.department}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Description: </h1>
              <h1 className="text-gray-700 ">
                <Link
                  className="underline text-justify whitespace-break-spaces"
                  to={`/dashboard/view-tender/${item?._id}`}
                >
                  {item?.descriptionOfWorks}
                </Link>
              </h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Location: </h1>
              <h1 className="text-gray-700 ">{item?.locationDistrict}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Last Selling Date: </h1>
              <h1 className="text-gray-700 ">
                {formatDate(item?.documentLastSelling, "MM-dd-yyyy")}
              </h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Closing Date: </h1>
              <h1 className="text-gray-700 ">
                {formatDate(item?.openingDateTime, "MM-dd-yyyy")}
              </h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Document Price: </h1>
              <h1 className="text-gray-700 ">{item?.documentPrice}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Tender Security: </h1>
              <h1 className="text-gray-700 ">{item?.tenderSecurity}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Estimated Amount: </h1>
              <h1 className="text-gray-700 ">{item?.estimatedCost}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Line Of Credit: </h1>
              <h1 className="text-gray-700 ">{item?.liquidAssets}</h1>
            </motion.div>

            <motion.div
              className="flex gap-2 mt-4"
              initial={{ opacity: 0, y: 10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + idx * 0.05, duration: 0.3 }}
            >
              <a
                href={`https://www.eprocure.gov.bd/resources/common/ViewTender.jsp?id=${item?.tenderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                title="View on e-GP"
              >
                <ExternalLink className="h-4 w-4" />
                View on e-GP
              </a>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LtmTenders;
