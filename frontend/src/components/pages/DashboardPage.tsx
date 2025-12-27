import { useAnalyticsReport } from '@/hooks/useAnalytics'
import { SummaryCards } from '@/components/analytics/SummaryCards'
import { ExpenseChart } from '@/components/analytics/ExpenseChart'
import { TrendChart } from '@/components/analytics/TrendChart'
import { Spinner } from '@/components/ui/Spinner'

export function DashboardPage() {
  const { data: report, isLoading } = useAnalyticsReport()

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center text-gray-500">
        Нет данных. Добавьте первую транзакцию!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>

      {/* Summary Cards */}
      <SummaryCards summary={report.summary} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseChart data={report.expense_by_category} title="Расходы по категориям" />
        <ExpenseChart data={report.income_by_category} title="Доходы по категориям" />
      </div>

      {/* Trend Chart */}
      <TrendChart data={report.monthly_trends} />
    </div>
  )
}