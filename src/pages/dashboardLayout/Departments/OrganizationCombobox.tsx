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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import useAllUniqueOrganizations from "@/hooks/useAllUniqueOrganizations";

export function UniqueOrganizationComboBox({value, setValue, setOrganization,data }) {
  const [open, setOpen] = useState(false);
//   const { data } = useAllUniqueOrganizations();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.find((department) => department === value)
            : "Select Organization..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search Organization..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Organization found.</CommandEmpty>
            <CommandGroup>
              {data?.length > 0 && (
                <CommandItem
                  value={""}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setOrganization("");
                    setOpen(false);
                  }}
                >
                  All
                  <Check
                    className={cn(
                      "ml-auto",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {data.map((department) => (
                <CommandItem
                  key={department}
                  value={department}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;

                    setValue(newValue);
                    setOrganization(newValue);
                    setOpen(false);
                  }}
                >
                  {department}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === department.name ? "opacity-100" : "opacity-0"
                    )}
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
