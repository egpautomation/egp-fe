// @ts-nocheck
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const SimpleTenderCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const wings = [
    { id: "01", name: "Army Wing 1", count: "00" },
    { id: "02", name: "Army Wing 2", count: "00" },
    { id: "03", name: "Navy Wing", count: "04" },
    { id: "04", name: "Air Force Wing", count: "07" },
    { id: "05", name: "Miscellaneous Tender", count: "00" },
  ];
  const tenderData = [
    {
      id: "01",
      name: "Upgradation of BN PABX into single server based IP PABX along with accessories and infrastructure for BN server",
      date: "16-02-2026",
    },
    {
      id: "02",
      name: "TBO Calendar Life Extension of 24 X 24 Personnel...",
      date: "16-02-2026",
    },
    {
      id: "03",
      name: "Procurement of specialized medical equipment for Naval Hospital",
      date: "15-02-2026",
    },
  ];

  return (
    <div className="flex gap-5 flex-wrap">
      <Card className="w-full max-w-xs bg-slate-50 border-none shadow-md">
        {/* Header Section */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-slate-600 font-medium">Select Tender Date</CardTitle>
          <Button variant="link" className="text-[#4874c7] p-0 h-auto">
            View All
          </Button>
        </CardHeader>

        {/* Calendar Container */}
        <CardContent className="bg-white m-4 rounded-xl p-0   shadow-inner">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-1   w-full rounded-sm"
            captionLayout="dropdown"
          />
        </CardContent>
      </Card>
      <Card className="w-full max-w-xs bg-slate-50 border-none shadow-md">
        {/* Header Section */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-slate-600 font-medium">Today's Tender Opening</CardTitle>
          <Button variant="link" className="text-[#4874c7] p-0 h-auto">
            View All
          </Button>
        </CardHeader>

        {/* Calendar Container */}
        <CardContent className="bg-white m-4 rounded-xl p-0   shadow-inner">
          {/* Header - Hidden on very small screens if preferred, but kept simple here */}
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-100 px-6 py-4">
          <div className="col-span-2 text-sm font-bold text-slate-600">Ser</div>
          <div className="col-span-7 text-sm font-bold text-slate-600">Wing</div>
          <div className="col-span-3 text-right text-sm font-bold text-slate-600">Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {wings.map((wing) => (
            <div 
              key={wing.id} 
              className="grid grid-cols-12 px-6 py-2 items-center hover:bg-slate-50/50 transition-colors group"
            >
              <div className="col-span-2 text-sm text-slate-500 font-medium">
                {wing.id}
              </div>
              <div className="col-span-7 text-sm text-slate-700 font-semibold">
                {wing.name} <span className="text-slate-400 font-normal ml-1">({wing.count})</span>
              </div>
              <div className="col-span-3 text-right">
                <Button
                  variant="link" 
                  className="text-[#4874c7] cursor-pointer font-bold p-0 h-auto underline-offset-4"
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
          
        </CardContent>
      </Card>
      <Card className="w-full max-w-md bg-slate-50 border-none shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
        <CardTitle className="text-slate-600 text-xl font-medium">
          Latest Tender
        </CardTitle>
        <Button variant="link" className="text-[#4874c7] font-bold p-0 h-auto">
          View All
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <Tabs defaultValue="this-week" className="w-full">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-2 bg-slate-200/50 rounded-lg p-1 h-12 mb-4">
            <TabsTrigger 
              value="this-week" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-700 data-[state=active]:shadow-sm text-slate-500 font-semibold"
            >
              This Week
            </TabsTrigger>
            <TabsTrigger 
              value="this-month" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-[#4874c7] data-[state=active]:shadow-sm text-slate-500 font-semibold"
            >
              This Month
            </TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="this-week" className="mt-0">
            <Card className="border-none shadow-none bg-white rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-50/50 px-4 py-3 border-b border-slate-100">
                <span className="col-span-2 text-[11px] font-bold text-slate-400 uppercase">Ser</span>
                <span className="col-span-7 text-[11px] font-bold text-slate-400 uppercase">Name</span>
                <span className="col-span-3 text-right text-[11px] font-bold text-slate-400 uppercase">Published</span>
              </div>
              
              <ScrollArea className="h-70">
                <div className="divide-y divide-slate-50">
                  {tenderData.map((tender) => (
                    <div key={tender.id} className="grid grid-cols-12 px-4 py-4 items-start hover:bg-slate-50/30 transition-colors">
                      <div className="col-span-2 text-sm text-slate-400 font-medium">
                        {tender.id}
                      </div>
                      <div className="col-span-7 pr-2">
                        <p className="text-sm text-slate-700 font-medium leading-relaxed line-clamp-3">
                          {tender.name}
                        </p>
                      </div>
                      <div className="col-span-3 text-right text-xs text-slate-500 font-medium whitespace-nowrap pt-1">
                        {tender.date}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="this-month">
            <div className="flex items-center justify-center h-75 text-slate-400 text-sm italic">
              Loading monthly records...
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </div>
  );
};

export default SimpleTenderCalendar;
