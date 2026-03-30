import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAllEgpListedCompanies from "@/hooks/useAllEgpListedCompany";
import { handleAuthorizationLetterDownload } from "@/utils/handleDownloadAuthorization";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Link } from "react-router-dom";
interface authorizationCardProps {
  tenderId: string;
  egpEmail: string;
  currentTender?: any;
}

export default function AuthorizationLetterCard({
  tenderId,
  egpEmail,
  currentTender,
}: authorizationCardProps) {
  const { egpListedCompanies } = useAllEgpListedCompanies(egpEmail || "Skip");
  const companyData = egpListedCompanies?.[0];
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <CardTitle>Letter Of Authorization</CardTitle>
            <CardDescription></CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <p>
              • Filtered Years: <span className="font-semibold">3</span>
            </p>
            <p>
              • Data Source: <span className="font-semibold">Saved Turnover Years</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleAuthorizationLetterDownload(companyData, currentTender)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              variant="default"
            >
              <FileDown className="w-4 h-4 mr-1.5" />
              Download PDF
            </Button>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              variant="default"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              <Link
                target="_blank"
                to={`/letter-of-authorization/${tenderId}?egpEmail=${egpEmail}`}
              >
                View{" "}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
