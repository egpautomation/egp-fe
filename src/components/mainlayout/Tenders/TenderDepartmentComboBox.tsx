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
import useAllTenderDepartments from "@/hooks/useAllTenderDepartments";

export function TenderDepartmentsComboBox({ setDepartment, className }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { departments } = useAllTenderDepartments();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={("w-[200px] justify-between", cn(className))}
        >
          {value
            ? departments.find((department) => department.name === value)?.name
            : "Select Department..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={(`w-[200px] p-0`, cn(className))}>
        <Command>
          <CommandInput placeholder="Search Department..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Departments found.</CommandEmpty>
            <CommandGroup>
              {departments?.length > 0 && (
                <CommandItem
                  value={""}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setDepartment("");
                    setOpen(false);
                  }}
                >
                  All
                  <Check className={cn("ml-auto", value === "" ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              )}
              {departments.map((department) => (
                <CommandItem
                  key={department.name}
                  value={department.name}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;

                    setValue(newValue);
                    setDepartment(newValue);
                    setOpen(false);
                  }}
                >
                  {department.name}
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
