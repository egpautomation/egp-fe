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
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import config from "@/lib/config";


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
  const { data, loading, setReload }: { data: BOQData[]; loading: boolean; setReload: Function } =
    useAllTenderIDBOQ(tenderId);

  const { data: tenderPreparationData, setReload: setTenderPreparationReload }: { data: BOQData[];  setReload: Function } =
    useAllTenderIdTenderPreparation(tenderId);

  const setAllReload = () => {
    setReload((prev: number) => prev + 1);
    setTenderPreparationReload((prev: number) => prev + 1);
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
                          <thead className="bg-green-200/80 text-xs uppercase text-gray-600">
                            <tr>
                              <th className="px-4 py-2 border-b" colSpan={10}>
                                <div>
                                  <CreateNewBoqRow />
                                </div>
                              </th>
                              
                            </tr>
                          </thead>
                          <thead className="bg-green-50 text-xs uppercase text-gray-600">
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
                             <BOQRow item={item} key={item?._id} />
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
        {
          (!tenderPreparationData || tenderPreparationData.length === 0) ? <div> <h1 className="text-base font-normal mt-2">No tender preparation data available</h1></div> : <div className="flex flex-col gap-8 p-4">
          {tenderPreparationData?.map((table) => (
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
                    <div className="w-max bg-gray-200/85 pr-1.5 pt-0.5 rounded-sm">
                      <DeleteDataModal setReload={setAllReload}  url={`${config.apiBaseUrl}/tender-preparation/delete-tender-preparation/${table?._id}`} />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  
                  <div className="border rounded-lg overflow-hidden shadow-sm">
                   
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
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
        }
      </div>
    </div>
  );
}
