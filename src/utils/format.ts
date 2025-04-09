import { format } from "date-fns"
import { FormatPriceOptions } from "@/types/app"

/**
 * Formats a price with appropriate decimals and commas
 */
export const formatPrice = (
  price: number | null,
  options: FormatPriceOptions = {}
): string => {
  if (price === null) return "N/A"

  const { decimals = 2, addCommas = true } = options

  // Format based on price value - use more decimals for small prices
  const actualDecimals =
    price < 0.1 ? 6 : price < 1 ? 4 : price < 10 ? 3 : decimals

  // Format the number to fixed decimals
  let formattedPrice = price.toFixed(actualDecimals)

  // Remove trailing zeros
  formattedPrice = formattedPrice.replace(/\.?0+$/, (m) => (m === "." ? "" : m))

  // Add commas for thousands
  if (addCommas) {
    formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return formattedPrice
}

/**
 * Formats a percentage with appropriate sign
 */
export const formatPercentage = (percentage: number | null): string => {
  if (percentage === null) return "N/A"

  // Determine the color and sign
  const sign = percentage > 0 ? "+" : ""

  // Round to appropriate decimals
  const decimals =
    Math.abs(percentage) < 0.1 ? 4 : Math.abs(percentage) < 1 ? 3 : 2
  const roundedValue = percentage.toFixed(decimals)

  return `${sign}${roundedValue}%`
}

/**
 * Formats a date to a human-readable string
 */
export const formatDate = (date: Date): string => {
  return format(date, "MM/dd/yyyy, HH:mm:ss")
}

/**
 * Formats a date for chart display
 */
export const formatChartDate = (date: Date): string => {
  return format(date, "HH:mm")
}

/**
 * Formats a large number with K, M, B suffixes
 */
export const formatLargeNumber = (num: number | null): string => {
  if (num === null) return "N/A"

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B"
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M"
  }

  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K"
  }

  return num.toString()
}
