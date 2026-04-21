// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Calculator, CheckCircle2, FileText, Globe, Star } from "lucide-react";

const AtAGlancePage = () => {
  return (
    <div className="py-6 space-y-6 bg-slate-50/50 min-h-screen font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Tender Management Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">etenderbd.com - One Platform | Full Control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Content (Left) */}
        <div className="xl:col-span-9 space-y-6">
          
          {/* Row 1: Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Tenders */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Active Tenders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">25 Open</div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span>LGED</span><span className="font-medium">12</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span>PWD</span><span className="font-medium">8</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>RHD</span><span className="font-medium">5</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Total Submitted */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-slate-500">Total Submitted</CardTitle>
                <span className="text-xl font-bold text-slate-800">85%</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">18 Total</div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Success rate</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Submitted</span>
                    <span>Not Evaluated</span>
                    <span>Rejected</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 mt-2">
                <div className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium text-slate-800">New LGED Tender</p>
                    <p className="text-xs text-slate-500">New LGED Tender - 2023</p>
                  </div>
                  <span className="text-xs text-slate-400">1h ago</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium text-slate-800">Closing Soon Alert</p>
                    <p className="text-xs text-slate-500">RHD Tender closing</p>
                  </div>
                  <span className="text-xs text-slate-400">3h ago</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium text-slate-800">Evaluated Tender</p>
                    <p className="text-xs text-slate-500">PWD results out</p>
                  </div>
                  <span className="text-xs text-slate-400">2h ago</span>
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 mb-4">5 Tasks</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Calculate BOQ</span>
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">👤</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Upload SLT PDF</span>
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">👤</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Fill Form for LGED</span>
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">👤</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Analytics & Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analytics */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-medium text-slate-500">Dashboard Analytics</CardTitle>
                <select className="text-xs border rounded-md px-2 py-1 bg-slate-50 outline-none">
                  <option>Last 6 months</option>
                </select>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs mb-6">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-sm"></span> Tenders Submitted</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-sm"></span> Tenders Awarded</span>
                </div>
                <div className="flex items-end h-32 gap-2 mt-4 border-b border-slate-100 pb-2 relative">
                  {/* Mock Bar Chart */}
                  {[40, 60, 50, 90, 80, 70].map((val, i) => (
                    <div key={i} className="flex-1 flex justify-center items-end gap-1 group">
                      <div className="w-3 bg-blue-500 rounded-t-sm transition-all group-hover:bg-blue-600" style={{ height: `${val}%` }}></div>
                      <div className="w-3 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-600" style={{ height: `${val * 0.7}%` }}></div>
                    </div>
                  ))}
                  <div className="absolute right-0 top-0 text-right">
                    <div className="text-xs text-slate-500">Overall Success</div>
                    <div className="text-2xl font-bold text-slate-800">75%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Pipeline */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Tender Progress Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                    <div className="text-center font-semibold text-slate-500 mb-2">Not Submitted</div>
                    <div className="bg-white p-2 rounded border border-slate-200 mb-2 shadow-sm"><div className="font-semibold text-slate-800">Tender Name</div><div className="text-[10px] text-slate-400">15-12-2023</div></div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-sm"><div className="font-semibold text-slate-800">Tender Name</div><div className="text-[10px] text-slate-400">13-12-2023</div></div>
                  </div>
                  <div className="bg-amber-50/50 p-2 rounded-md border border-amber-100">
                    <div className="text-center font-semibold text-amber-600 mb-2">In Progress</div>
                    <div className="bg-white p-2 rounded border border-slate-200 mb-2 shadow-sm"><div className="font-semibold text-slate-800">Tender Name</div><div className="text-[10px] text-slate-400">16-12-2023</div></div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-sm"><div className="font-semibold text-slate-800">Tender Name</div><div className="text-[10px] text-slate-400">15-12-2023</div></div>
                  </div>
                  <div className="bg-blue-50/50 p-2 rounded-md border border-blue-100">
                    <div className="text-center font-semibold text-blue-600 mb-2">Submitted</div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-sm"><div className="font-semibold text-slate-800">Tender Name</div><div className="text-[10px] text-slate-400">18-12-2023</div></div>
                  </div>
                  <div className="bg-emerald-50/50 p-2 rounded-md border border-emerald-100">
                    <div className="text-center font-semibold text-emerald-600 mb-2">Evaluated</div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-sm"><div className="font-semibold text-slate-800">Tender Name</div><div className="text-[10px] text-slate-400">15-12-2023</div></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* SLT Calc */}
             <Card className="hover:shadow-md transition-shadow lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">SLT Calculation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-500">Key SLT results for the most recent project.</p>
                <div className="flex justify-between items-center text-center">
                  <div>
                    <div className="text-xs font-semibold text-slate-600">Total Hours</div>
                    <div className="text-lg font-bold text-slate-800">27 hr</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600">Cost</div>
                    <div className="text-lg font-bold text-slate-800">$193.00</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600">Resource</div>
                    <div className="text-lg font-bold text-slate-800">65.0m</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-xs font-medium text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">
                  Link to project tool ↗
                </Button>
              </CardContent>
            </Card>

            {/* BOQ Automation */}
            <Card className="hover:shadow-md transition-shadow lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">BOQ Automation Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-slate-500 mb-3">Current BOQ parsing</div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>LGED Data Extracted</span>
                  <span className="text-blue-600">90%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <div><span className="block mb-1">Total Templates</span><span className="font-bold text-slate-800 text-sm">4,738</span></div>
                  <div className="text-right"><span className="block mb-1">Avg Time Saved</span><span className="font-bold text-slate-800 text-sm">1,346m</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Form Logs */}
            <Card className="hover:shadow-md transition-shadow lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Auto Form Fill Logs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { time: '5:52 pm', status: 'Success' },
                  { time: '5:50 pm', status: 'Success' },
                  { time: '5:49 pm', status: 'Success' }
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 last:border-0 pb-2">
                    <div>
                      <p className="font-medium text-xs text-slate-700">Recent Form fill</p>
                      <p className="text-[10px] text-slate-400">Time {log.time}</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[10px] px-2 py-0 border-0">Success</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity */}
            <Card className="hover:shadow-md transition-shadow lg:col-span-1">
               <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Team Activity Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="text-xs font-medium text-slate-700">Kamal updated BOQ</p>
                  <p className="text-[10px] text-slate-400">few mins ago</p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3">
                  <p className="text-xs font-medium text-slate-700">Sumon submitted RHD tender</p>
                  <p className="text-[10px] text-slate-400">1 hour ago</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="text-xs font-medium text-slate-700">Rahim started new project</p>
                  <p className="text-[10px] text-slate-400">3 hours ago</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Row */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-sm font-medium text-slate-500">Tender Notice List Table</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-0">
                    <TableHead className="font-semibold text-slate-600 h-10">Tender ID</TableHead>
                    <TableHead className="font-semibold text-slate-600 h-10">Type</TableHead>
                    <TableHead className="font-semibold text-slate-600 h-10">Agency</TableHead>
                    <TableHead className="font-semibold text-slate-600 h-10">Opening</TableHead>
                    <TableHead className="font-semibold text-slate-600 h-10">Status</TableHead>
                    <TableHead className="font-semibold text-slate-600 h-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-slate-100">
                    <TableCell className="font-medium text-slate-800 py-3">#318CE7</TableCell>
                    <TableCell className="text-slate-500 py-3">Type</TableCell>
                    <TableCell className="font-medium py-3">LGED</TableCell>
                    <TableCell className="text-slate-500 py-3">22.09.2023</TableCell>
                    <TableCell className="py-3"><Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-0">Open</Badge></TableCell>
                    <TableCell className="py-3"><span className="text-blue-600 font-medium cursor-pointer hover:underline text-sm">View</span></TableCell>
                  </TableRow>
                  <TableRow className="border-b border-slate-100">
                    <TableCell className="font-medium text-slate-800 py-3">#318CE8</TableCell>
                    <TableCell className="text-slate-500 py-3">Type</TableCell>
                    <TableCell className="font-medium py-3">PWD</TableCell>
                    <TableCell className="text-slate-500 py-3">25.09.2023</TableCell>
                    <TableCell className="py-3"><Badge variant="secondary" className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-0">Evaluation</Badge></TableCell>
                    <TableCell className="py-3"><span className="text-blue-600 font-medium cursor-pointer hover:underline text-sm">View</span></TableCell>
                  </TableRow>
                  <TableRow className="border-0">
                    <TableCell className="font-medium text-slate-800 py-3">#318CE9</TableCell>
                    <TableCell className="text-slate-500 py-3">Type</TableCell>
                    <TableCell className="font-medium py-3">RHD</TableCell>
                    <TableCell className="text-slate-500 py-3">25.01.2023</TableCell>
                    <TableCell className="py-3"><Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-0">Awarded</Badge></TableCell>
                    <TableCell className="py-3"><span className="text-blue-600 font-medium cursor-pointer hover:underline text-sm">View</span></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          {/* Badge & Quick Links */}
          <div className="relative pt-8">
            <div className="absolute -top-4 right-4 w-20 h-20 bg-amber-300 rounded-full border-4 border-amber-400 flex flex-col items-center justify-center text-[10px] font-bold text-blue-900 shadow-lg z-10 rotate-12 hover:rotate-0 transition-transform cursor-pointer">
              <Star className="w-4 h-4 mb-1 fill-blue-900" />
              <span className="text-center leading-tight">Beginner<br/>Friendly</span>
            </div>
            
            <Card className="bg-white border shadow-sm relative z-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-800">Quick links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium">
                  <Bell className="w-4 h-4" /> New Tender Alert
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-medium">
                  <Calculator className="w-4 h-4" /> Calculate SLT Now
                </Button>
                <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium">
                  <FileText className="w-4 h-4" /> Generate BOQ
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* eGP Live Feed */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-800">eGP Live Feed</CardTitle>
              <CardDescription className="text-xs text-slate-500">(eGP specific links)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 bg-white/60 p-2.5 rounded-md border border-white/80 backdrop-blur-sm text-sm font-medium text-blue-700 cursor-pointer hover:bg-white transition-colors shadow-sm">
                <Globe className="w-4 h-4" /> eGP Live Feed: Connect
              </div>
            </CardContent>
          </Card>

          {/* Latest Guides */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-800">Latest Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> New Tender Alert Guide</li>
                <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Upload SLT PDF Tutorial</li>
                <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Generate BOQ Steps</li>
              </ul>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="shadow-sm border-slate-200">
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-800">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Primary System Operational</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> API Endpoints Healthy</li>
              </ul>
            </CardContent>
          </Card>
          
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-slate-600 font-medium">
        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24/7 Monitoring System</span>
        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full Support Team</span>
        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Data Security Guaranteed</span>
        <span className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full text-slate-800 font-bold">📞 01926-959331 | ✉️ etenderbd.com</span>
      </div>
    </div>
  );
};

export default AtAGlancePage;
