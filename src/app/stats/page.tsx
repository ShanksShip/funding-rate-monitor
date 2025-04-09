import { MainLayout } from "@/components/layout/main-layout"
import { StatsDashboard } from "@/components/stats-dashboard"

export default function StatsPage() {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">资金费率统计</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          查看币安所有永续合约的最新资金费率统计数据
        </p>
      </div>

      <StatsDashboard />
    </MainLayout>
  )
}
