// @ts-nocheck
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { config } from "@/lib/config";

interface FullTenderUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenderId: string;
  tenderData: any;
  onSuccess: () => void;
}

const FIELD_GROUPS = {
  basicInfo: {
    label: "Basic Information",
    fields: [
      "procurementType",
      "procurementNature",
      "procurementMethod",
      "tenderStatus",
      "packageNo",
      "ProjectCode",
    ],
  },
  financialInfo: {
    label: "Financial Information",
    fields: [
      "estimatedCost",
      "documentPrice",
      "tenderSecurity",
      "turnoverAmount",
      "liquidAssets",
      "tenderCapacity",
    ],
  },
  location: {
    label: "Location Details",
    fields: [
      "locationDistrict",
      "Division",
      "Thana",
      "City",
      "workingLocation",
      "Address",
    ],
  },
  organization: {
    label: "Organization Details",
    fields: [
      "organization",
      "ministry",
      "department",
      "procuringEntityName",
      "procuringEntityCode",
    ],
  },
  project: {
    label: "Project Information",
    fields: [
      "ProjectName",
      "sourceOfFunds",
      "budgetType",
      "TentativeStartDate",
      "TentativeCompletionDate",
    ],
  },
  requirements: {
    label: "Requirements & Experience",
    fields: [
      "generalExperience",
      "typesOfSimilarNature",
      "yearofsimilarexperience",
      "similarNatureWork",
      "jvca",
      "LtmLicenseNameCode",
    ],
  },
  dates: {
    label: "Important Dates",
    fields: [
      "publicationDateTime",
      "documentLastSelling",
      "openingDateTime",
      "ActivitytotalDays",
    ],
  },
  description: {
    label: "Work Description & Criteria",
    fields: [
      "descriptionOfWorks",
      "qualityCriteria",
      "financialCriteria",
      "eligibilityOfTenderDocument",
      "tds",
    ],
  },
  official: {
    label: "Official Information",
    fields: [
      "officialDesignation",
      "NameofOfficialInviting",
      "InvitationReferenceNo",
      "development_partner",
    ],
  },
};

const FullTenderUpdateDialog = ({
  open,
  onOpenChange,
  tenderId,
  tenderData,
  onSuccess,
}: FullTenderUpdateDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with tender data
  useEffect(() => {
    if (open && tenderData) {
      const initialData = { ...tenderData };
      delete initialData._id;
      delete initialData.__v;
      delete initialData.createdAt;
      delete initialData.updatedAt;
      setFormData(initialData);
      setHasChanges(false);
      setError("");
    }
  }, [open, tenderData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value || null,
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Filter out unchanged values (compare with original)
      const changes: any = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== tenderData[key]) {
          changes[key] = formData[key];
        }
      });

      if (Object.keys(changes).length === 0) {
        toast.error("No changes to update");
        setLoading(false);
        return;
      }

      const url = `${config.apiBaseUrl}/tenders/${tenderId}`;
      const response = await axiosInstance.patch(url, changes);

      if (response.data.success) {
        toast.success("Tender updated successfully!");
        onOpenChange(false);
        onSuccess();
      } else {
        setError(response.data.message || "Failed to update tender");
        toast.error(response.data.message || "Failed to update tender");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update tender";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...tenderData });
    setHasChanges(false);
  };

  const renderFields = (fieldNames: string[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldNames.map((fieldName) => {
          const value = formData[fieldName] ?? "";
          const isLargeField = ["descriptionOfWorks", "similarNatureWork"].includes(fieldName);

          return (
            <div
              key={fieldName}
              className={isLargeField ? "md:col-span-2" : ""}
            >
              <Label className="text-sm font-medium capitalize">
                {fieldName.replace(/([A-Z])/g, " $1").trim()}
              </Label>
              {isLargeField ? (
                <Textarea
                  name={fieldName}
                  value={value}
                  onChange={handleChange}
                  placeholder={`Enter ${fieldName}`}
                  className="mt-1 min-h-24 resize-none"
                />
              ) : (
                <Input
                  type="text"
                  name={fieldName}
                  value={value}
                  onChange={handleChange}
                  placeholder={`Enter ${fieldName}`}
                  className="mt-1"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Update Tender #{tenderData?.tenderId}
          </DialogTitle>
          <DialogDescription>
            Modify tender details. Changes will be saved to the database.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-1 flex-wrap border-b">
            {Object.entries(FIELD_GROUPS).map(([key, group]: any) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {renderFields(FIELD_GROUPS[activeTab as keyof typeof FIELD_GROUPS].fields)}
          </div>

          {/* Footer */}
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || loading}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!hasChanges || loading}
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Updating..." : "Update Tender"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FullTenderUpdateDialog;
