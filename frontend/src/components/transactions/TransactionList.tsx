import { TransactionItem } from './TransactionItem'
import { Spinner } from '@/components/ui/Spinner'
import type { Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({
  transactions,
  isLoading,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        Нет транзакций. Добавьте первую!
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={() => onEdit(transaction)}
          onDelete={() => onDelete(transaction.id)}
        />
      ))}
    </div>
  )
}