"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { AppState, SymbolData } from "@/types/app"
// Constants
const DEFAULT_SYMBOL1 = "BTCUSDT"
const DEFAULT_SYMBOL2 = "ETHUSDT"
const HOURS_TO_DISPLAY = 4

const createEmptySymbolData = (symbol: string): SymbolData => ({
  symbol,
  timestamps: [],
  spotPrices: [],
  futuresPrices: [],
  premiums: [],
  fundingRates: [],
  openInterest: [],
  lastFundingRate: null,
  isHistoricalDataLoaded: false,
  isRunning: false,
})

// Create store with persistence
const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      symbol1: DEFAULT_SYMBOL1,
      symbol2: DEFAULT_SYMBOL2,
      symbol1Data: createEmptySymbolData(DEFAULT_SYMBOL1),
      symbol2Data: createEmptySymbolData(DEFAULT_SYMBOL2),
      isLoading: false,
      error: null,

      // Set symbol1
      setSymbol1: (symbol: string) => {
        set({
          symbol1: symbol,
          symbol1Data: createEmptySymbolData(symbol),
        })
      },

      // Set symbol2
      setSymbol2: (symbol: string) => {
        set({
          symbol2: symbol,
          symbol2Data: createEmptySymbolData(symbol),
        })
      },

      // Toggle running state for symbol1
      toggleSymbol1Running: async () => {
        const { symbol1, symbol1Data } = get()
        const newRunningState = !symbol1Data.isRunning

        // Update running state
        set((state) => ({
          symbol1Data: {
            ...state.symbol1Data,
            isRunning: newRunningState,
          },
        }))

        // If starting monitoring, load historical data
        if (newRunningState && !symbol1Data.isHistoricalDataLoaded) {
          await get().loadHistoricalData(symbol1, "symbol1Data")
        }
      },

      // Toggle running state for symbol2
      toggleSymbol2Running: async () => {
        const { symbol2, symbol2Data } = get()
        const newRunningState = !symbol2Data.isRunning

        // Update running state
        set((state) => ({
          symbol2Data: {
            ...state.symbol2Data,
            isRunning: newRunningState,
          },
        }))

        // If starting monitoring, load historical data
        if (newRunningState && !symbol2Data.isHistoricalDataLoaded) {
          await get().loadHistoricalData(symbol2, "symbol2Data")
        }
      },

      // Load historical data for a symbol
      loadHistoricalData: async (
        symbol: string,
        dataKey: "symbol1Data" | "symbol2Data"
      ) => {
        set({ isLoading: true, error: null })

        try {
          // We need to dynamically import these to avoid server-side issues
          const {
            fetchHistoricalKlines,
            fetchHistoricalFundingRates,
            fetchHistoricalOpenInterest,
            fetchFundingRate,
            fetchOpenInterest,
          } = await import("@/services/binance-api")

          // Load historical klines
          const klinesResult = await fetchHistoricalKlines(symbol)
          if (!klinesResult) {
            throw new Error(`Failed to load historical data for ${symbol}`)
          }

          const [timestamps, spotPrices, futuresPrices, premiums] = klinesResult

          // Load historical funding rates
          const fundingResult = await fetchHistoricalFundingRates(symbol)
          let fundingRates: number[] = []

          if (fundingResult) {
            const [fundingTimestamps, rates] = fundingResult

            // Map funding rates to timestamps
            fundingRates = timestamps.map((ts) => {
              // Find closest funding rate timestamp
              let closestIdx = 0
              let minDiff = Infinity

              for (let i = 0; i < fundingTimestamps.length; i++) {
                const diff = Math.abs(
                  ts.getTime() - fundingTimestamps[i].getTime()
                )
                if (diff < minDiff) {
                  minDiff = diff
                  closestIdx = i
                }
              }

              // Use the closest funding rate or default to 0
              return closestIdx < rates.length ? rates[closestIdx] : 0
            })
          } else {
            fundingRates = new Array(timestamps.length).fill(0)
          }

          // Load historical open interest
          const oiResult = await fetchHistoricalOpenInterest(symbol)
          let openInterest: number[] = []

          if (oiResult) {
            const [oiTimestamps, oi] = oiResult

            // Map open interest to timestamps
            openInterest = timestamps.map((ts) => {
              // Find closest open interest timestamp
              let closestIdx = 0
              let minDiff = Infinity

              for (let i = 0; i < oiTimestamps.length; i++) {
                const diff = Math.abs(ts.getTime() - oiTimestamps[i].getTime())
                if (diff < minDiff) {
                  minDiff = diff
                  closestIdx = i
                }
              }

              // Use the closest open interest or default to 0
              return closestIdx < oi.length ? oi[closestIdx] : 0
            })
          } else {
            openInterest = new Array(timestamps.length).fill(0)
          }

          // Get current funding rate and open interest
          const fundingRate = await fetchFundingRate(symbol)
          const currentOi = await fetchOpenInterest(symbol)

          // Update state
          set((state) => ({
            isLoading: false,
            [dataKey]: {
              ...state[dataKey],
              timestamps,
              spotPrices,
              futuresPrices,
              premiums,
              fundingRates,
              openInterest,
              lastFundingRate: fundingRate,
              isHistoricalDataLoaded: true,
            },
          }))

          return true
        } catch (error) {
          console.error(`Error loading historical data for ${symbol}:`, error)
          set({
            isLoading: false,
            error: `Failed to load historical data for ${symbol}`,
          })

          // Also update running state to false
          set((state) => ({
            [dataKey]: {
              ...state[dataKey],
              isRunning: false,
            },
          }))

          return false
        }
      },

      // Update data for a symbol
      updateSymbolData: async (
        symbol: string,
        dataKey: "symbol1Data" | "symbol2Data"
      ) => {
        const state = get()
        const symbolData = state[dataKey]

        if (!symbolData.isRunning) {
          return null
        }

        try {
          // We need to dynamically import these to avoid server-side issues
          const {
            fetchSpotPrice,
            fetchFuturesPrice,
            fetchFundingRate,
            fetchOpenInterest,
          } = await import("@/services/binance-api")

          // Get current time
          const now = new Date()

          // Fetch current prices and rates
          const spotPrice = await fetchSpotPrice(symbol)
          const futuresPrice = await fetchFuturesPrice(symbol)
          const fundingRate = await fetchFundingRate(symbol)
          const openInterest = await fetchOpenInterest(symbol)

          if (spotPrice === null || futuresPrice === null) {
            return null
          }

          // Calculate premium
          const premium = ((futuresPrice - spotPrice) / spotPrice) * 100

          // Update data arrays
          const newTimestamps = [...symbolData.timestamps, now]
          const newSpotPrices = [...symbolData.spotPrices, spotPrice]
          const newFuturesPrices = [...symbolData.futuresPrices, futuresPrice]
          const newPremiums = [...symbolData.premiums, premium]

          // Update funding rates
          let newFundingRates = [...symbolData.fundingRates]
          if (fundingRate !== null) {
            newFundingRates.push(fundingRate * 100) // Convert to percentage
          } else if (newFundingRates.length > 0) {
            newFundingRates.push(newFundingRates[newFundingRates.length - 1])
          } else {
            newFundingRates.push(0)
          }

          // Update open interest
          let newOpenInterest = [...symbolData.openInterest]
          if (openInterest !== null) {
            newOpenInterest.push(openInterest)
          } else if (newOpenInterest.length > 0) {
            newOpenInterest.push(newOpenInterest[newOpenInterest.length - 1])
          } else {
            newOpenInterest.push(0)
          }

          // Clean up old data - keep only data from the last HOURS_TO_DISPLAY hours
          const cutoffTime = new Date(
            now.getTime() - HOURS_TO_DISPLAY * 60 * 60 * 1000
          )

          if (newTimestamps.length > 1 && newTimestamps[0] < cutoffTime) {
            // Find the first timestamp that's not older than cutoffTime
            const validIndices = newTimestamps.findIndex(
              (ts) => ts >= cutoffTime
            )

            if (validIndices !== -1) {
              const startIdx = validIndices

              // Update all arrays to keep only valid data
              const updatedTimestamps = newTimestamps.slice(startIdx)
              const updatedSpotPrices = newSpotPrices.slice(startIdx)
              const updatedFuturesPrices = newFuturesPrices.slice(startIdx)
              const updatedPremiums = newPremiums.slice(startIdx)
              const updatedFundingRates = newFundingRates.slice(startIdx)
              const updatedOpenInterest = newOpenInterest.slice(startIdx)

              // Update state
              set({
                [dataKey]: {
                  ...symbolData,
                  timestamps: updatedTimestamps,
                  spotPrices: updatedSpotPrices,
                  futuresPrices: updatedFuturesPrices,
                  premiums: updatedPremiums,
                  fundingRates: updatedFundingRates,
                  openInterest: updatedOpenInterest,
                  lastFundingRate: fundingRate,
                },
              })

              return {
                spotPrice,
                futuresPrice,
                premium,
                fundingRate,
                openInterest,
              }
            }
          }

          // If we don't need to trim old data, just update with new data
          set({
            [dataKey]: {
              ...symbolData,
              timestamps: newTimestamps,
              spotPrices: newSpotPrices,
              futuresPrices: newFuturesPrices,
              premiums: newPremiums,
              fundingRates: newFundingRates,
              openInterest: newOpenInterest,
              lastFundingRate: fundingRate,
            },
          })

          return {
            spotPrice,
            futuresPrice,
            premium,
            fundingRate,
            openInterest,
          }
        } catch (error) {
          console.error(`Error updating data for ${symbol}:`, error)
          return null
        }
      },
    }),
    {
      name: "funding-monitor-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the basic state - we'll reload the data when needed
      partialize: (state) => ({
        symbol1: state.symbol1,
        symbol2: state.symbol2,
      }),
    }
  )
)

export default useAppStore
