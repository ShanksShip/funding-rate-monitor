export interface ChartData {
  timestamps: Date[]
  spotPrices: number[]
  futuresPrices: number[]
  premiums: number[]
  fundingRates: number[]
  openInterest: number[]
}

export interface SymbolData extends ChartData {
  symbol: string
  lastFundingRate: number | null
  isHistoricalDataLoaded: boolean
  isRunning: boolean
}

export interface AppState {
  // State
  symbol1: string
  symbol2: string
  symbol1Data: SymbolData
  symbol2Data: SymbolData
  isLoading: boolean
  error: string | null

  // Actions
  setSymbol1: (symbol: string) => void
  setSymbol2: (symbol: string) => void
  toggleSymbol1Running: () => Promise<void>
  toggleSymbol2Running: () => Promise<void>
  loadHistoricalData: (
    symbol: string,
    dataKey: "symbol1Data" | "symbol2Data"
  ) => Promise<boolean>
  updateSymbolData: (
    symbol: string,
    dataKey: "symbol1Data" | "symbol2Data"
  ) => Promise<{
    spotPrice: number
    futuresPrice: number
    premium: number
    fundingRate: number | null
    openInterest: number | null
  } | null>
}

export interface FormatPriceOptions {
  decimals?: number
  addCommas?: boolean
}

export interface DataPoint {
  value: number
  timestamp: Date
}
