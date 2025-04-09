"use client"

import React, { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"

interface NavItem {
  href: string
  label: string
  icon?: ReactNode
}

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { href: "/", label: "仪表盘", icon: "📊" },
    { href: "/stats", label: "统计数据", icon: "📈" },
    { href: "/about", label: "关于", icon: "ℹ️" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary">
                  🪙 资金费率监控系统
                </span>
              </Link>
            </div>

            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    pathname === item.href
                      ? "bg-primary-50 text-primary"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <span className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} 资金费率监控系统. 保留所有权利.</p>
            <p className="mt-1">
              由{" "}
              <a
                href="https://x.com/ShanksShip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Shanks
              </a>{" "}
              提供
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
