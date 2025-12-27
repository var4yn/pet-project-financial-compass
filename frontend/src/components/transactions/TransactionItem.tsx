import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDateShort } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import type { Transaction } from '@/types'

interface TransactionItemProps {
  transaction: Transaction
  onEdit: () => void
  onDelete: () => void
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income'

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: transaction.category?.color || '#e5e7eb' }}
        >
          {transaction.category?.icon || '💰'}
        </div>

        {/* Info */}
        <div>
          <p className="font-medium text-gray-900">
            {transaction.category?.name || 'Без категории'}
          </p>
          <p className="text-sm text-gray-500">
            {transaction.description || formatDateShort(transaction.transaction_date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Amount */}
        <span
          className={cn(
            'text-lg font-semibold',
            isIncome ? 'text-green-600' : 'text-red-600'
          )}
        >
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, transaction.currency)}
        </span>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}