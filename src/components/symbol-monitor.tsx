"use client"

import React, { useEffect, useState } from "react"
import { formatDate, formatPercentage, formatPrice } from "@/utils/format"
import { MetricCard } from "./ui/metric-card"
import { LineChart } from "./charts/line-chart"
import { Button } from "./ui/button"
import { SymbolData } from "@/types/app"

interface SymbolMonitorProps {
  symbolData: SymbolData
  toggleRunning: () => Promise<void>
  updateData: () => Promise<void>
  index: 1 | 2
}

export const SymbolMonitor: React.FC<SymbolMonitorProps> = ({
  symbolData,
  toggleRunning,
  updateData,
  index,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update data every 10 seconds when running
  useEffect(() => {
    if (!symbolData.isRunning) return

    const updateInterval = setInterval(() => {
      updateData()
    }, 10000)

    return () => clearInterval(updateInterval)
  }, [symbolData.isRunning, updateData])

  const {
    symbol,
    isRunning,
    timestamps,
    spotPrices,
    futuresPrices,
    premiums,
    fundingRates,
    openInterest,
    lastFundingRate,
  } = symbolData

  // Get the latest data values
  const lastIdx = timestamps.length - 1
  const latestSpotPrice = lastIdx >= 0 ? spotPrices[lastIdx] : null
  const latestFuturesPrice = lastIdx >= 0 ? futuresPrices[lastIdx] : null
  const latestPremium = lastIdx >= 0 ? premiums[lastIdx] : null
  const latestOpenInterest = lastIdx >= 0 ? openInterest[lastIdx] : null

  // Determine premium indicator
  const premiumIndicator =
    latestPremium === null
      ? "neutral"
      : latestPremium > 0
        ? "positive"
        : "negative"

  // Determine funding rate indicator
  const fundingIndicator =
    lastFundingRate === null
      ? "neutral"
      : lastFundingRate > 0
        ? "positive"
        : "negative"

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center">
          {index === 1 ? "1️⃣" : "2️⃣"} {symbol}
          {isRunning && (
            <span className="ml-2 h-2 w-2 bg-success rounded-full animate-pulse" />
          )}
        </h2>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">{formatDate(currentTime)}</div>

          <Button
            onClick={toggleRunning}
            variant={isRunning ? "danger" : "success"}
            size="sm"
          >
            {isRunning ? "停止监控" : "开始监控"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard
          label="现货价格"
          value={formatPrice(latestSpotPrice)}
          indicator="neutral"
        />

        <MetricCard
          label="期货价格"
          value={formatPrice(latestFuturesPrice)}
          indicator="neutral"
        />

        <MetricCard
          label="溢价"
          value={latestPremium ? formatPercentage(latestPremium) : "暂无"}
          indicator={premiumIndicator}
        />

        <MetricCard
          label="资金费率"
          value={
            lastFundingRate ? formatPercentage(lastFundingRate * 100) : "暂无"
          }
          indicator={fundingIndicator}
        />

        <MetricCard
          label="持仓量"
          value={
            latestOpenInterest ? latestOpenInterest.toLocaleString() : "暂无"
          }
          indicator="neutral"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="w-full overflow-hidden">
          <LineChart
            data={{ x: timestamps, y: premiums }}
            title="价格溢价 (%)"
            yAxisTitle="溢价 (%)"
            color="green"
            showZeroLine
            height={220}
          />
        </div>

        <div className="w-full overflow-hidden">
          <LineChart
            data={{ x: timestamps, y: fundingRates }}
            title="资金费率 (%)"
            yAxisTitle="费率 (%)"
            color="red"
            showZeroLine
            height={220}
          />
        </div>

        <div className="w-full overflow-hidden">
          <LineChart
            data={{ x: timestamps, y: openInterest }}
            title="持仓量"
            yAxisTitle="数量"
            color="blue"
            height={220}
          />
        </div>
      </div>
    </div>
  )
}
