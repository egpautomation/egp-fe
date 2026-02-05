// @ts-nocheck

import { cn } from "@/lib/utils";
import { MoveLeft, MoveRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Pagination = ({ data }) => {
  const {
    setCurrentPage,
    count,
    currentPage,
    pageLimit,
    setPageLimit,
  } = data;

  const navigate = useNavigate();
  const location = useLocation();
  const currentParams = new URLSearchParams(location.search);

  const handlePagination = (e) => {
    e.preventDefault();
    setCurrentPage(Number(e.target.value));
    currentParams.set("page", e.target.value);
    currentParams.set("limit", pageLimit);
    navigate(`?${currentParams.toString()}`);
    // navigate(`?page=${e.target.value}&limit=${pageLimit}`);
  };

  const handlePreviousPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      currentParams.set("page", currentPage - 1);
      currentParams.set("limit", pageLimit);
      navigate(`?${currentParams.toString()}`);
      // navigate(`?page=${currentPage - 1}&limit=${pageLimit}`);
    }
  };

  const totalPage = Math.ceil(count / pageLimit);
  const pages = new Array(totalPage || 0).fill().map((_, index) => index + 1);
  

  const handleNextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
      currentParams.set("page", currentPage + 1);
      currentParams.set("limit", pageLimit);
      navigate(`?${currentParams.toString()}`);
      // navigate(`?page=${currentPage + 1}&limit=${pageLimit}`);
    }
  };
//   className={cn({ hidden: !count })}
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between  items-center gap-y-8 my-3">
        <div className="flex gap-5">
          <div className="font-semibold px-3 py-1 text-sm bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded">
            Current Page
            <select
              onChange={handlePagination}
              value={currentPage}
              className=" ml-2 bg-transparent border-none outline-none px-4"
              name="limit"
              id=""
            >
              {pages?.map((page) => (
                <option
                  key={page}
                  value={page}
                  className="border-none bg-primary text-primary-foreground"
                >
                  {page}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* <Pagination /> */}
        <div className="flex flex-wrap gap-4 justify-between items-center text-black font-semibold text-base rounded-lg">
          {currentPage == 1 ? (
            <button
              disabled
              className="btn border-none flex items-center gap-2 bg-white text-gray-500 hover:bg-white hover:text-gray-500 font-bold"
              onClick={handlePreviousPage}
            >
              <MoveLeft size={16} className="text-gray-500 font-bold " /> Prev
            </button>
          ) : (
            <button
              className="font-semibold px-3 py-1 text-sm bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded flex gap-2 items-center"
              onClick={handlePreviousPage}
            >
              <MoveLeft size={16} className="text-white font-bold" /> Prev
            </button>
          )}

          {currentPage == totalPage ? (
            <button
              disabled
              className="btn border-none flex items-center gap-2 bg-white text-gray-500 hover:bg-white hover:text-gray-500 text-base font-bold"
              onClick={handleNextPage}
            >
              Next <MoveRight size={16} className=" text-gray-500 font-bold" />
            </button>
          ) : (
            <button
              className="font-semibold px-3 py-1 text-sm bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded flex gap-2 items-center"
              onClick={handleNextPage}
            >
              Next <MoveRight size={16} className=" text-white font-bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;