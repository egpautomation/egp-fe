// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUsersCompanyMigration from "@/hooks/useUsersCompanyMigrations";
import { AuthContext } from "@/provider/AuthProvider";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { AlignJustify, Plus, SquarePen, FilePenLine } from "lucide-react";
import { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const UsersCompanyMigrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { user } = useContext(AuthContext);
  const { companyMigrations, loading, setReload } = useUsersCompanyMigration(
    user?.email,
    searchTerm
  );

  // Filter data by status
  const filteredData = useMemo(() => {
    if (!companyMigrations) return [];
    if (statusFilter === "All") return companyMigrations;
    return companyMigrations.filter(
      (item) => item?.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [companyMigrations, statusFilter]);

  // Predefined status options for filter dropdown
  const statusOptions = ["All", "Active", "Pending", "In Progress", "Rejected", "Completed"];



  return (
    <div>
      <div className="flex max-md:flex-col max-md:gap-2 justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">
            Company Migration List
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Link
            className=" inline-block"
            to={"/dashboard/create-company-registration"}
          >
            <Button className="cursor-pointer mr-2">
              <Plus />
              Migrate Company
            </Button>
          </Link>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Input
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full max-lg:hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  User
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">
                  E-GP Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Company Name
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Remarks
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Contact
                </th>
                <th className="whitespace-nowrap px-4 py-2  rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading && filteredData?.length ? (
                filteredData?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                  >
                    <td className="px-4 py-2">{item?.user}</td>
                    <td className="px-4 py-2">{item?.egpEmail}</td>
                    <td className="px-4 py-2">{item?.companyName}</td>
                    <td className="px-4 py-2 min-w-32">{item?.status}</td>
                    <td className="px-4 py-2  min-w-48">{item?.remarks}</td>
                    <td className="px-4 py-2">
                      <a
                        href={`https://api.whatsapp.com/send?phone=8801926959331&text=I am ${encodeURIComponent(
                          item?.user
                        )}. Please Update ${encodeURIComponent(item?.egpEmail)} Information immediately.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                          WhatsApp
                        </Button>
                      </a>
                    </td>
                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                      <Link
                        to={`/dashboard/edit-company-registration/${item?._id}`}
                        title="Edit"
                      >
                        <SquarePen className="mt-2 hover:text-blue-600 transition-colors" size={24} />
                      </Link>
                      <Link
                        to={
                          item?.status?.toLowerCase() === "active"
                            ? `/dashboard/update-company-migration/${item?._id}`
                            : "#"
                        }
                        onClick={(e) => {
                          if (item?.status?.toLowerCase() !== "active") {
                            e.preventDefault();
                          }
                        }}
                      >
                        <button
                          disabled={item?.status?.toLowerCase() !== "active"}
                          className={`mt-2 ${item?.status?.toLowerCase() === "active"
                            ? "cursor-pointer text-blue-600 hover:text-blue-800"
                            : "cursor-not-allowed text-gray-400 opacity-50"
                            }`}
                          title={
                            item?.status?.toLowerCase() === "active"
                              ? "Update"
                              : "Update disabled - Status is not active"
                          }
                        >
                          <FilePenLine size={24} />
                        </button>
                      </Link>
                      <DeleteDataModal
                        setReload={setReload}
                        // https://egpserver.jubairahmad.com
                        // https://egp-tender-automation-server.vercel.app
                        url={`https://egp-tender-automation-server.vercel.app/api/v1/companyMigration/${item?._id}`}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="col-span-full">
                    <p className="text-xl py-2 mx-auto text-center">
                      You Have Not Registered Any Company Yet!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <MobileTableLayout data={filteredData} setReload={setReload} />
        </div>
      }
    </div>
  );
};

const MobileTableLayout = ({
  data,
  setReload,
}: {
  data: any;
  setReload: any;
}) => {
  console.log(data);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const buttonVariants = {
    rest: {
      scale: 1,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-6 my-8 lg:hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data?.map((item: any, idx: number) => (
        <motion.div
          key={idx}
          className="flex flex-col gap-2 border rounded-xl p-4 md:p-8 py-6"
          variants={cardVariants}
          whileHover={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 },
          }}
        >
          <div className="">
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Status: </h1>
              <h1 className="text-gray-700 text-2xl">{item?.status}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">E-GP Email: </h1>
              <h1 className="text-gray-700 ">{item?.egpEmail}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Company Name: </h1>
              <h1 className="text-gray-700 ">{item?.companyName}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">User: </h1>
              <h1 className="text-gray-700 ">{item?.user}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Remarks: </h1>
              <h1 className="text-gray-700 ">{item?.remarks}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Actions: </h1>
              <div className="flex items-center gap-2 justify-center">
                <Link
                  to={`/dashboard/edit-company-registration/${item?._id}`}
                  title="Edit"
                >
                  <SquarePen className="mt-2 hover:text-blue-600 transition-colors" size={24} />
                </Link>
                <Link
                  to={
                    item?.status?.toLowerCase() === "active"
                      ? `/dashboard/update-company-migration/${item?._id}`
                      : "#"
                  }
                  onClick={(e) => {
                    if (item?.status?.toLowerCase() !== "active") {
                      e.preventDefault();
                    }
                  }}
                >
                  <button
                    disabled={item?.status?.toLowerCase() !== "active"}
                    className={`mt-2 ${item?.status?.toLowerCase() === "active"
                      ? "cursor-pointer text-blue-600 hover:text-blue-800"
                      : "cursor-not-allowed text-gray-400 opacity-50"
                      }`}
                    title={
                      item?.status?.toLowerCase() === "active"
                        ? "Update"
                        : "Update disabled - Status is not active"
                    }
                  >
                    <FilePenLine size={24} />
                  </button>
                </Link>
                <DeleteDataModal
                  setReload={setReload}
                  url={`https://egp-tender-automation-server.vercel.app/api/v1/companyMigration/${item?._id}`}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UsersCompanyMigrations;
