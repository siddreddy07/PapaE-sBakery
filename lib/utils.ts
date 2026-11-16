import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Text colour that stays readable on a given #hex background. */
export function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const luma =
    (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return luma > 0.6 ? "#3B1E1A" : "#FFF6F1"
}
