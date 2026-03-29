// @ts-nocheck

import { config } from "@/lib/config";
import useSingleData from "@/hooks/useSingleData";
import { formatDate } from "@/lib/formateDate";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { Eye, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";

export default function CompnayMigrationRow({ item, idx, setReload }) {
  return (
    <tr className={`border ${idx % 2 == 1 && "bg-gray-100"}`}>
      <td className="px-4 py-2">{item?.user}</td>
      <td className="px-4 py-2">{item?.egpEmail}</td>
      <td className="px-4 py-2">{item?.companyName}</td>
      <td className="px-4 py-2">{formatDate(item?.updatedAt, "dd-MM-yyyy")}</td>
      <td className="px-4 py-2">Coming soon...</td>
      <td className={`px-4 py-2 `}>
        <span
          className={`inline-block  px-2 rounded ${item?.status == "active" && "bg-green-700 text-white"} ${item?.status == "inactive" && "bg-red-700 text-white"}  ${item?.status == "inactive" && "bg-gray-700 text-white"}`}
        >
          {item?.status || "Not Registered"}{" "}
        </span>
      </td>

      <td className="px-4 py-2 flex items-center justify-center ">
        <Link to={`/dashboard/edit-company-registration/${item?._id}`}>
          <SquarePen className="mr-2 mt-2" size={24} />
        </Link>
        <DeleteDataModal
          setReload={setReload}
          url={`${config.apiBaseUrl}/companyMigration/${item?._id}`}
        />
      </td>
    </tr>
  );
}
