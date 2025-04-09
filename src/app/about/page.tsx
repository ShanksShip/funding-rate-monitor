import { MainLayout } from "@/components/layout/main-layout"

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">关于资金费率监控系统</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">这个工具是什么？</h2>
          <p className="mb-4">
            资金费率监控系统是一个帮助加密货币交易者监控和分析币安永续合约的资金费率、价格溢价和持仓量的工具。
          </p>
          <p>
            通过监控这些指标，交易者可以识别潜在的交易机会并实施资金费率套利策略。
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">理解资金费率</h2>
          <p className="mb-4">
            资金费率是多头或空头之间的定期支付，旨在使永续合约价格接近现货价格。
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>正资金费率：</strong>{" "}
              多头支付给空头。当永续合约交易价格高于现货价格时出现。
            </li>
            <li>
              <strong>负资金费率：</strong>{" "}
              空头支付给多头。当永续合约交易价格低于现货价格时出现。
            </li>
          </ul>
          <p>
            在币安上，资金费率通常每 8
            小时支付一次，并且会根据市场条件和情绪有显著变化。
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">交易策略</h2>
          <p className="mb-4">以下是一些利用资金费率数据的常见策略：</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>现货+空单策略：</strong>{" "}
              当资金费率为正时，做多现货同时做空合约，以赚取资金费用收入。
            </li>
            <li>
              <strong>反向现货+空单策略：</strong>{" "}
              当资金费率为负时，做空现货同时做多合约，以接收资金费用。
            </li>
            <li>
              <strong>资金费率套利：</strong>{" "}
              利用不同交易所或资产之间的资金费率差异进行套利。
            </li>
          </ol>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">免责声明</h2>
          <p className="mb-4">
            本工具仅供参考，不构成财务建议。交易加密货币衍生品涉及重大风险，并不适合所有投资者。
          </p>
          <p>
            在做出投资决策前，请务必进行自己的研究，并考虑咨询专业金融顾问。
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">版权声明</h2>
          <p className="mb-4">
            原 Python 版本由 Theclues 编写，源代码托管于{" "}
            <a
              href="https://github.com/iznake/Funding_rate_strategy_monitoring_system"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
            。
          </p>
          <p>
            当前版本由{" "}
            <a
              href="https://x.com/ShanksShip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Shanks
            </a>{" "}
            改编而来。
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
