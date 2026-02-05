// @ts-nocheck
import { AlignJustify, Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "@/shared/Pagination/Pagination";
import useAllDepartments from "@/hooks/useAllDepartments";
import { Button } from "@/components/ui/button";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";

const Departments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    Number(searchParams.get("limit")) || 20
  );

  const { departments, loading, count, setReload } = useAllDepartments();
  const skeleton = new Array(pageLimit).fill(Math?.random());

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", pageLimit);
    setSearchParams(params);
  }, [currentPage, pageLimit]);

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap my-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlignJustify />
            <h1 className="text-2xl font-semibold mb-1">All Departments</h1>
          </div>
        </div>
        <div>
          <Link to={"/dashboard/create-department"}>
            <Button className="cursor-pointer">
              <Plus /> Create Department
            </Button>
          </Link>
        </div>
      </div>

      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  Organization
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Short Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Bangla ShortName
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  LTM License NameCode
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  detailsName
                </th>

                <th className="whitespace-nowrap px-4 py-2  rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading ? (
                departments?.length > 0 ? (
                  departments?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                    >
                      <td className="px-4 py-2">{item?.organization}</td>
                      <td className="px-4 py-2">{item?.shortName}</td>
                      <td className="px-4 py-2">
                        {item?.departmentBanglaShortName}
                      </td>
                      <td className="px-4 py-2">{item?.LTMLicenseNameCode}</td>
                      <td className="px-4 py-2">{item?.detailsName}</td>

                      <td className="px-4 py-2 flex items-center justify-center ">
                        <Link to={`/dashboard/edit-department/${item?._id}`}>
                          <Edit className="mx-2 mt-2" size={24} />
                        </Link>
                        <DeleteDataModal
                          setReload={setReload}
                          url={`https://egp-tender-automation-server.vercel.app/api/v1/departments/${item?._id}`}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-10">
                    <td className="text-center" colSpan={6}>
                      No Department Found
                    </td>
                  </tr>
                )
              ) : (
                skeleton.map((item, idx) => (
                  <tr key={idx}>
                    <td
                      colSpan={6}
                      className={`h-14 ${
                        idx % 2 == 1 ? "bg-gray-300" : "bg-white"
                      }`}
                    ></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      }
      {departments?.length > 0 && (
        <Pagination
          data={{
            pageLimit,
            setCurrentPage,
            setPageLimit,
            count: count,
            currentPage,
          }}
        />
      )}
    </div>
  );
};

export default Departments;
