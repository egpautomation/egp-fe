// @ts-nocheck
import { Input } from "@/components/ui/input";

const TestPrintPdf = () => {
  const handleChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    console.log("formData", formData);
    // https://egpserver.jubairahmad.com/api/v1/files/upload

    const res = await fetch("https://egpserver.jubairahmad.com/api/v1/files/upload", {
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
