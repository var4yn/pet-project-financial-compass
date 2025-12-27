import { TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/formatters'
import type { PeriodSummary } from '@/types'

interface SummaryCardsProps {
  summary: PeriodSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Доходы',
      value: summary.total_income,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Расходы',
      value: summary.total_expense,
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Баланс',
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-green-600' : 'text-red-600',
      bg: summary.balance >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: 'Транзакций',
      value: summary.transaction_count,
      icon: Receipt,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      isCurrency: false,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="flex items-center gap-4">
          <div className={`rounded-xl p-3 ${card.bg}`}>
            <card.icon className={`h-6 w-6 ${card.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className={`text-xl font-bold ${card.color}`}>
              {card.isCurrency === false
                ? card.value
                : formatCurrency(card.value as number)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}