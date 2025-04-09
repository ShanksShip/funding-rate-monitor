import { FundingRateStats } from '@/types/binance'

const STATS_KEY = 'funding_rate_stats'
const PREVIOUS_RATES_KEY = 'previous_funding_rates'

/**
 * Saves funding rate statistics to local storage
 */
export const saveFundingRateStats = (stats: FundingRateStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Error saving funding rate stats to local storage:', error)
  }
}

/**
 * Loads funding rate statistics from local storage
 */
export const loadFundingRateStats = (): FundingRateStats | null => {
  try {
    const data = localStorage.getItem(STATS_KEY)
    if (data) {
      return JSON.parse(data) as FundingRateStats
    }
    return null
  } catch (error) {
    console.error('Error loading funding rate stats from local storage:', error)
    return null
  }
}

/**
 * Saves previous funding rates to local storage
 */
export const savePreviousRates = (rates: Record<string, number>): void => {
  try {
    localStorage.setItem(PREVIOUS_RATES_KEY, JSON.stringify(rates))
  } catch (error) {
    console.error('Error saving previous rates to local storage:', error)
  }
}

/**
 * Loads previous funding rates from local storage
 */
export const loadPreviousRates = (): Record<string, number> => {
  try {
    const data = localStorage.getItem(PREVIOUS_RATES_KEY)
    if (data) {
      return JSON.parse(data) as Record<string, number>
    }
    return {}
  } catch (error) {
    console.error('Error loading previous rates from local storage:', error)
    return {}
  }
}
