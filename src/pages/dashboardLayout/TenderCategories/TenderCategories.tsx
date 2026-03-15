// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
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
import useAllTenderCategories from "@/hooks/getAllTenderCategories";
import useAllJobOrders from "@/hooks/useAllJobOrders";
import useAllTenderCategoriesWithPagination from "@/hooks/useAllTenderCategoriesWithPagination";
import { updateData } from "@/lib/updateData";
import Pagination from "@/shared/Pagination/Pagination";
import axiosInstance from "@/lib/axiosInstance";
import { AlignJustify, Plus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

const TenderCategories = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [message, setMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(
        Number(searchParams.get("page")) || 1
    );
    const [pageLimit, setPageLimit] = useState(
        Number(searchParams.get("limit")) || 50
    );

    const { categories: data, loading, setReload, count } = useAllTenderCategoriesWithPagination(searchTerm, currentPage, pageLimit);

    const handleDelete = async (id) => {
        const toastId = toast.loading("Loading...");
        const url = `${config.apiBaseUrl}/tender-categories/delete-category/${id}`;
        try {

            const response = await axiosInstance.delete(url, { withCredentials: false });
            console.log(response)
            if (response.status === 200) {
                setMessage("Tenders Deleted Category.");
                toast.dismiss(toastId);
                toast.success("success");
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.message || "An unexpected error occurred");
            console.error("Error:", error);
        } finally {
            toast.dismiss(toastId);
            setReload((prevReload) => prevReload + 1);
        }
    }



    return (
        <div>
            <div
                id="tender_cateory_delete_message"
                className="text-green-600 text-center mt-4 font-medium"
            >
                {message && message}{" "}
                {message && (
                    <X
                        size={16}
                        className="inline-block cursor-pointer"
                        onClick={() => setMessage("")}
                    />
                )}
            </div>
            <div className="flex justify-between mt-5">
                <div className="flex items-center gap-2">
                    <AlignJustify />
                    <h1 className="text-2xl font-semibold mb-1">Job Orders List</h1>
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
                    <table id="tender_categories_table" className="mt-5 w-full">
                        <thead>
                            <tr className="bg-primary text-primary-foreground">
                                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                                    Category Id
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-start">
                                    Category Name
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-start ">
                                    Sub Category
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-start ">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {!loading &&
                                data?.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        id="tender_category_row"
                                        className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                                    >
                                        <td className="px-4 py-2">{item?.cat_id}</td>
                                        <td className="px-4 py-2">{item?.cat_name}</td>
                                        <td className="px-4 py-2">{item?.sub_cat_name}</td>
                                        <td className="px-4 py-2"><Button id="delete_category" className="cursor-pointer" onClick={() => handleDelete(item?._id)}>Delete</Button></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            }
            {!loading && data?.length > 0 && (
                <Pagination
                    data={{
                        pageLimit,
                        setCurrentPage,
                        setPageLimit,
                        count,
                        currentPage,
                    }}
                />
            )}
        </div>
    );
};

export default TenderCategories;
