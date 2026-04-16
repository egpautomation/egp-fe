// @ts-nocheck

import useAllEgpListedCompanies from "@/hooks/useAllEgpListedCompany";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { config } from "@/lib/config";
import { CirclePlus, Edit, Eye, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "../ui/input";
import { motion } from "framer-motion";

const AllEgpListedCompany = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { egpListedCompanies, setReload } = useAllEgpListedCompanies(searchTerm);

  return (
    <div className="">
      <div className="mt-8 mx-auto max-w-full">
        <div className="flex max-md:flex-col max-md:gap-2 justify-between">
          <h1 className="text-2xl font-semibold">Egp Listed Company</h1>
          <div className="flex items-center justify-center gap-2">
            <Input
              value={searchTerm}
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link
              to="/dashboard/create-egp-listed-company"
              className="bg-primary text-primary-foreground px-6 flex items-center rounded py-2"
            >
              <CirclePlus className="inline-block mr-1" size={16} /> Create
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <div className="overflow-x-auto max-lg:hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">User</th>
                  <th className="whitespace-nowrap px-4 py-2 text-start ">Egp Email</th>
                  <th className="whitespace-nowrap px-4 py-2 text-start ">Company Name</th>
                  <th className="whitespace-nowrap px-4 py-2 text-start ">Password Status</th>
                  <th className="whitespace-nowrap px-4 py-2 text-start ">Status</th>
                  <th className="whitespace-nowrap px-4 py-2 text-start ">LTM District</th>
                  <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">Actions</th>
                </tr>
              </thead>

              <tbody>
                {egpListedCompanies?.map((company, idx) => (
                  <tr key={idx} className={`border ${idx % 2 == 1 && "bg-gray-100"}`}>
                    <td className="px-4 py-2">{company?.userMail}</td>
                    <td className="px-4 py-2">{company?.egpEmail}</td>
                    <td className="px-4 py-2">{company?.companyName}</td>
                    <td className="px-4 py-2">{company?.password}</td>
                    <td className="px-4 py-2">{company?.remarks}</td>
                    <td className="px-4 py-2">{company?.ltmDistrict}</td>
                    <td className="px-4 py-2 flex items-center justify-center">
                      <Link to={`/dashboard/view-egp-listed-company/${company?._id}`}>
                        <Eye className="mr-2" size={20} />
                      </Link>
                      <Link to={`/dashboard/update-egp-listed-company/${company?._id}`}>
                        <Edit size={20} />
                      </Link>
                      <DeleteDataModal
                        setReload={setReload}
                        url={`${config.apiBaseUrl}/egp-listed-company/${company?._id}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MobileTableLayout data={egpListedCompanies} setReload={setReload} />
        </div>
      </div>
    </div>
  );
};

const MobileTableLayout = ({ data, setReload }: { data: any; setReload: any }) => {
  return (
    <div className="flex flex-col gap-6 my-8 lg:hidden px-2">
      {data?.map((item: any, idx: number) => (
        <div
          key={idx}
          className="flex flex-col gap-2 border rounded-xl p-4 py-6 shadow-sm bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              User:
            </span>
            <span className="text-gray-800 break-all sm:text-right font-medium">
              {item?.userMail}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              E-GP Email:
            </span>
            <span className="text-gray-800 break-all sm:text-right font-medium">
              {item?.egpEmail}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              Company Name:
            </span>
            <span className="text-gray-800 break-words sm:text-right font-medium">
              {item?.companyName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              Password Status:
            </span>
            <span className="text-gray-800 break-words sm:text-right font-medium">
              {item?.password}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              Status:
            </span>
            <span className="text-gray-800 break-words sm:text-right font-medium">
              {item?.remarks}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              LTM District:
            </span>
            <span className="text-gray-800 break-words sm:text-right font-medium">
              {item?.ltmDistrict}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-4">
            <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              Actions:
            </span>
            <div className="flex items-center gap-4">
              <Link
                to={`/dashboard/view-egp-listed-company/${item?._id}`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="View"
              >
                <Eye size={22} className="text-gray-600" />
              </Link>
              <Link
                to={`/dashboard/update-egp-listed-company/${item?._id}`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Edit"
              >
                <SquarePen size={22} className="text-blue-600" />
              </Link>
              <DeleteDataModal
                setReload={setReload}
                url={`${config.apiBaseUrl}/egp-listed-company/${item?._id}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllEgpListedCompany;
