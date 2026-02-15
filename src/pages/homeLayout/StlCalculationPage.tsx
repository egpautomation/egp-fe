import { STLCalculationTab } from "@/pages/dashboardLayout/pg22aOtmGoods/TenderTabs/STLCalculationTab";

export default function StlCalculationPage() {
    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <div className="mb-8 text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    STL Calculation Tool
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Calculate significantly low-priced tenders and identify winning bids according to PPR 2025 guidelines.
                </p>
            </div>
            <STLCalculationTab />
        </div>
    );
}
