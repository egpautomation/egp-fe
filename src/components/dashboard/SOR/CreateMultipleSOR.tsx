// @ts-nocheck
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { FileJson, Upload, X, ChevronDown, ChevronUp, Info, RefreshCw } from "lucide-react";
import config from "@/lib/config";

export default function SORJsonImport({
  setReload,
  isJSONImportOpen,
}: {
  setReload: () => void;
  isJSONImportOpen: boolean;
}) {
  const fileRef = useRef(null);

  const [parsed, setParsed] = useState([]);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  /* ───────────── Handle File Upload ───────────── */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target.result);

        // support both [] and { data: [] }
        const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);

        //  Step 1: Remove invalid itemCode
        const validData = arr.filter((item) => item?.itemCode);

        //  Step 2: Remove duplicates (based on itemCode)
        const uniqueMap = new Map();
        validData.forEach((item) => {
          const code = item.itemCode.trim();
          if (!uniqueMap.has(code)) {
            uniqueMap.set(code, { ...item, itemCode: code });
          }
        });

        const uniqueData = Array.from(uniqueMap.values());

        const removedInvalid = arr.length - validData.length;
        const removedDuplicate = validData.length - uniqueData.length;

        if (removedInvalid > 0) {
          toast.error(`${removedInvalid} records removed (missing itemCode) `);
        }

        setParsed(uniqueData);
        toast.success(
          `${uniqueData.length} valid records ready \n ${removedDuplicate && `${removedDuplicate} duplicates removed`}`
        );
      } catch {
        toast.error("Invalid JSON file");
        setParsed([]);
      }
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  /* ───────────── Import Function ───────────── */
  const handleImport = async () => {
    if (!parsed?.length) return;

    setLoading(true);
    const toastId = toast.loading(`Importing ${parsed.length} SOR items...`);

    try {
      const res = await axiosInstance.post(`${config.apiBaseUrl}/sor/create-sor`, parsed);
      setReload((prev) => prev + 1);
      toast.dismiss(toastId);

      toast.success("SOR data imported successfully ✅");

      setParsed([]);
      setFilename("");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err?.response?.data?.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setParsed([]);
    setFilename("");
  };

  /* ───────────── UI ───────────── */
  return (
    <div>
      {isJSONImportOpen && (
        <div className="rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/60 p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <FileJson size={20} className="text-indigo-600" />
            <span className="font-semibold text-indigo-700 text-sm">SOR JSON Import</span>
          </div>

          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFile}
            />

            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-100 transition rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
            >
              <Upload size={15} />
              {filename || "Choose JSON file"}
            </button>

            {parsed?.length > 0 && (
              <>
                <span className="text-xs text-gray-600">
                  <strong className="text-indigo-700">{parsed.length}</strong> items ready
                </span>

                <button
                  onClick={() => setPreview((p) => !p)}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                >
                  Preview {preview ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                <Button
                  onClick={handleImport}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-lg shadow-sm"
                >
                  {loading ? (
                    <RefreshCw size={14} className="animate-spin mr-1 inline" />
                  ) : (
                    <Upload size={14} className="mr-1 inline" />
                  )}
                  Import
                </Button>

                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-red-500 transition"
                  title="Clear"
                >
                  <X size={16} />
                </button>
              </>
            )}
          </div>

          {/* Preview Table */}
          {preview && parsed?.length > 0 && (
            <div className="mt-4 overflow-x-auto max-h-56 rounded-lg border border-indigo-200 bg-white">
              <table className="text-xs w-full">
                <thead className="bg-indigo-100 text-indigo-700 sticky top-0">
                  <tr>
                    {Object.keys(parsed[0]).map((k) => (
                      <th key={k} className="px-3 py-1.5 text-left whitespace-nowrap">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {parsed.slice(0, 10).map((row, i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-3 py-1.5 whitespace-nowrap text-gray-700">
                          {String(v ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {parsed.length > 10 && (
                <p className="text-center text-xs text-gray-400 py-1">
                  + {parsed.length - 10} more items
                </p>
              )}
            </div>
          )}

          {/* Hint */}
          {!parsed?.length && (
            <p className="mt-3 text-xs text-gray-500 flex items-center gap-1">
              <Info size={12} />
              Supports JSON array or{" "}
              <code className="bg-gray-100 px-1 rounded">{'{ "data": [...] }'}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
