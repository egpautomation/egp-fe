import { Button } from "@/components/ui/button";
import config from "@/lib/config";
import { createData } from "@/lib/createData";
import { Send } from "lucide-react";

export default function CreateTenderPreparationButton({
  data,
  setReload,
}: {
  data: any;
  table: any;
  setReload: Function;
}) {
  const handleCreateTenderPreparation = () => {
    // 1. Destructure the unwanted fields and collect the rest into 'cleanData'
    const { __v, updatedAt, createdAt, _id, ...cleanData } = data;

    // 2. If you also need to clean the internal 'items' array of their MongoDB IDs:
    const finalData = {
      ...cleanData,
      items: cleanData.items?.map(({ _id, ...itemRest }: any) => itemRest),
    };

    const url = `${config.apiBaseUrl}/tender-preparation/create-tender-preparation`;

    // Uncomment to execute
    createData(url, finalData, setReload, null);
  };

  return (
    <Button
      className="text-xs bg-teal-600 justify-self-end"
      onClick={handleCreateTenderPreparation}
    >
      <Send /> Add To Tender Preparation
    </Button>
  );
}
