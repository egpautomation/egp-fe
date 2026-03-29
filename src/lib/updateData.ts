// @ts-nocheck

import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance";

export const updateData = async (url, data, setReload, resetForm) => {
  const toastId = toast.loading("Loading...");

  try {
    const response = await axiosInstance.put(url, data);

    if (response.data?.success) {
      toast.dismiss(toastId);
      toast.success("Success");
      if (setReload) {
        setReload((prev) => prev + 1);
      }
      if (resetForm) {
        resetForm();
      }
    } else {
      throw new Error(response.data?.message || "An unexpected error occurred");
    }
  } catch (error) {
    toast.dismiss(toastId);
    const errorMessage =
      error?.response?.data?.message || error?.message || "An unexpected error occurred";
    toast.error(errorMessage);
    console.error("Error:", error);
  } finally {
    toast.dismiss(toastId);
  }
};

export const patchData = async (url, data, setReload, resetForm) => {
  const toastId = toast.loading("Loading...");

  try {
    const response = await axiosInstance.patch(url, data);

    if (response.data?.success) {
      toast.dismiss(toastId);
      toast.success("Success");
      if (setReload) {
        setReload((prev) => prev + 1);
      }
      if (resetForm) {
        resetForm();
      }
    } else {
      throw new Error(response.data?.message || "An unexpected error occurred");
    }
  } catch (error) {
    toast.dismiss(toastId);
    const errorMessage =
      error?.response?.data?.message || error?.message || "An unexpected error occurred";
    toast.error(errorMessage);
    console.error("Error:", error);
  } finally {
    toast.dismiss(toastId);
  }
};
