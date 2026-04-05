// @ts-nocheck

import { config } from "@/lib/config";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAllUsers from "@/hooks/useAllUsers";
import { updateData } from "@/lib/updateData";
import { AuthContext } from "@/provider/AuthProvider";
import { AlignJustify, CircleUserRound, Eye } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/formateDate";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, setReload } = useAllUsers(searchTerm);

  const handleUserRoleUpdate = async (email: string, role: string) => {
    const url = `${config.apiBaseUrl}/user/update-user`;
    await updateData(url, { email, role }, setReload);

    // ✅ if the logged-in user's role is changed, refetch
    // if (user?.email === email) {
    //   await refetchUser(email);
    // }

    // setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">Users List</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Input
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">User Id</th>
                <th className="whitespace-nowrap px-4 py-2 text-start">Profile</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Email</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Contact</th>

                <th className="whitespace-nowrap px-4 py-2 text-start ">Districts</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Role</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Wallet</th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">Joined At</th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                users?.map((user, idx) => (
                  <tr key={idx} className={`border ${idx % 2 == 1 && "bg-gray-100"}`}>
                    <td className="px-4 py-2">{user?.userId}</td>
                    <td className="px-4 py-2">
                      {user?.profile ? (
                        <div className="h-10 w-10 rounded-full">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src="https://picsum.photos/id/237/200/300"
                            alt=""
                            srcset=""
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-600">
                          <CircleUserRound className="text-white" size={40} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{user?.email}</td>
                    <td className="px-4 py-2">{user?.phone}</td>
                    <td className="px-4 py-2">{user?.district}</td>
                    {/* <td className="px-4 py-2">{user?.role}</td> */}
                    <td className="px-4 py-2">
                      <Select onValueChange={(value) => handleUserRoleUpdate(user?.email, value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={user?.role} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user_agent">User Agent</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="gues">Guest</SelectItem>
                            <SelectItem value="tti_agent">TTI Agent</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 text-orange-600 font-medium">
                      ৳ {user?.wallet?.balance?.toLocaleString() || "0"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-slate-500">
                      {user?.createdAt ? formatDate(user.createdAt, "dd MMM, yyyy") : "N/A"}
                    </td>
                    <td className="px-4 py-2 flex items-center justify-center">
                      <Link to={`/dashboard/users/${user?.userId}`}>
                        <Eye className="mr-2 mt-2" size={24} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default Users;
