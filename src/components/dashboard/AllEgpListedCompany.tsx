// @ts-nocheck

import useAllEgpListedCompanies from "@/hooks/useAllEgpListedCompany";
import DeleteDataModal from "@/shared/Dashboard/DeleteDataModal";
import { config } from "@/lib/config";
import { CirclePlus, Edit, Eye, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "../ui/input";
import { motion } from "framer-motion";

const AllEgpListedCompany = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { egpListedCompanies, setReload } =
    useAllEgpListedCompanies(searchTerm);

  return (
    <div className="">
      <div className="mt-8 mx-auto max-w-full  ">
        <div className="flex max-md:flex-col max-md:gap-2 justify-between">
          <h1 className="text-2xl font-semibold">Egp Listed Company</h1>
          <div className="flex items-center justify-center gap-2">
            <Input
              value={searchTerm}
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link
              to="/dashboard/create-egp-listed-company"
              className="bg-primary text-primary-foreground px-6 flex items-center rounded py-2"
            >
              <CirclePlus className="inline-block mr-1" size={16} /> Create
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="mt-5 w-full max-lg:hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  User
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Egp Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Company Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Password Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Bank Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {egpListedCompanies?.map((company, idx) => (
                <tr
                  key={idx}
                  className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                >
                  <td className="px-4 py-2">{company?.userMail}</td>
                  <td className="px-4 py-2">{company?.egpEmail}</td>
                  <td className="px-4 py-2">{company?.companyName}</td>
                  <td className="px-4 py-2">{company?.password}</td>
                  <td className="px-4 py-2">{company?.remarks}</td>
                  <td className="px-4 py-2">{company?.bankName}</td>
                  <td className="px-4 py-2 flex items-center justify-center">
                    <Link
                      to={`/dashboard/view-egp-listed-company/${company?._id}`}
                    >
                      <Eye className="mr-2" size={20} />
                    </Link>
                    <Link
                      to={`/dashboard/update-egp-listed-company/${company?._id}`}
                    >
                      <Edit size={20} />
                    </Link>
                    <DeleteDataModal
                      setReload={setReload}
                      url={`${config.apiBaseUrlAlt}/egp-listed-company/${company?._id}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <MobileTableLayout data={egpListedCompanies} setReload={setReload} />
        </div>
      </div>
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
  // console.log(data);

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
              <h1 className="text-gray-700">{item?.userMail}</h1>
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
              <h1 className="font-medium">Password Status: </h1>
              <h1 className="text-gray-700 ">{item?.password}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Status: </h1>
              <h1 className="text-gray-700 ">{item?.remarks}</h1>
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Bank Name: </h1>
              <h1 className="text-gray-700 ">{item?.bankName}</h1>
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
                <Link to={`/dashboard/view-egp-listed-company/${item?._id}`}>
                  <Eye className=" mt-2" size={24} />
                </Link>
                <Link to={`/dashboard/update-egp-listed-company/${item?._id}`}>
                  <SquarePen className="mx-2 mt-2" size={24} />
                </Link>
                <DeleteDataModal
                  setReload={setReload}
                  url={`${config.apiBaseUrlAlt}/companyMigration/${item?._id}`}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AllEgpListedCompany;
