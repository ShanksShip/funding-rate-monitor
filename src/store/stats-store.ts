"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { FundingRateStats } from "@/types/binance"

interface StatsState {
  stats: FundingRateStats | null
  lastUpdated: Date | null
  isLoading: boolean
  error: string | null
  loadStats: () => Promise<void>
  updateStats: () => Promise<void>
}

// Helper for loading stats from localStorage
const loadStatsFromStorage = (): FundingRateStats | null => {
  if (typeof window === "undefined") return null

  try {
    const statsJson = localStorage.getItem("funding_rate_stats")
    if (statsJson) {
      const stats = JSON.parse(statsJson)
      return stats
    }
    return null
  } catch (error) {
    console.error("Error loading stats from localStorage:", error)
    return null
  }
}

// Helper for saving stats to localStorage
const saveStatsToStorage = (stats: FundingRateStats): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("funding_rate_stats", JSON.stringify(stats))
  } catch (error) {
    console.error("Error saving stats to localStorage:", error)
  }
}

const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      stats: null,
      lastUpdated: null,
      isLoading: false,
      error: null,

      // Load stats from local storage
      loadStats: async () => {
        set({ isLoading: true, error: null })

        try {
          // Load stats from local storage
          const stats = loadStatsFromStorage()

          if (stats) {
            set({
              stats,
              lastUpdated: new Date(),
              isLoading: false,
            })
          } else {
            // If no stats in storage, update them
            await useStatsStore.getState().updateStats()
          }
        } catch (error) {
          console.error("Error loading stats:", error)
          set({
            isLoading: false,
            error: "Failed to load stats",
          })
        }
      },

      // Update stats
      updateStats: async () => {
        set({ isLoading: true, error: null })

        try {
          // Dynamically import to avoid SSR issues
          const { updateFundingRateStats } = await import(
            "@/services/stats-service"
          )

          const stats = await updateFundingRateStats()

          if (stats) {
            // Save to storage
            saveStatsToStorage(stats)

            set({
              stats,
              lastUpdated: new Date(),
              isLoading: false,
            })
          } else {
            set({
              isLoading: false,
              error: "Failed to update stats",
            })
          }
        } catch (error) {
          console.error("Error updating stats:", error)
          set({
            isLoading: false,
            error: "Failed to update stats",
          })
        }
      },
    }),
    {
      name: "funding-stats-storage",
      storage: createJSONStorage(() => localStorage),
      // Only store the timestamp to avoid redundancy
      partialize: (state) => ({
        lastUpdated: state.lastUpdated,
      }),
    }
  )
)

export default useStatsStore
