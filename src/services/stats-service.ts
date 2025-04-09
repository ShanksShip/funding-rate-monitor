"use client"

import { FundingRateStats } from "@/types/binance"

// Constants
const FUTURES_BASE_URL = "https://fapi.binance.com"

// Helper to get previous funding rates from localStorage
const loadPreviousRates = (): Record<string, number> => {
  if (typeof window === "undefined") return {}

  try {
    const data = localStorage.getItem("previous_funding_rates")
    if (data) {
      return JSON.parse(data) as Record<string, number>
    }
    return {}
  } catch (error) {
    console.error("Error loading previous rates from localStorage:", error)
    return {}
  }
}

// Helper to save previous funding rates to localStorage
const savePreviousRates = (rates: Record<string, number>): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("previous_funding_rates", JSON.stringify(rates))
  } catch (error) {
    console.error("Error saving previous rates to localStorage:", error)
  }
}

/**
 * Gets all USDT perpetual symbols
 */
export const getUsdtPerpetualSymbols = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${FUTURES_BASE_URL}/fapi/v1/exchangeInfo`)

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange info: ${response.statusText}`)
    }

    const data = await response.json()

    const usdtSymbols = data.symbols
      .filter(
        (symbolInfo: any) =>
          symbolInfo.symbol.endsWith("USDT") &&
          symbolInfo.status === "TRADING" &&
          symbolInfo.contractType === "PERPETUAL"
      )
      .map((symbolInfo: any) => symbolInfo.symbol)

    return usdtSymbols
  } catch (error) {
    console.error("Error fetching USDT perpetual symbols:", error)
    return []
  }
}

/**
 * Gets funding rates for all USDT pairs
 */
export const getAllFundingRates = async (): Promise<Record<string, number>> => {
  try {
    const response = await fetch(`${FUTURES_BASE_URL}/fapi/v1/premiumIndex`)

    if (!response.ok) {
      throw new Error(`Failed to fetch funding rates: ${response.statusText}`)
    }

    const data = await response.json()

    const fundingRates: Record<string, number> = {}

    for (const item of data) {
      if (item.symbol.endsWith("USDT")) {
        fundingRates[item.symbol] = parseFloat(item.lastFundingRate)
      }
    }

    return fundingRates
  } catch (error) {
    console.error("Error fetching all funding rates:", error)
    return {}
  }
}

/**
 * Gets top N symbols by funding rate
 */
const getTopN = (
  rates: Record<string, number>,
  n: number,
  reverse: boolean = true
): Array<{ symbol: string; rate: number }> => {
  return Object.entries(rates)
    .sort(([, a], [, b]) => (reverse ? b - a : a - b))
    .slice(0, n)
    .map(([symbol, rate]) => ({ symbol, rate }))
}

/**
 * Gets biggest changes in funding rates
 */
const getBiggestChanges = (
  current: Record<string, number>,
  previous: Record<string, number>,
  n: number,
  increasing: boolean = true
): Array<{ symbol: string; change: number }> => {
  const changes: Record<string, number> = {}

  for (const [symbol, rate] of Object.entries(current)) {
    if (symbol in previous) {
      const change = rate - previous[symbol]
      if ((increasing && change > 0) || (!increasing && change < 0)) {
        changes[symbol] = change
      }
    }
  }

  return Object.entries(changes)
    .sort(([, a], [, b]) => (increasing ? b - a : a - b))
    .slice(0, n)
    .map(([symbol, change]) => ({ symbol, change }))
}

/**
 * Updates funding rate statistics and saves to local storage
 */
export const updateFundingRateStats =
  async (): Promise<FundingRateStats | null> => {
    try {
      // Get current rates
      const currentRates = await getAllFundingRates()

      if (Object.keys(currentRates).length === 0) {
        console.error("Failed to get funding rates, skipping update")
        return null
      }

      // Get previous rates
      const previousRates = loadPreviousRates()

      // Calculate statistics
      const highestRates = getTopN(currentRates, 5, true)
      const lowestRates = getTopN(currentRates, 5, false)

      // Calculate changes if we have previous rates
      const biggestIncreases =
        Object.keys(previousRates).length > 0
          ? getBiggestChanges(currentRates, previousRates, 5, true)
          : []

      const biggestDecreases =
        Object.keys(previousRates).length > 0
          ? getBiggestChanges(currentRates, previousRates, 5, false)
          : []

      // Create stats object
      const timestamp = new Date().toISOString()
      const stats: FundingRateStats = {
        timestamp,
        highestRates,
        lowestRates,
        biggestIncreases,
        biggestDecreases,
        previousRates: currentRates,
      }

      // Save previous rates to storage for next comparison
      savePreviousRates(currentRates)

      return stats
    } catch (error) {
      console.error("Error updating funding rate stats:", error)
      return null
    }
  }
