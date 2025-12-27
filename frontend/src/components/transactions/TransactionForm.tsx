import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useCategories } from '@/hooks/useCategories'
import type { Transaction, TransactionCreate } from '@/types'

interface TransactionFormProps {
  transaction?: Transaction
  onSubmit: (data: TransactionCreate) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TransactionForm({
  transaction,
  onSubmit,
  onCancel,
  isLoading,
}: TransactionFormProps) {
  const { data: categories = [] } = useCategories()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionCreate>({
    defaultValues: transaction
      ? {
          category_id: transaction.category_id,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description || '',
          transaction_date: transaction.transaction_date,
        }
      : {
          type: 'expense',
          currency: 'RUB',
          transaction_date: new Date().toISOString().split('T')[0],
        },
  })

  const selectedType = watch('type')
  const filteredCategories = categories.filter((c) => c.type === selectedType)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Type */}
      <div className="grid grid-cols-2 gap-2">
        <label
          className={cn(
            'flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-colors',
            watch('type') === 'expense'
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 hover:bg-gray-50'
          )}
        >
          <input
            type="radio"
            value="expense"
            className="sr-only"
            {...register('type')}
          />
          <span>Расход</span>
        </label>
        <label
          className={cn(
            'flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-colors',
            watch('type') === 'income'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 hover:bg-gray-50'
          )}
        >
          <input
            type="radio"
            value="income"
            className="sr-only"
            {...register('type')}
          />
          <span>Доход</span>
        </label>
      </div>

      {/* Amount */}
      <Input
        label="Сумма"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="1000.00"
        error={errors.amount?.message}
        {...register('amount', {
          required: 'Укажите сумму',
          min: { value: 0.01, message: 'Минимум 0.01' },
          valueAsNumber: true,
        })}
      />

      {/* Category */}
      <Select
        label="Категория"
        placeholder="Выберите категорию"
        error={errors.category_id?.message}
        options={filteredCategories.map((c) => ({
          value: c.id,
          label: `${c.icon || ''} ${c.name}`,
        }))}
        {...register('category_id', { required: 'Выберите категорию' })}
      />

      {/* Date */}
      <Input
        label="Дата"
        type="date"
        error={errors.transaction_date?.message}
        {...register('transaction_date', { required: 'Укажите дату' })}
      />

      {/* Description */}
      <Input
        label="Описание"
        placeholder="Необязательно"
        {...register('description')}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Отмена
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {transaction ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}