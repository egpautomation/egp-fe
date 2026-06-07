// @ts-nocheck

import { config } from "@/lib/config";
import useSingleData from "@/hooks/useSingleData";
import { formatDate } from "@/lib/formateDate";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { SquarePen, PlusCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompnayMigrationRow({ item, idx, setReload, onTransfer }) {
  return (
    <tr className={`border ${idx % 2 == 1 && "bg-gray-100"}`}>
      <td className="px-4 py-2">{item?.user}</td>
      <td className="px-4 py-2">{item?.egpEmail}</td>
      <td className="px-4 py-2">{item?.companyName}</td>
      <td className="px-4 py-2">{formatDate(item?.updatedAt, "dd-MM-yyyy")}</td>
      <td className="px-4 py-2">
        <span
          className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${
            item?.status === "active"
              ? "bg-green-100 text-green-700"
              : item?.status === "inactive"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {item?.status || "Not Registered"}
        </span>
      </td>
      <td className="px-4 py-2 text-sm text-gray-600 font-medium">
        {item?.remarks || "N/A"}
      </td>

      <td className="px-4 py-2 flex items-center justify-center gap-3">
        {item?.status === "active" ? (
          <Button
            disabled
            variant="ghost"
            className="text-green-600 hover:text-green-600 hover:bg-transparent h-9 w-9 p-0 cursor-not-allowed"
            title="Already listed on EGP"
          >
            <CheckCircle size={20} />
          </Button>
        ) : (
          <Button
            onClick={() => onTransfer(item)}
            variant="ghost"
            className="text-emerald-600 hover:text-white hover:bg-emerald-600 h-9 w-9 p-0 rounded-full transition-all cursor-pointer"
            title="Add to EGP Listed Company"
          >
            <PlusCircle size={20} />
          </Button>
        )}
        <Link to={`/dashboard/edit-company-registration/${item?._id}`}>
          <SquarePen size={20} className="text-blue-600 mt-1 hover:text-blue-800 transition-colors" />
        </Link>
        <DeleteDataModal
          setReload={setReload}
          url={`${config.apiBaseUrl}/companyMigration/${item?._id}`}
        />
      </td>
    </tr>
  );
}
