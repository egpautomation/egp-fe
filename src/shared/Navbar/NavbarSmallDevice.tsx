// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthContext } from "@/provider/AuthProvider";
import { List } from "lucide-react";
import { useContext } from "react";

const NavbarSmallDevice = () => {
     const { user , logout} = useContext(AuthContext);
  return (
    <Sheet>
      <SheetTrigger className="md:hidden" asChild>
        <List />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="!text-sm">E-GP tender Automation</SheetTitle>
          <SheetDescription>
           <h1>{user?.email}</h1>
          </SheetDescription>
        </SheetHeader>
      
      
        <SheetFooter>
          <SheetClose asChild>
         { user &&  <Button onClick={()=> logout()} variant={"destructive"} >Log Out</Button>}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSmallDevice;
