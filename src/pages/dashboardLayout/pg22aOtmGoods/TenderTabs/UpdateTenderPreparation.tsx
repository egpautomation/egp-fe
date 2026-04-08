import { Button } from "@/components/ui/button";
import config from "@/lib/config";
import { patchData } from "@/lib/updateData";
import { Send } from "lucide-react";


export default function UpdateTenderPreparation({setReload, data, tableData}: {setReload: Function, data: any, tableData: any}) {
    const handleUpdateTenderPreparation = () => {
    const { _id, ...rest } = tableData;

    const finalData = {
        ...rest,
        items: tableData.items.map(({ _id, ...item }) => item)
    };

    const url = `${config.apiBaseUrl}/tender-preparation/${tableData._id}`;
    patchData(url, finalData, setReload, null)
};
  return (
    <Button
      className="text-xs bg-teal-600 justify-self-end"
      onClick={handleUpdateTenderPreparation}

    >
      <Send /> Add To Tender Preparation
    </Button>
  )
}
