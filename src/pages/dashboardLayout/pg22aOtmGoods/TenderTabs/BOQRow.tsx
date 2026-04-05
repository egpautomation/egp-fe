import SimilarRatesModal from "@/components/dashboard/SOR/SimilarRatesModal";
import { BOQItem } from "./BOQTab";
import { useState } from "react";
import { Trash } from "lucide-react";

export default function BOQRow({
  item,
  tableId,
  onDelete,
}: {
  item: BOQItem;
  tableId: string;
  onDelete: (tableId: string, itemId: string) => void;
}) {
  const [unitPrice, setUnitPrice] = useState(item.unitPrice);

  

  return (
    <tr key={item._id} className="hover:bg-gray-50">
      <td className="px-4 py-2">{item.itemNo}</td>
      <td className="px-4 py-2">
        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
          {item.group}
        </span>
      </td>
      <td className="px-4 py-2 font-mono text-xs">{item.itemCode}</td>
      <td className="px-4 py-2">
        <div className="font-medium">{item.descriptionOfItem}</div>
        <div className="text-xs text-gray-400">{item.requiredDocument}</div>
      </td>

      <td className="px-4 py-2">{item.unit}</td>
      <td className="px-4 py-2 text-right">{item.quantity}</td>
      <td className="px-4 py-2 text-right">{unitPrice}</td>
      <td className="px-4 py-2 text-right">{Math.max(2, item?.quantity * unitPrice)}</td>
      <td className="px-4 py-2 text-right">
        <SimilarRatesModal setUnitPrice={setUnitPrice} />
      </td>
      <td className="px-4 py-2 text-right">
       <Trash
    size={16}
    className="text-red-600 cursor-pointer"
    onClick={() => onDelete(tableId, item._id)}
  />
      </td>
    </tr>
  );
}
