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