// @ts-nocheck
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import locations from "../../../utils/districts";

export function TenderLocationsComboBox({ setLocation, className }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={(`w-[200px] justify-between`, cn(className))}
        >
          {value ? locations.find((location) => location === value) : "Select Location..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={(`w-[200px] p-0`, cn(className))}>
        <Command>
          <CommandInput placeholder="Search Location..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Location found.</CommandEmpty>
            <CommandGroup>
              {locations?.length > 0 && (
                <CommandItem
                  value={""}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setLocation("");
                    setOpen(false);
                  }}
                >
                  All
                  <Check className={cn("ml-auto", value === "" ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              )}
              {locations.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setLocation(newValue);
                    setOpen(false);
                  }}
                >
                  {category}
                  <Check
                    className={cn("ml-auto", value === category ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
