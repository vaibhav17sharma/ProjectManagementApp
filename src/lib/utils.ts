import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date,
  type: "date" | "time" = "date",
  variant: "short" | "long" = "long",
) {
  if (type === "date") {
    if (variant === "short") {
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } else {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    }
  } else {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
}
