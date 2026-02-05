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
import useAllTenderCategories from "@/hooks/getAllTenderCategories";



export function TenderCategoriesComboBox({ setCategory, className }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const {categories} = useAllTenderCategories()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between`, cn(className)}
        >
          {value
            ? categories.find((category) => category.name === value)?.name
            : "Select Category..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[200px] p-0`, cn(className)}>
        <Command>
          <CommandInput placeholder="Search Department..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Category found.</CommandEmpty>
            <CommandGroup>
          { categories?.length > 0 && <CommandItem
                  value={""}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setCategory("");
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
                </CommandItem>}
              {categories.map((category) => (
                <CommandItem
                key={category.name}
                value={category.name}
                  onSelect={(currentValue) => {
                  
                    const newValue = currentValue === value ? "" : currentValue;
                   
                    setValue(newValue);
                    setCategory(newValue);
                    setOpen(false);
                  }}
                >
                  {category.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === category.name ? "opacity-100" : "opacity-0"
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
