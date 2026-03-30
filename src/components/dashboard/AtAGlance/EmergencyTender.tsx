// @ts-nocheck

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const EmergencyTender = () => {
  return (
    <div className="my-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
        <div className="grid border grid-cols-1 md:grid-cols-2 gap-10 p-3 md:p-5 shadow-xl rounded  text-gray-600 font-semibold">
          <div>
            <p className=" text-sm md:text-base">Emergency Tender Dropping Now</p>
          </div>
          <div className="">
            <Link className="text-sm md:text-base w-max text-blue-700">
              <span className=" ">
                Request For Urgent / Dedicated Server <ChevronRight className="inline-block" />
              </span>
            </Link>
          </div>
        </div>
        <div className="grid border grid-cols-1 md:grid-cols-2 gap-10 p-3 md:p-5 shadow-xl rounded  text-gray-600 font-semibold">
          <div>
            <p className=" text-sm md:text-base">Need Support</p>
          </div>
          <div className="">
            <Link className="text-sm md:text-base w-max text-blue-700">
              <span className=" ">
                Request For Call
                <ChevronRight className="inline-block" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyTender;
