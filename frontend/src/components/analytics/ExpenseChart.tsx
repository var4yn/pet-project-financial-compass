import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/formatters'
import type { CategorySummary } from '@/types'

interface ExpenseChartProps {
  data: CategorySummary[]
  title?: string
}

export function ExpenseChart({ data, title = 'Расходы по категориям' }: ExpenseChartProps) {
  const chartData = data.map((item) => ({
    name: item.category_name,
    value: Number(item.total_amount),
    color: item.category_color || '#8884d8',
    icon: item.category_icon,
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <div className="flex h-64 items-center justify-center text-gray-500">
          Нет данных
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Legend
              formatter={(value, entry: any) =>
                `${entry.payload.icon || ''} ${value}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}