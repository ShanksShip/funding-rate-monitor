"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { PlotParams } from "react-plotly.js"
import { cn } from "@/utils/cn"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface LineChartProps {
  data: {
    x: Date[]
    y: number[]
  }
  title?: string
  xAxisTitle?: string
  yAxisTitle?: string
  color?: string
  height?: number
  className?: string
  showZeroLine?: boolean
  rangeHours?: number
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  xAxisTitle,
  yAxisTitle,
  color = "#0072F5",
  height = 300,
  className,
  showZeroLine = false,
  rangeHours = 4,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg",
          className
        )}
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400">正在加载图表...</div>
      </div>
    )
  }

  // If no data, show empty state
  if (!data.x.length || !data.y.length) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg",
          className
        )}
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400">暂无数据可显示</div>
      </div>
    )
  }

  // Calculate xaxis range
  const now = new Date()
  const pastTime = new Date(now.getTime() - rangeHours * 60 * 60 * 1000)

  const plotConfig: Partial<PlotParams> = {
    data: [
      {
        type: "scatter",
        mode: "lines",
        x: data.x,
        y: data.y,
        line: { color, width: 2 },
        name: title || "数据系列",
      },
    ],
    layout: {
      title: title ? { text: title, font: { size: 16 } } : undefined,
      height,
      autosize: true,
      margin: { l: 40, r: 20, t: 40, b: 40 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: {
        title: xAxisTitle,
        range: [pastTime, now],
        gridcolor: "rgba(200,200,200,0.2)",
        automargin: true,
      },
      yaxis: {
        title: yAxisTitle,
        gridcolor: "rgba(200,200,200,0.2)",
        automargin: true,
      },
      shapes: showZeroLine
        ? [
            {
              type: "line",
              xref: "paper",
              x0: 0,
              x1: 1,
              y0: 0,
              y1: 0,
              line: {
                color: "rgba(100,100,100,0.5)",
                width: 1,
                dash: "dot",
              },
            },
          ]
        : undefined,
    },
    config: {
      responsive: true,
      displayModeBar: false,
    },
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg p-2 w-full overflow-hidden",
        className
      )}
    >
      <div className="w-full h-full" style={{ minHeight: height }}>
        <Plot
          {...(plotConfig as any)}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  )
}
