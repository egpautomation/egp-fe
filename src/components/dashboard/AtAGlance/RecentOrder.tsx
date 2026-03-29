// @ts-nocheck
import { Checkbox } from "@/components/ui/checkbox";
import useUserRecentOrder from "@/hooks/getUserRecentOrder";
import { formatDate } from "@/lib/formateDate";
import { AuthContext } from "@/provider/AuthProvider";
import { ExternalLink, Plus } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RecentOrder = () => {
  const { user } = useContext(AuthContext);
  const { orders } = useUserRecentOrder(user?.email);

  return (
    <div className="shadow-xl overflow-x-scroll ">
      <div className="p-3 md:py-3 md:px-5 flex justify-between gap-5  max-md:flex-col">
        <div>
          <h1 className="text-2xl font-semibold text-gray-600 text-nowrap">Recent Order</h1>
        </div>
        <div className="flex max-md:flex-col items-center gap-3">
          <Link to="/dashboard/create-job-order" className="max-md:w-full">
            {" "}
            <button className="border w-full rounded px-5 py-1.5 cursor-pointer shadow-md text-gray-600 font-semibold whitespace-nowrap">
              <Plus size={16} className="inline-block" /> Order A job
            </button>
          </Link>

          <Link
            className="cursor-pointer max-md:w-full"
            to={"/dashboard/create-company-registration"}
          >
            <button className="border w-full cursor-pointer rounded px-5 py-1.5 shadow-md text-gray-600 font-semibold  whitespace-nowrap">
              <Plus size={16} className="inline-block" /> Add A New Company Migration
            </button>
          </Link>
          <Link className="cursor-pointer max-md:w-full" to={"/dashboard/payment"}>
            {" "}
            <button className="border w-full rounded px-5 py-1.5 shadow-md text-gray-600 font-semibold  whitespace-nowrap cursor-pointer">
              <ExternalLink size={16} className="inline-block" />
              Payment
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full mt-3 overflow-x-auto">
          <thead className="p-3 md:py-3 md:px-5 bg-blue-100">
            <tr>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                <Checkbox className="text-white bg-white" />
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                Contractor Name
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                Egp Email
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                Tender Id
              </th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">Status</th>
              <th className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 ? (
              orders?.map((order) => (
                <tr key={order?._id}>
                  <td className="text-nowrap p-3 md:py-4 md:px-5 text-start text-gray-600">
                    {" "}
                    <Checkbox className="text-white bg-white" />
                  </td>
                  <td className="text-nowrap p-3 md:py-3 md:px-5 text-start text-blue-600">
                    {order?.companyName}
                  </td>
                  <td className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                    {order?.egpMail}
                  </td>
                  <td className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                    {order?.tenderId}
                  </td>
                  <td className={`px-4 py-2 `}>
                    <span
                      className={`border-none shadow-none rounded inline-block w-max py-0.5 px-2.5 text-sm  bg-gray-200  font-semibold  ${order?.status === "working" && "bg-orange-300 text-orange-900"} ${order?.status === "fulfilled" && "bg-green-300 text-green-900"} ${order?.status === "canceled" && "bg-red-400 text-red-900"}`}
                    >
                      {" "}
                      {order?.status}
                    </span>
                  </td>
                  <td className="text-nowrap p-3 md:py-3 md:px-5 text-start text-gray-600">
                    {" "}
                    {/* { order?.openingDateTime} */}
                    {formatDate(order?.openingDateTime, "yyyy-MM-dd")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center font-semibold py-3">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <MobileTableLayout orders={orders} /> */}
    </div>
  );
};

const MobileTableLayout = ({ orders }: { orders: any }) => {
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
      animate="visible"
    >
      {orders?.map((item: any, idx: number) => (
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
              <h1 className="font-medium">Tender Id: </h1>
              <h1 className="text-gray-700 text-2xl">{item?.tenderId}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Contractor Name: </h1>
              <h1 className="text-gray-700 ">{item?.companyName}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Egp Email: </h1>
              <h1 className="text-gray-700 ">{item?.egpMail}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Status: </h1>
              <h1 className="text-gray-700 ">{item?.status}</h1>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-2 border-b pb-2 my-2"
              initial={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
            >
              <h1 className="font-medium">Deadline: </h1>
              <h1 className="text-gray-700 ">{formatDate(item?.openingDateTime, "yyyy-MM-dd")}</h1>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RecentOrder;
