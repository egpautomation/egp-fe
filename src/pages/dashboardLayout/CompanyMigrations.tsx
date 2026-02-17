// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAllCompanyMigration from "@/hooks/useAllCompanyMigration";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { AlignJustify, Eye, Plus, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CompnayMigrationRow from "./CompnayMigrationRow";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const CompanyMigrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { companyMigrations, loading, setReload } =
    useAllCompanyMigration(searchTerm);
  const [statusFilter, setStatusFilter] = useState("");

  const filteredMigrations = companyMigrations?.filter((item) => {
    if (!statusFilter || statusFilter === "all") return true; // show all

    if (statusFilter === "not-registered") {
      return (
        !item.status ||
        item.status.trim() === "" ||
        ["undefined", "not registered", "null"].includes(
          item.status.toLowerCase()
        )
      );
    }

    return item.status?.toLowerCase() === statusFilter.toLowerCase();
  });






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
          <Input
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">InActive</SelectItem>
                <SelectItem value="not-registered">Not Registered</SelectItem>

              </SelectGroup>
            </SelectContent>
          </Select>
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
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Updated date
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Remarks
                </th>

                <th className="whitespace-nowrap px-4 py-2  rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                filteredMigrations?.map((item, idx) => (
                  <CompnayMigrationRow key={idx} idx={idx} item={item} setReload={setReload} />
                ))}
            </tbody>
          </table>
          <MobileTableLayout data={companyMigrations} setReload={setReload} />
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
              <h1 className="font-medium">User: </h1>
              <h1 className="text-gray-700">{item?.user}</h1>
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
              <h1 className="font-medium">Status: </h1>
              {/* <h1 className="text-gray-700 ">{item?.status}</h1> */}
              <h1 className="text-gray-700 ">Coming soon...</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Remarks: </h1>
              {/* <h1 className="text-gray-700 ">{item?.remarks}</h1> */}
              <h1 className="text-gray-700 ">Coming soon...</h1>
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
                <Link to={`/dashboard/edit-company-registration/${item?._id}`}>
                  <SquarePen className="mr-2 mt-2" size={24} />
                </Link>
                <DeleteDataModal
                  setReload={setReload}
                  url={`${config.apiBaseUrl}/companyMigration/${item?._id}`}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CompanyMigrations;
