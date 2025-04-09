import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "资金费率监控系统",
  description: "用于监控加密货币资金费率和溢价的工具",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
