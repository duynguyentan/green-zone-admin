import dayjs from "dayjs";

/**
 * Format date to "DD/MM/YY, HH:mm"
 * @param date - Date string or object
 * @returns formatted string
 */
export const formatDate = (date: string | Date): string => {
  return dayjs(date).format("DD/MM/YY, HH:mm");
};
