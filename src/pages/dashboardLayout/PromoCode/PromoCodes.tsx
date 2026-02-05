// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAllPromoCodes from "@/hooks/useAllPromoCodes";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { format } from "date-fns";
import { AlignJustify, Plus, SquarePen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const PromoCodes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {promoCodes, loading, setReload} = useAllPromoCodes(searchTerm)

  return (
    <div>
      <div className="flex justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">
            Promo Codes List
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Link
            className=" inline-block"
            to={"/dashboard/create-promo-code"}
          >
            <Button className="cursor-pointer mr-2">
              <Plus />
             Create Promo Code
            </Button>
          </Link>
          <Input
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Code
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                 Percentage
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Deadline
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Validate
                </th>
                <th className="whitespace-nowrap px-4 py-2  rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                promoCodes?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                  >
                    <td className="px-4 py-2">{item?.name}</td>
                    <td className="px-4 py-2">{item?.code}</td>
                    <td className="px-4 py-2">{item?.percent}</td>
                    <td className="px-4 py-2">{format(item?.deadline,"MM-dd-yyyy")}</td>
                    <td className="px-4 py-2">{item?.isValidate ? "yes" : "no"}</td>
                    <td className="px-4 py-2 flex items-center justify-center ">
                      
                      <Link
                        to={`/dashboard/edit-company-registration/${item?._id}`}
                      >
                        <SquarePen className="mx-2 mt-2" size={24} />
                      </Link>
                      <DeleteDataModal
                        setReload={setReload}
                        url={`https://egp-tender-automation-server.vercel.app/api/v1/companyMigration/${item?._id}`}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default PromoCodes;
