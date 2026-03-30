// @ts-nocheck
import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance";

export const createData = async (url, formData, setReload, resetForm) => {
  const toastId = toast.loading("Creating...");
  try {
    const response = await axiosInstance.post(url, formData);

    const data = response.data;
    console.log("Response Data:", data);

    if (data?.success) {
      toast.success("Created successfully");
      if (setReload) {
        setReload((prev) => prev + 1);
      }
      if (resetForm) {
        resetForm();
      }
      return data;
    } else {
      console.log(data);
      toast.error(data.message || "Failed to Create");
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.message || "An unexpected error occurred";
    toast.error(errorMessage);
    console.error("Error:", error);
  } finally {
    toast.dismiss(toastId);
  }
};
