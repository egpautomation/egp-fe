// @ts-nocheck
import { config } from "@/lib/config";
import { Input } from "@/components/ui/input";

const TestPrintPdf = () => {
  const handleChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    console.log("formData", formData);
    const res = await fetch(`${config.apiBaseUrl}/files/upload`, {
      method: "POST",
      body: formData,
      mode: "cors"
    });

    const result = await res.json()

  };

  return (
    <div className="p-5">
      <Input
        onChange={handleChange}
        className="max-w-xs"
        type="file"
        placeholder="enter file"
      />
    </div>
  );
};

export default TestPrintPdf;
