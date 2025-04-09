"use client"

import React, { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface Column<T> {
  key: keyof T | string
  header: string
  width?: string
  align?: "left" | "right" | "center"
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  className?: string
  rowClassName?: string | ((item: T, index: number) => string)
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  className,
  rowClassName,
  emptyMessage = "暂无数据",
}: DataTableProps<T>) {
  // Early return for empty data
  if (data.length === 0) {
    return <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className={cn(
                  "px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400",
                  column.align === "right" && "text-right",
                  column.align === "center" && "text-center",
                  column.width
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {data.map((item, index) => {
            const getRowClass =
              typeof rowClassName === "function"
                ? rowClassName(item, index)
                : rowClassName

            const keyValue = String(item[keyField])

            return (
              <tr
                key={keyValue}
                className={cn(
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  getRowClass
                )}
              >
                {columns.map((column) => {
                  const cellKey = `${keyValue}-${String(column.key)}`
                  return (
                    <td
                      key={cellKey}
                      className={cn(
                        "whitespace-nowrap px-4 py-3 text-sm",
                        column.align === "right" && "text-right",
                        column.align === "center" && "text-center"
                      )}
                    >
                      {column.render
                        ? column.render(item)
                        : (item[column.key as keyof T] as unknown as ReactNode)}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
