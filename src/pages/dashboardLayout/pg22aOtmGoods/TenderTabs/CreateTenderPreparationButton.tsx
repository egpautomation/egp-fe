import { Button } from "@/components/ui/button";
import config from "@/lib/config";
import { createData } from "@/lib/createData";

export default function CreateTenderPreparationButton({ data }: { data: any }) {
  const handleCreateTenderPreparation = () => {
    
    const url = `${config.apiBaseUrl}/tender-preparation/create-tender-preparation`;
    createData(url, data, null, null);
  };
  return (
    <Button className="text-sm" onClick={handleCreateTenderPreparation}>
      Create Tender Preparation
    </Button>
  );
}
