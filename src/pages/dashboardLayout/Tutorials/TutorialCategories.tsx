// @ts-nocheck
import { config } from "@/lib/config";
import { AlignJustify, Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "@/shared/Pagination/Pagination";
import useAllDepartments from "@/hooks/useAllDepartments";
import { Button } from "@/components/ui/button";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import useAllTutorialsCategories from "@/hooks/useAllTutorialCategories";

const TutorialCategories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    Number(searchParams.get("limit")) || 20
  );

  const {  data, loading, count, setReload } = useAllTutorialsCategories();
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
            <h1 className="text-2xl font-semibold mb-1">All Tutorials Categories</h1>
          </div>
        </div>
        <div>
          <Link to={"/dashboard/tutorials/create-category"}>
            <Button className="cursor-pointer">
              <Plus /> Create Tutorials
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
                 Category
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                 Sub Categories
                </th>
               

                <th className="whitespace-nowrap px-4 py-2  rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading ? (
                data?.length > 0 ? (
                  data?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                    >
                      <td className="px-4 py-2 align-top">{item?.category}</td>
                      <td className="px-4 py-2 min-w-md align-top">{item?.subCategories}</td>
                     

                      <td className="px-4 py-2 flex items-center justify-center align-top ">
                        <Link to={`/dashboard/tutorials/edit-category/${item?._id}`}>
                          <Edit className="mx-2 mt-2" size={24} />
                        </Link>
                        <DeleteDataModal
                          setReload={setReload}
                          url={`${config.apiBaseUrl}/tutorials-categories/${item?._id}`}
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
      {data?.length > 0 && (
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

export default TutorialCategories;
