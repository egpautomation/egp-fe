// @ts-nocheck
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLiveTenders from "@/hooks/useLiveTenders";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isValid, parse } from "date-fns";
import { formatDate as parseDate } from "@/lib/formateDate";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";
import useUserProfile from "@/hooks/useUserProfile";

const SimpleTenderCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const { allTenders, loading } = useLiveTenders();

  // Fetch stored tenders for "This Week" and "This Month" tabs
  const [thisWeekTenders, setThisWeekTenders] = React.useState([]);
  const [thisMonthTenders, setThisMonthTenders] = React.useState([]);
  const [myAreaTenders, setMyAreaTenders] = React.useState([]);
  const [weekLoading, setWeekLoading] = React.useState(false);
  const { userData } = useUserProfile();

  React.useEffect(() => {
    const fetchTenders = async () => {
      try {
        setWeekLoading(true);
        const res = await axiosInstance.get("/tenders", {
          params: { limit: 10000, page: 1 },
        });
        const list = res.data?.data ?? [];

        const now = new Date();

        // Helper: parse "dd-MMM-yyyy HH:mm" or "dd-MMM-yyyy" format reliably
        const parsePubDate = (raw: string): Date | null => {
          if (!raw) return null;
          let d = parse(raw, "dd-MMM-yyyy HH:mm", new Date());
          if (!isValid(d)) d = parse(raw, "dd-MMM-yyyy", new Date());
          if (!isValid(d)) d = new Date(raw);
          return isValid(d) && !isNaN(d.getTime()) ? d : null;
        };

        const toStr = (d: Date) => format(d, "yyyy-MM-dd");

        // This week: Sunday → Saturday
        const weekStartStr = toStr(startOfWeek(now, { weekStartsOn: 0 }));
        const weekEndStr = toStr(endOfWeek(now, { weekStartsOn: 0 }));

        // This month: 1st → last day of month
        const monthStartStr = toStr(startOfMonth(now));
        const monthEndStr = toStr(endOfMonth(now));

        const weekFiltered: any[] = [];
        const monthFiltered: any[] = [];
        const areaFiltered: any[] = [];

        const currentDistrict = userData?.district?.trim()?.toLowerCase() || "";

        list.forEach((t) => {
          const raw = t.publicationDateTime || t.publishingDate || "";
          const d = parsePubDate(raw);
          if (!d) return;
          const dateStr = toStr(d);
          if (dateStr >= weekStartStr && dateStr <= weekEndStr) weekFiltered.push(t);
          if (dateStr >= monthStartStr && dateStr <= monthEndStr) monthFiltered.push(t);

          if (currentDistrict && t.locationDistrict?.toLowerCase().includes(currentDistrict)) {
            areaFiltered.push(t);
          }
        });

        setThisWeekTenders(weekFiltered);
        setThisMonthTenders(monthFiltered);
        setMyAreaTenders(areaFiltered);
      } catch (err) {
        console.error("Failed to fetch tenders:", err);
      } finally {
        setWeekLoading(false);
      }
    };
    fetchTenders();
  }, [userData?.district]);

  // Define userDistrict outside useEffect so it's accessible in render
  const userDistrict = userData?.district?.trim()?.toLowerCase() || "";

  // Selected date string in dd-MMM-yyyy format
  const formattedDate = date ? format(date, "dd-MMM-yyyy") : "";

  // Tenders published on the selected date
  const tendersOnDate = React.useMemo(() => {
    if (!formattedDate || !allTenders.length) return [];
    return allTenders.filter(t => {
      const dbDate = t.publicationDateTime || t.publishingDate || "";
      if (!dbDate) return false;
      const parsedDbDate = parseDate(dbDate, "dd-MMM-yyyy").toLowerCase();
      return parsedDbDate === formattedDate.toLowerCase();
    });
  }, [allTenders, formattedDate]);

  // Group by organization
  const wings = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tendersOnDate.forEach(t => {
      const org = t.organization || "Other";
      counts[org] = (counts[org] || 0) + 1;
    });

    const items = Object.entries(counts).map(([name, count], idx) => ({
      id: String(idx + 1).padStart(2, '0'),
      name,
      count: String(count).padStart(2, '0')
    }));

    // Fallback if empty
    if (items.length === 0) {
      return [{ id: "01", name: "No Tenders Found", count: "00" }];
    }
    return items;
  }, [tendersOnDate]);

  const handleDetailsClick = () => {
    if (formattedDate) {
      navigate(`/dashboard/live-tender?publishingDate=${formattedDate}`);
    } else {
      navigate(`/dashboard/live-tender`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex gap-5 flex-wrap w-full">
        <Card className="w-full max-w-xs bg-slate-50 border-none shadow-md flex-shrink-0">
          {/* Header Section */}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600 font-medium">Select Tender Date</CardTitle>
          </CardHeader>

          {/* Calendar Container */}
          <CardContent className="bg-white mx-4 mt-2 mb-4 rounded-xl p-0 shadow-inner flex flex-col">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-1 w-full rounded-sm flex justify-center"
              captionLayout="dropdown"
            />
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between mt-auto">
              <div className="text-sm font-semibold text-slate-700">
                Publishing: <span className="text-[#4874c7] font-bold ml-1">{tendersOnDate.length}</span>
              </div>
              <Button
                onClick={handleDetailsClick}
                variant="link"
                className="text-[#4874c7] font-bold p-0 h-auto"
              >
                View All
              </Button>
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
              <TabsList className="grid w-full grid-cols-3 bg-slate-200/50 rounded-lg p-1 h-12 mb-4">
                <TabsTrigger
                  value="this-week"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-[#4874c7] data-[state=active]:shadow-sm text-slate-500 font-semibold"
                >
                  This Week
                </TabsTrigger>
                <TabsTrigger
                  value="this-month"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-[#4874c7] data-[state=active]:shadow-sm text-slate-500 font-semibold"
                >
                  This Month
                </TabsTrigger>
                <TabsTrigger
                  value="my-area"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-[#4874c7] data-[state=active]:shadow-sm text-slate-500 font-semibold"
                >
                  In My Area
                </TabsTrigger>
              </TabsList>

              {/* Tabs Content */}
              <TabsContent value="this-week" className="mt-0">
                <Card className="border-none shadow-none bg-white rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 bg-slate-50/50 px-4 py-3 border-b border-slate-100">
                    <span className="col-span-1 text-[11px] font-bold text-slate-400 uppercase">#</span>
                    <span className="col-span-8 text-[11px] font-bold text-slate-400 uppercase">Name</span>
                    <span className="col-span-3 text-right text-[11px] font-bold text-slate-400 uppercase">Published</span>
                  </div>

                  <ScrollArea className="h-70">
                    <div className="divide-y divide-slate-50">
                      {weekLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <div key={i} className="grid grid-cols-12 px-4 py-4 items-start gap-2">
                            <div className="col-span-1 h-3 bg-slate-200 rounded animate-pulse" />
                            <div className="col-span-8 h-3 bg-slate-200 rounded animate-pulse" />
                            <div className="col-span-3 h-3 bg-slate-200 rounded animate-pulse" />
                          </div>
                        ))
                      ) : thisWeekTenders.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-slate-400 text-sm italic">
                          No tenders published this week.
                        </div>
                      ) : (
                        thisWeekTenders.map((tender, idx) => (
                          <div
                            key={tender._id ?? idx}
                            onClick={() => tender._id && navigate(`/dashboard/view-tender/${tender._id}`)}
                            className="grid grid-cols-12 px-4 py-4 items-start hover:bg-slate-50/60 transition-colors cursor-pointer"
                          >
                            <div className="col-span-1 text-sm text-slate-400 font-medium">
                              {String(idx + 1).padStart(2, "0")}
                            </div>
                            <div className="col-span-8 pr-2">
                              <p className="text-sm text-slate-700 font-medium leading-relaxed line-clamp-3">
                                {tender.BriefDescriptionofWorks || tender.descriptionOfWorks || tender.title || "—"}
                              </p>
                              {tender.organization && (
                                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{tender.organization}</p>
                              )}
                            </div>
                            <div className="col-span-3 text-right text-xs text-slate-500 font-medium whitespace-nowrap pt-1">
                              {parseDate(tender.publicationDateTime || tender.publishingDate, "dd-MMM-yyyy")}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>


              <TabsContent value="this-month" className="mt-0">
                <Card className="border-none shadow-none bg-white rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 bg-slate-50/50 px-4 py-3 border-b border-slate-100">
                    <span className="col-span-1 text-[11px] font-bold text-slate-400 uppercase">#</span>
                    <span className="col-span-8 text-[11px] font-bold text-slate-400 uppercase">Name</span>
                    <span className="col-span-3 text-right text-[11px] font-bold text-slate-400 uppercase">Published</span>
                  </div>
                  <ScrollArea className="h-70">
                    <div className="divide-y divide-slate-50">
                      {weekLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <div key={i} className="grid grid-cols-12 px-4 py-4 items-start gap-2">
                            <div className="col-span-1 h-3 bg-slate-200 rounded animate-pulse" />
                            <div className="col-span-8 h-3 bg-slate-200 rounded animate-pulse" />
                            <div className="col-span-3 h-3 bg-slate-200 rounded animate-pulse" />
                          </div>
                        ))
                      ) : thisMonthTenders.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-slate-400 text-sm italic">
                          No tenders published this month.
                        </div>
                      ) : (
                        thisMonthTenders.map((tender, idx) => (
                          <div
                            key={tender._id ?? idx}
                            onClick={() => tender._id && navigate(`/dashboard/view-tender/${tender._id}`)}
                            className="grid grid-cols-12 px-4 py-4 items-start hover:bg-slate-50/60 transition-colors cursor-pointer"
                          >
                            <div className="col-span-1 text-sm text-slate-400 font-medium">
                              {String(idx + 1).padStart(2, "0")}
                            </div>
                            <div className="col-span-8 pr-2">
                              <p className="text-sm text-slate-700 font-medium leading-relaxed line-clamp-3">
                                {tender.BriefDescriptionofWorks || tender.descriptionOfWorks || tender.title || "—"}
                              </p>
                              {tender.organization && (
                                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{tender.organization}</p>
                              )}
                            </div>
                            <div className="col-span-3 text-right text-xs text-slate-500 font-medium whitespace-nowrap pt-1">
                              {parseDate(tender.publicationDateTime || tender.publishingDate, "dd-MMM-yyyy")}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="my-area" className="mt-0">
                <Card className="border-none shadow-none bg-white rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 bg-slate-50/50 px-4 py-3 border-b border-slate-100">
                    <span className="col-span-1 text-[11px] font-bold text-slate-400 uppercase">#</span>
                    <span className="col-span-8 text-[11px] font-bold text-slate-400 uppercase">Name</span>
                    <span className="col-span-3 text-right text-[11px] font-bold text-slate-400 uppercase">Location</span>
                  </div>
                  <ScrollArea className="h-70">
                    <div className="divide-y divide-slate-50">
                      {weekLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <div key={i} className="grid grid-cols-12 px-4 py-4 items-start gap-2">
                            <div className="col-span-1 h-3 bg-slate-200 rounded animate-pulse" />
                            <div className="col-span-8 h-3 bg-slate-200 rounded animate-pulse" />
                            <div className="col-span-3 h-3 bg-slate-200 rounded animate-pulse" />
                          </div>
                        ))
                      ) : !userDistrict ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                          <span className="text-slate-400 text-sm italic">
                            Your district is not set in your profile.
                          </span>
                          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/profile")}>
                            Update Profile
                          </Button>
                        </div>
                      ) : myAreaTenders.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-slate-400 text-sm italic">
                          No tenders found in {userData?.district || "your area"}.
                        </div>
                      ) : (
                        myAreaTenders.map((tender, idx) => (
                          <div
                            key={tender._id ?? idx}
                            onClick={() => tender._id && navigate(`/dashboard/view-tender/${tender._id}`)}
                            className="grid grid-cols-12 px-4 py-4 items-start hover:bg-slate-50/60 transition-colors cursor-pointer"
                          >
                            <div className="col-span-1 text-sm text-slate-400 font-medium">
                              {String(idx + 1).padStart(2, "0")}
                            </div>
                            <div className="col-span-8 pr-2">
                              <p className="text-sm text-slate-700 font-medium leading-relaxed line-clamp-3">
                                {tender.BriefDescriptionofWorks || tender.descriptionOfWorks || tender.title || "—"}
                              </p>
                              {tender.organization && (
                                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{tender.organization}</p>
                              )}
                            </div>
                            <div className="col-span-3 text-right text-xs text-slate-500 font-medium whitespace-nowrap pt-1">
                              {tender.locationDistrict || "—"}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Organization Tables */}
      <div className="flex gap-5 flex-wrap w-full">
        {/* Left Table: Wings Breakdown */}
        <Card className="w-full max-w-md bg-slate-50 border-none shadow-md">
          {/* Header Section */}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600 font-medium whitespace-nowrap">
              {formattedDate ? `${formattedDate} Wings Breakdown` : "Wings Breakdown"}
            </CardTitle>
            <Button variant="link" className="text-[#4874c7] p-0 h-auto" onClick={handleDetailsClick}>
              View All ({tendersOnDate.length})
            </Button>
          </CardHeader>

          {/* Container */}
          <CardContent className="bg-white mx-4 mb-4 rounded-xl p-0 shadow-inner overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-100 px-6 py-4">
              <div className="col-span-2 text-sm font-bold text-slate-600">Ser</div>
              <div className="col-span-7 text-sm font-bold text-slate-600">Wing / Organization</div>
              <div className="col-span-3 text-right text-sm font-bold text-slate-600">Action</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-50">
              {wings.map((wing) => (
                <div
                  key={wing.id}
                  className="grid grid-cols-12 px-6 py-3 items-center hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="col-span-2 text-sm text-slate-500 font-medium">
                    {wing.id}
                  </div>
                  <div className="col-span-7 text-sm text-slate-700 font-semibold leading-relaxed">
                    {wing.name} {" "}
                    {wing.count !== "00" && <span className="text-slate-400 font-normal ml-1">({wing.count})</span>}
                  </div>
                  <div className="col-span-3 text-right">
                    {wing.count !== "00" && (
                      <Button
                        onClick={handleDetailsClick}
                        variant="link"
                        className="text-[#4874c7] cursor-pointer font-bold p-0 h-auto underline-offset-4"
                      >
                        Details
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Table: Additional Info (Placeholder) */}
        <Card className="w-full max-w-md bg-slate-50 border-none shadow-md">
          {/* Header Section */}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-600 font-medium whitespace-nowrap">
              Additional Breakdown
            </CardTitle>
            <Button variant="link" className="text-[#4874c7] p-0 h-auto">
              View All
            </Button>
          </CardHeader>

          {/* Container */}
          <CardContent className="bg-white mx-4 mb-4 rounded-xl p-0 shadow-inner overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-100 px-6 py-4">
              <div className="col-span-2 text-sm font-bold text-slate-600">Ser</div>
              <div className="col-span-7 text-sm font-bold text-slate-600">Category</div>
              <div className="col-span-3 text-right text-sm font-bold text-slate-600">Action</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-50">
              <div className="flex items-center justify-center p-8 text-slate-400 text-sm italic">
                Data coming soon...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleTenderCalendar;
