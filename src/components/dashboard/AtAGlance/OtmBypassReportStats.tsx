// @ts-nocheck
import { AuthContext } from "@/provider/AuthProvider";
import { ChevronUp } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import useOtmBypassReportCount from "@/hooks/useOtmBypassReportCount";

const OtmBypassReportStats = () => {
  const { user } = useContext(AuthContext);
  const { data, loading } = useOtmBypassReportCount(user?.email, false);

  const statItems = [
    {
      title: "New Order",
      count: data?.new || 0,
      link: "/dashboard/otm-bypass-report?status=new",
    },
    {
      title: "Waiting",
      count: data?.waiting || 0,
      link: "/dashboard/otm-bypass-report?status=waiting",
    },
    {
      title: "Total Order",
      count: data?.total || 0,
      link: "/dashboard/otm-bypass-report",
    },
    {
      title: "Cancel",
      count: data?.cancel || 0,
      link: "/dashboard/otm-bypass-report?status=canceled",
    },
  ];

  return (
    <div className="my-10 md:my-16 shadow-xl bg-white">
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold text-gray-700">
          OTM Bypass Report Statistics
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`p-3 md:p-5 py-6 md:py-10 border-b ${
              index % 4 !== 0 ? "lg:border-l" : ""
            } ${index % 2 !== 0 ? "md:border-l lg:border-l-0" : ""}`}
          >
            <h3 className="md:text-xl font-semibold text-gray-600">
              {item.title}
            </h3>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-600 my-2">
              {loading ? "..." : item.count}
            </h1>
            <div>
              <p className="font-semibold text-sm md:text-base text-gray-500">
                {" "}
                Go To{" "}
                <Link
                  to={item.link}
                  className="text-blue-700 text-sm md:text-base"
                >
                  <ChevronUp className="inline-block" />
                  View More
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtmBypassReportStats;
