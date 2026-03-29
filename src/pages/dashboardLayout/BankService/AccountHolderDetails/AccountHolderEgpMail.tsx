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
import { useContext, useState } from "react";
import useAccountHolderEgpMail from "@/hooks/getAccountHolderEgpMail";
import { AuthContext } from "@/provider/AuthProvider";

export function AccountHolderEgpMail({ setEgpMail }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { user } = useContext(AuthContext);
  const { data: mails } = useAccountHolderEgpMail(user?.email);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? mails.find((mail) => mail?.egpMail === value)?.egpMail : "Select E-GP Email..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search E-GP Email..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Mail found.</CommandEmpty>
            <CommandGroup>
              {mails.map((mail) => (
                <CommandItem
                  key={mail?.egpMail}
                  value={mail?.egpMail}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;

                    setValue(newValue);
                    setEgpMail(newValue);
                    setOpen(false);
                  }}
                >
                  {mail?.egpMail}
                  <Check
                    className={cn("ml-auto", value === mail?.egpMail ? "opacity-100" : "opacity-0")}
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
