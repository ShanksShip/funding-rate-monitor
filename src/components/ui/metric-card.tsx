"use client"

import React from "react"
import { cn } from "@/utils/cn"

interface MetricCardProps {
  label: string
  value: string | number
  indicator?: "positive" | "negative" | "neutral"
  className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  indicator = "neutral",
  className,
}) => {
  const indicatorColor = {
    positive: "text-success",
    negative: "text-danger",
    neutral: "text-gray-600 dark:text-gray-300",
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm",
        "border border-gray-200 dark:border-gray-700",
        "flex flex-col justify-between min-h-[90px]",
        className
      )}
    >
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </div>
      <div
        className={cn(
          "text-2xl font-bold",
          indicatorColor[indicator],
          value === "N/A" && "opacity-50"
        )}
      >
        {value}
      </div>
    </div>
  )
}
