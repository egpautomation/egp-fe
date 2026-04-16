import { Button } from "@/components/ui/button";
import config from "@/lib/config";
import { patchData } from "@/lib/updateData";
import { Save } from "lucide-react";


export default function UpdateTenderPreparation({setReload, tableData, data: _data}: {setReload: Function, tableData: any, data?: any}) {
    const handleUpdateTenderPreparation = () => {
    const { _id, ...rest } = tableData;

    const finalData = {
        ...rest,
        items: tableData.items.map(({ _id: _itemId, ...item }: any) => item)
    };

    const url = `${config.apiBaseUrl}/tender-preparation/${tableData._id}`;
    patchData(url, finalData, setReload, null)
};
  return (
    <Button
      className="text-xs bg-teal-600 justify-self-end"
      onClick={handleUpdateTenderPreparation}

    >
      <Save /> Save Table
    </Button>
  )
}
