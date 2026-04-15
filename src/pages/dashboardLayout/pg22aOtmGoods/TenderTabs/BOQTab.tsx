import useAllTenderIDBOQ from "@/hooks/useBoqByTenderId";
import CreateTenderPreparationButton from "./CreateTenderPreparationButton";
import useAllTenderIdTenderPreparation from "@/hooks/useTenderIdTenderPreparation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreateNewBoqRow } from "@/components/dashboard/SOR/CreateNewBoqRow";
import BOQRow from "./BOQRow";
import config from "@/lib/config";
import { useEffect, useState } from "react";
import UpdateTenderPreparation from "./UpdateTenderPreparation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

export interface BOQItem {
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
  procurementNature,
}: {
  tenderId: string;
  egpEmail: string;
  procurementMethod: string;
  procurementNature: string;
}) {
  const [updatedTenderPreparationData, setUpdatedTenderPreparationData] = useState<BOQData[]>([]);
  const { data, loading, setReload }: { data: BOQData[]; loading: boolean; setReload: Function } =
    useAllTenderIDBOQ(tenderId);

  const {
    data: tenderPreparationData,
    setReload: setTenderPreparationReload,
  }: { data: BOQData[]; setReload: Function } = useAllTenderIdTenderPreparation(tenderId);

  const setAllReload = () => {
    setReload((prev: number) => prev + 1);
    setTenderPreparationReload((prev: number) => prev + 1);
  };
  const addBOQItem = (tableId: string, newItem: BOQItem) => {
  setUpdatedTenderPreparationData((prev) =>
    prev.map((table) =>
      table._id === tableId
        ? {
            ...table,
            items: [...table.items, newItem],
          }
        : table
    )
  );
};
const deleteBOQItem = (tableId: string, itemId: string) => {
  setUpdatedTenderPreparationData((prev) =>
    prev.map((table) =>
      table._id === tableId
        ? {
            ...table,
            items: table.items.filter((item) => item._id !== itemId),
          }
        : table
    )
  );
};
  useEffect(() => {
  if (tenderPreparationData) {
    setUpdatedTenderPreparationData(tenderPreparationData);
  }
}, [tenderPreparationData]);

  const handleDeleteTable = async (tableId: string) => {
    const toastId = toast.loading("Deleting table...");
    try {
      await axiosInstance.delete(
        `${config.apiBaseUrl}/tender-preparation/delete-tender-preparation/${tableId}`,
      );
      toast.dismiss(toastId);
      toast.success("Table deleted");
      setAllReload();
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error?.message || "Failed to delete table");
    }
  };

  const handleClearBOQItems = async (tableId: string) => {
    const toastId = toast.loading("Clearing BOQ items...");
    try {
      await axiosInstance.patch(
        `${config.apiBaseUrl}/tender-preparation/clear-boq-items/${tableId}`,
      );
      toast.dismiss(toastId);
      toast.success("BOQ items cleared");
      setAllReload();
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error?.message || "Failed to clear BOQ items");
    }
  };

  if (loading) return <div className="p-4">Loading BOQ Data...</div>;
  // if (!data || data.length === 0) return <div className="p-4">No BOQ data found.</div>;

  return (
    <div>
      <div className="flex flex-col gap-8 ">
        {!data || data.length === 0 ? (
          <div className="p-4">No BOQ data found.</div>
        ) : (
          <div>
            {data?.map((table) => (
              <Accordion
                key={table._id}
                type="single"
                collapsible
                defaultValue="shipping"
                className="max-w-full mb-5"
              >
                <AccordionItem value={table?._id}>
                  <AccordionTrigger className=" bg-teal-600 text-white mb-4 px-2">
                    {" "}
                    <h2 className="text-lg font-bold capitalize ">
                      {table.tableName.replace("_", " ")}
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 ">
                    <div className="border rounded-lg overflow-hidden shadow-sm ">
                      {/* Table Header / Group Name */}

                      {/* Items Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          
                          
                           <thead className="bg-green-100 text-xs uppercase text-gray-600">
                            <tr>
                              <th className="px-4 py-2 border-b">Item no.</th>
                              <th className="px-4 py-2 border-b">Group</th>
                              <th className="px-4 py-2 border-b">Item Code</th>
                              <th className="px-4 py-2 border-b">Description of Item</th>

                              <th className="px-4 py-2 border-b">
                                Measurement <br /> Unit
                              </th>
                              <th className="px-4 py-2 border-b text-right">Quantity</th>
                              <th className="px-4 py-2 border-b text-right">
                                Unit Price
                                <br />
                                In figures (BDT)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y">
                           {table.items.map((item) => (
                              <tr key={item?._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{item?.itemNo}</td>
                                <td className="px-4 py-2">
                                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                                    {item?.group}
                                  </span>
                                </td>
                                <td className="px-4 py-2 font-mono text-xs">{item?.itemCode}</td>
                                <td className="px-4 py-2">
                                  <div className="font-medium">{item?.descriptionOfItem}</div>
                                  <div className="text-xs text-gray-400">
                                    {item?.requiredDocument}
                                  </div>
                                </td>

                                <td className="px-4 py-2">{item?.unit}</td>
                                <td className="px-4 py-2 text-right">{item?.quantity}</td>
                                <td className="px-4 py-2 text-right">{item?.unitPrice}</td>
                              </tr>
                            ))}
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2   text-end" colSpan={10}>
                                <CreateTenderPreparationButton
                                  setReload={setAllReload}
                                  table={table}
                                  data={{
                                    ...table,
                                    tenderId,
                                    egpEmail,
                                    tenderType: `${procurementMethod} ${procurementNature}`,
                                  }}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        )}
      </div>
      <div className="mt-10">
        <h3 className="text-2xl font-bold">Tender Preparation</h3>
        {!tenderPreparationData || tenderPreparationData.length === 0 ? (
          <div>
            {" "}
            <h1 className="text-base font-normal mt-2">No tender preparation data available</h1>
          </div>
        ) : (
          <div className="flex flex-col gap-8 p-4">
            {updatedTenderPreparationData?.map((table) => (
              <Accordion
                key={table?._id}
                type="single"
                collapsible
                defaultValue="shipping"
                className="max-w-full"
              >
                <AccordionItem value={table?._id}>
                  <AccordionTrigger className="bg-cyan-700 text-white   mb-4 px-2">
                    {" "}
                    <div className="flex flex-wrap gap-3 justify-between  w-full">
                      <h2 className="text-lg font-bold capitalize">
                        {table?.tableName && table.tableName.replace("_", " ")}
                      </h2>
                      <div
                        className="flex items-center gap-1 bg-gray-200/85 pr-1.5 pt-0.5 rounded-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Clear items only */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <div
                              className="text-red-700 ml-2 cursor-pointer py-1 hover:text-red-800 transition-colors"
                              title="Clear BOQ Items"
                            >
                              <Trash2 size={20} />
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-xl">
                            <AlertDialogTitle></AlertDialogTitle>
                            <AlertDialogHeader>
                              <div className="max-h-[70vh] overflow-y-auto p-4 space-y-5 text-center text-gray-900">
                                <h3 className="text-2xl font-bold">Are you sure?</h3>
                                <h3 className="text-lg font-semibold">
                                  All BOQ items in this section will be removed.
                                  The tender preparation record itself will remain.
                                </h3>
                              </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={() => handleClearBOQItems(table?._id)}
                              >
                                Clear Items
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {/* Delete entire table */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <div
                              className="text-gray-700 ml-1 cursor-pointer py-1 hover:text-red-800 transition-colors"
                              title="Delete Table"
                            >
                              <X size={20} />
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-xl">
                            <AlertDialogTitle></AlertDialogTitle>
                            <AlertDialogHeader>
                              <div className="max-h-[70vh] overflow-y-auto p-4 space-y-5 text-center text-gray-900">
                                <h3 className="text-2xl font-bold">Delete Table?</h3>
                                <h3 className="text-lg font-semibold">
                                  This entire table will be permanently deleted.
                                </h3>
                              </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteTable(table?._id)}
                              >
                                Delete Table
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                         <thead className="bg-green-200/80 text-xs uppercase text-gray-600">
                            <tr>
                              <th className="px-4 py-2 border-b" colSpan={10}>
                                <div>
                                  <CreateNewBoqRow tableId={table._id} onAdd={addBOQItem}/>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <thead className="bg-green-100 text-xs uppercase text-gray-600">
                            <tr>
                              <th className="px-4 py-2 border-b">Item no.</th>
                              <th className="px-4 py-2 border-b">Group</th>
                              <th className="px-4 py-2 border-b">Item Code</th>
                              <th className="px-4 py-2 border-b">Description of Item</th>

                              <th className="px-4 py-2 border-b">
                                Measurement <br /> Unit
                              </th>
                              <th className="px-4 py-2 border-b text-right">Quantity</th>
                              <th className="px-4 py-2 border-b text-right">
                                Unit Price
                                <br />
                                In figures (BDT)
                              </th>
                              <th className="px-4 py-2 border-b text-right">Total Price</th>
                              <th className="px-4 py-2 border-b text-right">Search</th>
                              <th className="px-4 py-2 border-b text-right">Delete</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y">
                            {table.items.map((item) => (
                              <BOQRow item={item} key={item?._id} tableId={table._id}
      onDelete={deleteBOQItem} />
                            ))}
                             <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2   text-end" colSpan={10}>
                                <UpdateTenderPreparation
                                  setReload={setAllReload}
                                 tableData={table}
                                  data={updatedTenderPreparationData}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
