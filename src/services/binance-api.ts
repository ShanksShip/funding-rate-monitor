import {
  TickerPrice,
  FundingRateInfo,
  OpenInterestInfo,
  HistoricalFundingRate,
  HistoricalOpenInterest,
} from '@/types/binance'

const SPOT_BASE_URL = 'https://api.binance.com'
const FUTURES_BASE_URL = 'https://fapi.binance.com'

export const fetchSpotPrice = async (symbol: string): Promise<number | null> => {
  try {
    const response = await fetch(
      `${SPOT_BASE_URL}/api/v3/ticker/price?symbol=${symbol}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch spot price: ${response.statusText}`)
    }

    const data = await response.json() as TickerPrice
    return parseFloat(data.price)
  } catch (error) {
    console.error(`Error fetching spot price for ${symbol}:`, error)
    return null
  }
}

export const fetchFuturesPrice = async (symbol: string): Promise<number | null> => {
  try {
    const response = await fetch(
      `${FUTURES_BASE_URL}/fapi/v1/ticker/price?symbol=${symbol}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch futures price: ${response.statusText}`)
    }

    const data = await response.json() as TickerPrice
    return parseFloat(data.price)
  } catch (error) {
    console.error(`Error fetching futures price for ${symbol}:`, error)
    return null
  }
}

export const fetchFundingRate = async (symbol: string): Promise<number | null> => {
  try {
    const response = await fetch(
      `${FUTURES_BASE_URL}/fapi/v1/premiumIndex?symbol=${symbol}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch funding rate: ${response.statusText}`)
    }

    const data = await response.json() as FundingRateInfo
    return parseFloat(data.lastFundingRate)
  } catch (error) {
    console.error(`Error fetching funding rate for ${symbol}:`, error)
    return null
  }
}

export const fetchOpenInterest = async (symbol: string): Promise<number | null> => {
  try {
    const response = await fetch(
      `${FUTURES_BASE_URL}/fapi/v1/openInterest?symbol=${symbol}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch open interest: ${response.statusText}`)
    }

    const data = await response.json() as OpenInterestInfo
    return parseFloat(data.openInterest)
  } catch (error) {
    console.error(`Error fetching open interest for ${symbol}:`, error)
    return null
  }
}

export const fetchHistoricalKlines = async (
  symbol: string,
  interval: string = '1m',
  hours: number = 4
): Promise<[Date[], number[], number[], number[]] | null> => {
  try {
    const endTime = new Date().getTime()
    const startTime = new Date(endTime - hours * 60 * 60 * 1000).getTime()

    const spotResponse = await fetch(
      `${SPOT_BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=240`
    )

    const futuresResponse = await fetch(
      `${FUTURES_BASE_URL}/fapi/v1/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=240`
    )

    if (!spotResponse.ok || !futuresResponse.ok) {
      throw new Error('Failed to fetch historical klines')
    }

    const spotData = await spotResponse.json() as any[]
    const futuresData = await futuresResponse.json() as any[]

    const timestamps: Date[] = []
    const spotPrices: number[] = []
    const futuresPrices: number[] = []
    const premiums: number[] = []

    const minLength = Math.min(spotData.length, futuresData.length)

    for (let i = 0; i < minLength; i++) {
      const timestamp = new Date(spotData[i][0])
      const spotClose = parseFloat(spotData[i][4])
      const futuresClose = parseFloat(futuresData[i][4])
      const premium = (futuresClose - spotClose) / spotClose * 100

      timestamps.push(timestamp)
      spotPrices.push(spotClose)
      futuresPrices.push(futuresClose)
      premiums.push(premium)
    }

    return [timestamps, spotPrices, futuresPrices, premiums]
  } catch (error) {
    console.error(`Error fetching historical klines for ${symbol}:`, error)
    return null
  }
}

export const fetchHistoricalFundingRates = async (
  symbol: string,
  hours: number = 4
): Promise<[Date[], number[]] | null> => {
  try {
    const endTime = new Date().getTime()
    const startTime = new Date(endTime - hours * 60 * 60 * 1000).getTime()

    const response = await fetch(
      `${FUTURES_BASE_URL}/fapi/v1/fundingRate?symbol=${symbol}&startTime=${startTime}&endTime=${endTime}&limit=240`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch historical funding rates: ${response.statusText}`)
    }

    const data = await response.json() as HistoricalFundingRate[]

    const timestamps: Date[] = []
    const fundingRates: number[] = []

    for (const item of data) {
      timestamps.push(new Date(item.fundingTime))
      fundingRates.push(parseFloat(item.fundingRate) * 100) // Convert to percentage
    }

    return [timestamps, fundingRates]
  } catch (error) {
    console.error(`Error fetching historical funding rates for ${symbol}:`, error)
    return null
  }
}

export const fetchHistoricalOpenInterest = async (
  symbol: string,
  period: string = '5m',
  hours: number = 4
): Promise<[Date[], number[]] | null> => {
  try {
    const endTime = new Date().getTime()
    const startTime = new Date(endTime - hours * 60 * 60 * 1000).getTime()

    const response = await fetch(
      `${FUTURES_BASE_URL}/futures/data/openInterestHist?symbol=${symbol}&period=${period}&startTime=${startTime}&endTime=${endTime}&limit=240`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch historical open interest: ${response.statusText}`)
    }

    const data = await response.json() as HistoricalOpenInterest[]

    const timestamps: Date[] = []
    const openInterests: number[] = []

    for (const item of data) {
      timestamps.push(new Date(item.timestamp))
      openInterests.push(parseFloat(item.sumOpenInterest))
    }

    return [timestamps, openInterests]
  } catch (error) {
    console.error(`Error fetching historical open interest for ${symbol}:`, error)
    return null
  }
}
