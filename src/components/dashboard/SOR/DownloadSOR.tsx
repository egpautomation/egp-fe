import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// ✅ Type Definition
type SOR = {
  departmentShortName?: string;
  yearOfRate?: number;
  category?: string;
  subCategory?: string;
  subSubCategory?: string;
  group_name?: string;
  itemCode?: string;
  description?: string;
  unit?: string;
  sourceOfRate?: string;
  reference?: string;
  attachment?: string;
  rate_1?: number;
  rate_2?: number;
  rate_3?: number;
  rate_4?: number;
  rate_5?: number;
  rate_6?: number;
};

const SOR_FIELD_LABELS: Record<keyof SOR, string> = {
  departmentShortName: "Department Name",
  yearOfRate: "Year of Rate",
  category: "Category",
  subCategory: "Sub Category",
  subSubCategory: "Sub Sub Category",
  group_name: "Group Name",
  itemCode: "Item Code",
  description: "Description",
  unit: "Unit",
  sourceOfRate: "Source of Rate",
  reference: "Reference",
  attachment: "Attachment",
  rate_1: "Rate 1",
  rate_2: "Rate 2",
  rate_3: "Rate 3",
  rate_4: "Rate 4",
  rate_5: "Rate 5",
  rate_6: "Rate 6",
};

export default function DownloadSOR({ sors }: { sors: SOR[] }) {
  // ✅ Clean Data (remove unwanted fields)
  const cleanSORData = (data: SOR[]): SOR[] => {
    return data.map((item) => {
      const cleaned = {} as SOR;

      (Object.keys(SOR_FIELD_LABELS) as (keyof SOR)[]).forEach((key) => {
        cleaned[key] = item[key];
      });

      return cleaned;
    });
  };

  const downloadCSV = (data: SOR[], filename = "SOR_List.csv") => {
    if (!data || data.length === 0) return;

    const cleanedData = cleanSORData(data);

    const headers = Object.keys(SOR_FIELD_LABELS) as (keyof SOR)[];
    const headerLabels = Object.values(SOR_FIELD_LABELS);

    const csvRows = [
      headerLabels.join(","), // professional headers
      ...cleanedData.map((row) =>
        headers
          .map((field) => {
            let value = row[field] ?? "";
            // Replace newlines with space
            value = String(value).replace(/\r?\n|\r/g, " ");
            // Escape double quotes
            value = value.replace(/"/g, '""');
            return `"${value}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    downloadCSV(sors);
  };

  return (
    <div className="flex justify-end">
      <Button className="bg-green-700" onClick={handleDownloadCSV} disabled={!sors?.length}>
        <Download /> Download CSV
      </Button>
    </div>
  );
}
