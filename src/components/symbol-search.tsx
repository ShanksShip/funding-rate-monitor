"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { getUsdtPerpetualSymbols } from "@/services/stats-service"

interface SymbolSearchProps {
  onSelect: (symbol: string) => void
  buttonText?: string
  variant?: string
  placeholder?: string
}

export const SymbolSearch: React.FC<SymbolSearchProps> = ({
  onSelect,
  buttonText = "选择币种",
  variant = "primary",
  placeholder = "搜索币种...",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [symbols, setSymbols] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load symbols on mount
  useEffect(() => {
    const loadSymbols = async () => {
      setIsLoading(true)
      try {
        const symbolList = await getUsdtPerpetualSymbols()
        setSymbols(symbolList)
      } catch (error) {
        console.error("Error loading symbols:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen && symbols.length === 0) {
      loadSymbols()
    }
  }, [isOpen, symbols.length])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter symbols based on search term
  const filteredSymbols =
    searchTerm.trim() === ""
      ? symbols
      : symbols.filter((symbol) =>
          symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant={variant as any} onClick={() => setIsOpen(!isOpen)}>
        {buttonText}
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                正在加载币种...
              </div>
            ) : filteredSymbols.length > 0 ? (
              filteredSymbols.map((symbol) => (
                <button
                  key={symbol}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  onClick={() => {
                    onSelect(symbol)
                    setIsOpen(false)
                    setSearchTerm("")
                  }}
                >
                  {symbol}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">未找到币种</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
