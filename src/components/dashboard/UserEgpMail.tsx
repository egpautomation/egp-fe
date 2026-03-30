// @ts-nocheck

import { useContext, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import useUsersCompanyMigration from "@/hooks/useUsersCompanyMigrations";
import { AuthContext } from "@/provider/AuthProvider";

const UserEgpMail = ({ setFormData, value }) => {
  const { user } = useContext(AuthContext);
  const { companyMigrations: userMail } = useUsersCompanyMigration(user?.email, "");
  const [open, setOpen] = useState(false);

  // Filter for active emails
  const activeMails = userMail?.filter((item) => item?.status?.toLowerCase() === "active");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full mt-2 justify-between"
        >
          {value
            ? activeMails?.find((item) => item?.egpEmail === value)?.egpEmail
            : "Select Egp Mail"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Mail found.</CommandEmpty>
            <CommandGroup>
              {activeMails?.map((item, idx) => (
                <CommandItem
                  key={idx}
                  value={item?.egpEmail}
                  onSelect={(currentValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      egpMail: currentValue,
                    }));
                    setOpen(false);
                  }}
                >
                  {item?.egpEmail}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item?.egpEmail ? "opacity-100" : "opacity-0"
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
};

export default UserEgpMail;
