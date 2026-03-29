// @ts-nocheck
"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * DatePickerWithRange Component
 *
 * A professional date range picker that converts between string dates (for API)
 * and Date objects (for the calendar component).
 *
 * @param {Object} props
 * @param {string} props.className - Optional className for styling
 * @param {Object} props.date - Date range object with from/to string dates
 * @param {Function} props.setDate - Callback to update date range
 */
export function DatePickerWithRange({ className, date, setDate }) {
  const [open, setOpen] = React.useState(false);

  // Convert string dates to Date objects for calendar component
  const dateRange = React.useMemo(
    () => ({
      from: date?.from ? new Date(date.from) : undefined,
      to: date?.to ? new Date(date.to) : undefined,
    }),
    [date?.from, date?.to]
  );

  // Handle date selection and convert back to string format for API
  const handleSelect = React.useCallback(
    (selectedRange) => {
      if (!selectedRange) {
        setDate({ from: "", to: "" });
        return;
      }

      try {
        if (selectedRange.from) {
          const formattedDate = {
            from: format(selectedRange.from, "yyyy-MM-dd"),
            to: selectedRange.to ? format(selectedRange.to, "yyyy-MM-dd") : "",
          };
          setDate(formattedDate);
        }
      } catch (error) {
        console.error("Error formatting date:", error);
      }
    },
    [setDate]
  );

  // Format display text for button
  const displayText = React.useMemo(() => {
    if (!dateRange?.from) {
      return <span>Last Selling Date Range</span>;
    }

    if (dateRange.to) {
      return (
        <>
          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
        </>
      );
    }

    return format(dateRange.from, "LLL dd, y");
  }, [dateRange]);

  return (
    <div className={cn("", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full md:w-[300px] justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from || new Date()}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
