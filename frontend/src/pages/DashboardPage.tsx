import { useState } from 'react'
import { format, subMonths, startOfMonth } from 'date-fns'
import { useAnalyticsReport } from '@/hooks/useAnalytics'
import { SummaryCards } from '@/components/analytics/SummaryCards'
import { ExpenseChart } from '@/components/analytics/ExpenseChart'
import { TrendChart } from '@/components/analytics/TrendChart'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'

type PeriodType = '1m' | '3m' | '6m' | '12m'

export function DashboardPage() {
  const [period, setPeriod] = useState<PeriodType>('12m')
  
  // Вычисляем даты на основе выбранного периода
  const today = new Date()
  const periodMonths: Record<PeriodType, number> = {
    '1m': 0,
    '3m': 2,
    '6m': 5,
    '12m': 11,
  }
  
  const dateFrom = format(startOfMonth(subMonths(today, periodMonths[period])), 'yyyy-MM-dd')
  const dateTo = format(today, 'yyyy-MM-dd')
  
  const { data: report, isLoading } = useAnalyticsReport(dateFrom, dateTo)

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-lg">Нет данных</p>
        <p className="text-sm mt-2">Добавьте первую транзакцию!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        
        {/* Period Selector */}
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { value: '1m', label: '1 мес' },
            { value: '3m', label: '3 мес' },
            { value: '6m', label: '6 мес' },
            { value: '12m', label: '12 мес' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setPeriod(item.value as PeriodType)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === item.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={report.summary} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseChart data={report.expense_by_category} title="Расходы по категориям" />
        <ExpenseChart data={report.income_by_category} title="Доходы по категориям" />
      </div>

      {/* Trend Chart */}
      {report.monthly_trends.length > 0 ? (
        <TrendChart data={report.monthly_trends} />
      ) : (
        <Card>
          <div className="flex h-72 items-center justify-center text-gray-500">
            Недостаточно данных для отображения динамики
          </div>
        </Card>
      )}
    </div>
  )
}