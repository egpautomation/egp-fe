import SimilarRatesModal from "@/components/dashboard/SOR/SimilarRatesModal";
import { BOQItem } from "./BOQTab";
import { useState } from "react";
import { Trash } from "lucide-react";

export default function BOQRow({
  item,
  tableId,
  onDelete,
  onUpdate,
}: {
  item: BOQItem;
  tableId: string;
  onDelete: (tableId: string, itemId: string) => void;
  onUpdate: (tableId: string, itemId: string, field: "quantity" | "unitPrice", value: number) => void;
}) {
  const [unitPrice, setUnitPrice] = useState(item.unitPrice);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleUnitPriceChange = (val: number) => {
    setUnitPrice(val);
    onUpdate(tableId, item._id, "unitPrice", val);
  };

  const handleQuantityChange = (val: number) => {
    setQuantity(val);
    onUpdate(tableId, item._id, "quantity", val);
  };

  const handleSimilarRateSelect = (val: number) => {
    setUnitPrice(val);
    onUpdate(tableId, item._id, "unitPrice", val);
  };

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
      <td className="px-4 py-2 text-right">
        <input
          type="number"
          value={quantity}
          min={0}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
          className="w-24 border border-gray-300 rounded px-2 py-1 text-right text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </td>
      <td className="px-4 py-2 text-right">
        <input
          type="number"
          value={unitPrice}
          min={0}
          onChange={(e) => handleUnitPriceChange(Number(e.target.value))}
          className="w-28 border border-gray-300 rounded px-2 py-1 text-right text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </td>
      <td className="px-4 py-2 text-right">{(quantity * unitPrice).toLocaleString()}</td>
      <td className="px-4 py-2 text-right">
        <SimilarRatesModal setUnitPrice={handleSimilarRateSelect} itemCode={item.itemCode} />
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
