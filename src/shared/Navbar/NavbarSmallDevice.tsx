// @ts-nocheck
import { Link } from "react-router-dom";
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
  const { user, logout } = useContext(AuthContext);
  return (
    <Sheet>
      <SheetTrigger className="md:hidden" asChild>
        <List />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 !text-sm">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            E-GP tender Automation
          </SheetTitle>
          <SheetDescription>
            <h1>{user?.email}</h1>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex flex-col gap-2 mt-4">
          <SheetClose asChild>
            {user && (
              <Link to="/dashboard/profile" className="w-full">
                <Button variant={"outline"} className="w-full">Profile</Button>
              </Link>
            )}
          </SheetClose>
          <SheetClose asChild>
            {user && <Button onClick={() => logout()} variant={"destructive"} className="w-full">Log Out</Button>}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSmallDevice;
