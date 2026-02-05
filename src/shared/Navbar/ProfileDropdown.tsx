// @ts-nocheck
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/provider/AuthProvider";
import { ArrowRightFromLine } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ProfileDropdown() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" hiddennnn md:grid" asChild>
        <div className="bg-violet-800 h-10 w-10 flex justify-center items-center rounded-full">
          <h3 className="text-2xl text-white font-semibold">
            {user?.email?.slice(0, 1).toUpperCase()}
          </h3>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel><Link className="flex items-center gap-2 hover:underline" to="/dashboard">Dashboard <ArrowRightFromLine className="inline-block" size={16} /></Link></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/dashboard/profile">
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="focus:bg-white">
          <Button className="cursor-pointer" variant={"destructive"} onClick={async () => {
            await logout()
            setUser(null)
            navigate("/", { replace: true });
          }}> Logout</Button>
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
