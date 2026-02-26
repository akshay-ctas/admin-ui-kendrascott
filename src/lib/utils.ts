import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export function generateSKU(productName: string, variant: any) {
  const namePart = productName.trim().substring(0, 3).toUpperCase();

  const colorPart = variant.color?.substring(0, 2).toUpperCase() || "XX";
  const sizePart = variant.size?.toString().padStart(2, "0") || "00";
  const randomPart = Math.floor(100 + Math.random() * 900);

  return `${namePart}-${colorPart}${sizePart}-${randomPart}`;
}

export const formatDate = (
  isoString: string | Date,
  locale: string = "en-IN",
): string => {
  if (!isoString) return "";

  const date = typeof isoString === "string" ? new Date(isoString) : isoString;

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};