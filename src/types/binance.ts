export interface TickerPrice {
  symbol: string
  price: string
}

export interface FundingRateInfo {
  symbol: string
  markPrice: string
  indexPrice: string
  estimatedSettlePrice: string
  lastFundingRate: string
  interestRate: string
  nextFundingTime: number
  time: number
}

export interface OpenInterestInfo {
  symbol: string
  openInterest: string
  time: number
}

export interface KlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  trades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
  ignored: string
}

export interface HistoricalFundingRate {
  symbol: string
  fundingRate: string
  fundingTime: number
}

export interface HistoricalOpenInterest {
  symbol: string
  sumOpenInterest: string
  sumOpenInterestValue: string
  timestamp: number
}

export interface FundingRateStats {
  timestamp: string
  highestRates: Array<{ symbol: string, rate: number }>
  lowestRates: Array<{ symbol: string, rate: number }>
  biggestIncreases: Array<{ symbol: string, change: number }>
  biggestDecreases: Array<{ symbol: string, change: number }>
  previousRates: Record<string, number>
}
