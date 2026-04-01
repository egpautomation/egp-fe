import useAllTenderIDBOQ from "@/hooks/useBoqByTenderId";
import CreateTenderPreparationButton from "./CreateTenderPreparationButton";

interface BOQItem {
  itemNo: number;
  group: string;
  itemCode: string;
  descriptionOfItem: string;
  measurement: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  requiredDocument: string;
  fileName: string;
  division_no: string;
  _id: string;
}

interface BOQData {
  _id: string;
  tenderId: number;
  tableName: string;
  items: BOQItem[];
}

export default function BOQTab({
  tenderId,
  egpEmail,
  procurementMethod,
  procurementNature
}: {
  tenderId: string;
  egpEmail: string;
  procurementMethod: string;
  procurementNature: string;
}) {
  const { data, loading }: { data: BOQData[]; loading: boolean } = useAllTenderIDBOQ(tenderId);

  if (loading) return <div className="p-4">Loading BOQ Data...</div>;
  if (!data || data.length === 0) return <div className="p-4">No BOQ data found.</div>;

  return (
    <div className="flex flex-col gap-8 p-4">
      {data.map((table) => (
        <div key={table._id} className="border rounded-lg overflow-hidden shadow-sm">
          {/* Table Header / Group Name */}
          <div className="bg-green-100   px-4 py-2 border-b">
            <h2 className="text-lg font-bold capitalize text-teal-600">
              {table.tableName.replace("_", " ")}
            </h2>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-2 border-b">No.</th>
                  <th className="px-4 py-2 border-b">Code</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Group</th>
                  <th className="px-4 py-2 border-b">Unit</th>
                  <th className="px-4 py-2 border-b text-right">Qty</th>
                  <th className="px-4 py-2 border-b text-right">Price</th>
                  <th className="px-4 py-2 border-b text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y">
                {table.items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{item.itemNo}</td>
                    <td className="px-4 py-2 font-mono text-xs">{item.itemCode}</td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{item.descriptionOfItem}</div>
                      <div className="text-xs text-gray-400">{item.requiredDocument}</div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                        {item.group}
                      </span>
                    </td>
                    <td className="px-4 py-2">{item.unit}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">{item.unitPrice}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      <CreateTenderPreparationButton
                        data={{ ...item, tenderId, egpEmail, tenderType: `${procurementMethod} ${procurementNature}` }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
