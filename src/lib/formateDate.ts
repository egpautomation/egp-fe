// @ts-nocheck
import { format } from "date-fns";

export const formatDate = (dateString, formatType) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return format(date, formatType);
};
