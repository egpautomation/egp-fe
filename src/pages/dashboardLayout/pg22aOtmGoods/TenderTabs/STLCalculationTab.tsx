import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Upload, FileText, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-hot-toast';

// TypeScript interfaces matching backend contract
interface Bidder {
    name: string;
    price: string;
    qualified: boolean;
}

interface ParsePdfResponse {
    success: boolean;
    message: string;
    data?: {
        bidders: { name: string; price: string }[];
        totalBidders: number;
        storedDataId: string;
    };
}

interface CalculationResults {
    xi: string;
    x_nppi: string;
    wa: string;
    sd: string;
    slt: string;
    winner: string;
    winnerPrice: number | 'None';
}

export const STLCalculationTab = () => {
    const [xoce, setXoce] = useState('100');
    const [priceIndex, setPriceIndex] = useState('0.9168');
    const [bidders, setBidders] = useState<Bidder[]>([
        { name: 'Hassan Techno Builders Ltd.', price: '75', qualified: true },

    ]);
    const [results, setResults] = useState<CalculationResults | { error: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const addBidder = () => {
        setBidders([...bidders, { name: '', price: '', qualified: true }]);
    };

    const removeBidder = (index: number) => {
        if (bidders.length > 1) {
            setBidders(bidders.filter((_, i) => i !== index));
        }
    };

    const updateBidder = (index: number, field: keyof Bidder, value: any) => {
        const updated = [...bidders];
        updated[index] = { ...updated[index], [field]: value };
        setBidders(updated);
    };

    // Handle PDF file upload and extract bidder data
    const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file only');
            return;
        }

        // Validate file size (max 10MB - matches backend limit)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size should be less than 10MB');
            return;
        }

        setIsUploading(true);
        setUploadedFileName(file.name);

        try {
            // Create FormData: backend requires "pdf" (file). pdfFilename is sent in query + form + header so backend can read it.
            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('pdfFilename', file.name);

            const url = `/stl/parse-pdf?pdfFilename=${encodeURIComponent(file.name)}`;
            const response = await axiosInstance.post<ParsePdfResponse>(url, formData, {
                headers: {
                    'X-PDF-Filename': file.name,
                },
            });

            // Check response.success before accessing response.data
            if (response.data?.success && response.data?.data?.bidders) {
                const extractedBidders = response.data.data.bidders;

                // Update bidders state with extracted data
                // Backend returns: { name: "Company Name", price: "7534639.524" }
                if (extractedBidders.length > 0) {
                    // Format bidders to match our state structure
                    const formattedBidders = extractedBidders.map((bidder) => ({
                        name: bidder.name || '',
                        price: bidder.price ? String(bidder.price) : '',
                        qualified: true
                    }));
                    setBidders(formattedBidders);
                    toast.success(`Successfully extracted ${response.data.data.totalBidders} bidder(s) from PDF`);
                } else {
                    toast('No bidder data found in PDF. Please check the PDF format.', { icon: '⚠️' });
                }
            } else {
                // Handle backend error messages
                toast.error(response.data?.message || 'Failed to extract data from PDF');
            }
        } catch (error: any) {
            const data = error.response?.data;
            // Log full response to see exact backend error (e.g. validation message)
            console.error('PDF upload error:', error.response?.status, data);

            const errorMessage =
                (typeof data?.message === 'string' && data.message) ||
                (typeof data?.error === 'string' && data.error) ||
                (typeof data?.msg === 'string' && data.msg) ||
                (Array.isArray(data?.errors) && data.errors[0]?.msg && data.errors.map((e: { msg?: string }) => e.msg).join(', ')) ||
                (data?.message && typeof data.message === 'object' && String(data.message)) ||
                'Error processing PDF';

            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(errorMessage);
                } else if (error.response.status === 500) {
                    toast.error(errorMessage);
                } else {
                    toast.error(errorMessage);
                }
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('Error processing PDF. Please try again.');
            }
        } finally {
            setIsUploading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    const handleCalculate = () => {
        const xoceValue = parseFloat(xoce) || 100;
        const priceIndexValue = parseFloat(priceIndex) || 0.9168;
        const x_nppi = xoceValue * priceIndexValue;

        // Get all valid bid prices FROM QUALIFIED BIDDERS ONLY ??
        // For now, keeping original logic but filter if user requested filtering. 
        // User said "qualied oita check box hbe", usually means only qualified are considered.
        // I will filter by qualified.
        const prices: number[] = [];
        bidders.forEach(bidder => {
            if (bidder.qualified) {
                const price = parseFloat(bidder.price);
                if (!isNaN(price)) {
                    prices.push(price);
                }
            }
        });

        if (prices.length === 0) {
            setResults({ error: 'No valid qualified bids entered.' });
            return;
        }

        const n = prices.length;
        const total = prices.reduce((sum, p) => sum + p, 0);
        const xi = total / n;

        // Calculate Weighted Average: WA = (XOCE * 0.2) + (Xi * 0.5) + (X_NPPI * 0.3)
        const wa = (xoceValue * 0.2) + (xi * 0.5) + (x_nppi * 0.3);

        // Calculate variance and Standard Deviation
        const variance = prices.reduce((sum, p) => sum + Math.pow(p - xi, 2), 0) / n;
        const sd = Math.sqrt(variance);

        // Calculate SLT (Significantly Low-Priced Tender)
        const slt = wa - sd;

        // Find winner: lowest bid >= SLT
        const eligibleBids = prices
            .map((price, index) => ({ price, index }))
            .filter(item => item.price >= slt)
            .sort((a, b) => a.price - b.price);

        // Map back to original bidder name (finding the qualified bidder with that price)
        // Since we filtered prices, we need to find which bidder has this price
        const winnerBid = eligibleBids.length > 0 ? eligibleBids[0] : null;

        let winnerName = 'None';
        let winnerPrice: number | 'None' = 'None';

        if (winnerBid) {
            // Find the bidder with this price who is qualified
            const winningBidder = bidders.find(b => b.qualified && parseFloat(b.price) === winnerBid.price);
            if (winningBidder) {
                winnerName = winningBidder.name;
                winnerPrice = winnerBid.price;
            }
        }

        setResults({
            xi: xi.toFixed(4),
            x_nppi: x_nppi.toFixed(4),
            wa: wa.toFixed(4),
            sd: sd.toFixed(4),
            slt: slt.toFixed(4),
            winner: winnerName,
            winnerPrice: winnerPrice
        });
    };

    // Helper to calculate difference percentage
    const calculateDifference = (priceStr: string) => {
        const price = parseFloat(priceStr);
        const xoceVal = parseFloat(xoce);
        if (isNaN(price) || isNaN(xoceVal) || xoceVal === 0) return '-';
        const diff = ((price - xoceVal) / xoceVal) * 100;
        return diff.toFixed(2) + '%';
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        PPR 2025 Tender Calculation Sheet
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* Input Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* XOCE Input */}
                        <div className="space-y-2">
                            <Label htmlFor="xoce" className="text-sm font-semibold text-gray-700">
                                Official Approved Cost Estimate (XOCE):
                            </Label>
                            <Input
                                id="xoce"
                                type="number"
                                step="0.01"
                                value={xoce}
                                onChange={(e) => setXoce(e.target.value)}
                                className="text-lg font-medium"
                                placeholder="Enter XOCE"
                            />
                        </div>

                        {/* Price Index Input */}
                        <div className="space-y-2">
                            <Label htmlFor="priceIndex" className="text-sm font-semibold text-gray-700">
                                Price Index (e.g., 0.9168):
                            </Label>
                            <Input
                                id="priceIndex"
                                type="number"
                                step="0.0001"
                                value={priceIndex}
                                onChange={(e) => setPriceIndex(e.target.value)}
                                className="text-lg font-medium"
                                placeholder="Enter Price Index"
                            />
                        </div>
                    </div>

                    {/* PDF Upload Section */}
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    Upload PDF to Extract Bidder Data
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Upload a PDF file containing bidder names and prices. The system will automatically extract and populate the data.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label
                                htmlFor="pdf-upload"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload PDF
                                    </>
                                )}
                            </Label>
                            <Input
                                id="pdf-upload"
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handlePdfUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                            {uploadedFileName && !isUploading && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileText className="w-4 h-4" />
                                    <span>{uploadedFileName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bidders Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">Bidders and Tender Prices</h3>
                            <Button
                                onClick={addBidder}
                                className="flex items-center gap-2"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4" />
                                Add Bidder
                            </Button>
                        </div>

                        {/* Bidders Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 border-b">
                                <div className="grid grid-cols-12 gap-4 p-3 font-semibold text-gray-700 text-sm">
                                    <div className="col-span-4">Bidder Name</div>
                                    <div className="col-span-3">Tender Price</div>
                                    <div className="col-span-2 text-center">Difference %</div>
                                    <div className="col-span-2 text-center">Qualified</div>
                                    <div className="col-span-1 text-center">Action</div>
                                </div>
                            </div>

                            <div className="divide-y">
                                {bidders.map((bidder, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 p-3 hover:bg-gray-50 transition-colors items-center">
                                        <div className="col-span-4">
                                            <Input
                                                value={bidder.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBidder(index, 'name', e.target.value)}
                                                placeholder="Enter bidder name"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={bidder.price}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBidder(index, 'price', e.target.value)}
                                                placeholder="Enter price"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="col-span-2 text-center font-medium text-gray-600">
                                            {calculateDifference(bidder.price)}
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <Checkbox
                                                checked={bidder.qualified}
                                                onCheckedChange={(checked) => updateBidder(index, 'qualified', checked)}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <Button
                                                onClick={() => removeBidder(index)}
                                                variant="destructive"
                                                size="icon"
                                                disabled={bidders.length === 1}
                                                className="h-9 w-9"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={handleCalculate}
                            size="lg"
                            className="px-12 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                        >
                            Calculate
                        </Button>
                    </div>

                    {/* Results Section */}
                    {results && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Calculation Results</h3>
                            {'error' in results ? (
                                <p className="text-red-600">{results.error}</p>
                            ) : (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded border">
                                            <p className="text-sm text-gray-600 mb-1">Average Price (Xi):</p>
                                            <p className="text-lg font-semibold text-gray-800">{results.xi}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded border">
                                            <p className="text-sm text-gray-600 mb-1">XNPPI:</p>
                                            <p className="text-lg font-semibold text-gray-800">{results.x_nppi}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded border">
                                            <p className="text-sm text-gray-600 mb-1">Weighted Average (WA):</p>
                                            <p className="text-lg font-semibold text-gray-800">{results.wa}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded border">
                                            <p className="text-sm text-gray-600 mb-1">Standard Deviation (SD):</p>
                                            <p className="text-lg font-semibold text-gray-800">{results.sd}</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                        <p className="text-sm text-gray-600 mb-1">Significantly Low-Priced Tender (SLT):</p>
                                        <p className="text-2xl font-bold text-blue-700">{results.slt}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded border border-green-200">
                                        <p className="text-sm text-gray-600 mb-1">Winner:</p>
                                        <p className="text-xl font-bold text-green-700">
                                            {results.winner} {results.winnerPrice !== 'None' && `with price ${results.winnerPrice}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
