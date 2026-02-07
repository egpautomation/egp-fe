// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import useAccountHolderEgpMail from "@/hooks/getAccountHolderEgpMail";
import { AuthContext } from "@/provider/AuthProvider";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { AlignJustify, Edit, Plus } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

const UserAllAccounts = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, setReload } = useAccountHolderEgpMail(user?.email);

  return (
    <div>
      <div className="flex justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">Your Accounts list</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Link
            className=" inline-block"
            to={"/dashboard/bankService/account-holder-details"}
          >
            <Button className="cursor-pointer mr-2">
              <Plus />
              Create Account
            </Button>
          </Link>
        </div>
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  Account Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Account Holder Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Account Number
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  E-GP Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading && data?.length > 0 ? (
                data?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                  >
                    <td className="px-4 py-2">{item?.bankAccName}</td>

                    <td className="px-4 py-2">{item?.accHolderName}</td>
                    <td className="px-4 py-2">{item?.bankAccNumber}</td>
                    <td className="px-4 py-2">{item?.egpMail}</td>
                    <td className={`px-4 py-2 flex items-center gap-2.5`}>
                      <Link
                        to={`/dashboard/bankService/edit-account-details/${item?._id}`}
                      >
                        <Edit />
                      </Link>{" "}
                      <DeleteDataModal
                        setReload={setReload}
                        url={`${config.apiBaseUrlAlt}/accounts/${item?._id}`}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-3">
                    No Account Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default UserAllAccounts;
