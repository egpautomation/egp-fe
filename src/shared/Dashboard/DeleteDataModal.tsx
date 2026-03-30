// @ts-nocheck

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const DeleteDataModal = ({ setReload, url }) => {
  console.log(url)
  const [isOpen, setIsOpen] = useState(false);

  const handleDataDelete = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    try {
      const response = await axiosInstance.delete(url, { withCredentials: false });
      if (response.status === 200) {
        setIsOpen(false);
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
  };

  return (
    <AlertDialog open={isOpen} onClose={() => setIsOpen(false)}>
      <AlertDialogTrigger>
        <div
          onClick={() => setIsOpen(true)}
          className="text-red-700 ml-2 cursor-pointer py-1 hover:text-red-800 transition-colors"
          title="Delete"
        >
          <Trash2 size={20} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-5 customScrollbar text-center text-gray-900">
            <h3 className="text-2xl font-bold">Are Your sure ?</h3>
            <h3 className="text-lg font-semibold">
              It will be Deleted Permanently
            </h3>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleDataDelete} variant={"destructive"}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDataModal;
