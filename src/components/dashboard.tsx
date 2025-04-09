"use client"

import React, { useCallback } from "react"
import { SymbolMonitor } from "./symbol-monitor"
import { SymbolSearch } from "./symbol-search"
import { ClientOnly } from "./client-only"
import useAppStore from "@/store/app-store"

export default function Dashboard() {
  const {
    symbol1,
    symbol2,
    symbol1Data,
    symbol2Data,
    setSymbol1,
    setSymbol2,
    toggleSymbol1Running,
    toggleSymbol2Running,
    updateSymbolData,
  } = useAppStore()

  const updateSymbol1Data = useCallback(async () => {
    await updateSymbolData(symbol1, "symbol1Data")
  }, [symbol1, updateSymbolData])

  const updateSymbol2Data = useCallback(async () => {
    await updateSymbolData(symbol2, "symbol2Data")
  }, [symbol2, updateSymbolData])

  return (
    <ClientOnly fallback={<div className="p-4">正在加载面板...</div>}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">资金费率策略监控</h1>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <p className="mb-4">
            监控加密货币资金费率、溢价和持仓量，以识别潜在的交易机会。
          </p>

          <div className="flex flex-wrap gap-4">
            <SymbolSearch
              onSelect={setSymbol1}
              buttonText={`设置币种1 (当前: ${symbol1})`}
              variant="primary"
            />

            <SymbolSearch
              onSelect={setSymbol2}
              buttonText={`设置币种2 (当前: ${symbol2})`}
              variant="secondary"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <SymbolMonitor
          symbolData={symbol1Data}
          toggleRunning={toggleSymbol1Running}
          updateData={updateSymbol1Data}
          index={1}
        />

        <SymbolMonitor
          symbolData={symbol2Data}
          toggleRunning={toggleSymbol2Running}
          updateData={updateSymbol2Data}
          index={2}
        />
      </div>
    </ClientOnly>
  )
}
