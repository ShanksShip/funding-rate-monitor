"use client"

import React, { useEffect } from "react"
import { DataTable } from "./ui/data-table"
import { Button } from "./ui/button"
import { formatDate, formatPercentage } from "@/utils/format"
import { ClientOnly } from "./client-only"
import useStatsStore from "@/store/stats-store"

export const StatsDashboard: React.FC = () => {
  const { stats, lastUpdated, isLoading, loadStats, updateStats } =
    useStatsStore()

  // Load stats on mount
  useEffect(() => {
    loadStats()

    // Update stats every 60 seconds
    const interval = setInterval(() => {
      updateStats()
    }, 60000)

    return () => clearInterval(interval)
  }, [loadStats, updateStats])

  const highestRatesColumns = [
    {
      key: "symbol",
      header: "币种",
      render: (item: { symbol: string; rate: number }) => (
        <div className="font-medium flex items-center">
          <span className="h-2 w-2 bg-success rounded-full mr-2" />
          {item.symbol}
        </div>
      ),
    },
    {
      key: "rate",
      header: "费率",
      align: "right" as const,
      render: (item: { symbol: string; rate: number }) => (
        <span className="font-mono">{formatPercentage(item.rate * 100)}</span>
      ),
    },
  ]

  const lowestRatesColumns = [
    {
      key: "symbol",
      header: "币种",
      render: (item: { symbol: string; rate: number }) => (
        <div className="font-medium flex items-center">
          <span className="h-2 w-2 bg-danger rounded-full mr-2" />
          {item.symbol}
        </div>
      ),
    },
    {
      key: "rate",
      header: "费率",
      align: "right" as const,
      render: (item: { symbol: string; rate: number }) => (
        <span className="font-mono">{formatPercentage(item.rate * 100)}</span>
      ),
    },
  ]

  const increasesColumns = [
    { key: "symbol", header: "币种" },
    {
      key: "change",
      header: "变化",
      align: "right" as const,
      render: (item: { symbol: string; change: number }) => (
        <span className="font-mono text-success">
          {formatPercentage(item.change * 100)}
        </span>
      ),
    },
  ]

  const decreasesColumns = [
    { key: "symbol", header: "币种" },
    {
      key: "change",
      header: "变化",
      align: "right" as const,
      render: (item: { symbol: string; change: number }) => (
        <span className="font-mono text-danger">
          {formatPercentage(item.change * 100)}
        </span>
      ),
    },
  ]

  return (
    <ClientOnly fallback={<div className="p-4">正在加载统计数据...</div>}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📊 统计数据</h2>

          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                上次更新时间: {formatDate(lastUpdated)}
              </span>
            )}

            <Button
              onClick={() => updateStats()}
              variant="primary"
              size="sm"
              isLoading={isLoading}
            >
              刷新数据
            </Button>
          </div>
        </div>

        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">😱 最高费率</h3>
              <DataTable
                data={stats.highestRates}
                columns={highestRatesColumns}
                keyField="symbol"
                emptyMessage="暂无数据"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">😍 最低费率</h3>
              <DataTable
                data={stats.lowestRates}
                columns={lowestRatesColumns}
                keyField="symbol"
                emptyMessage="暂无数据"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">⬆️ 最大增长</h3>
              <DataTable
                data={stats.biggestIncreases}
                columns={increasesColumns}
                keyField="symbol"
                emptyMessage="暂无数据"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">⬇️ 最大降低</h3>
              <DataTable
                data={stats.biggestDecreases}
                columns={decreasesColumns}
                keyField="symbol"
                emptyMessage="暂无数据"
              />
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            {isLoading ? "正在加载统计数据..." : "暂无统计数据"}
          </div>
        )}
      </div>
    </ClientOnly>
  )
}
