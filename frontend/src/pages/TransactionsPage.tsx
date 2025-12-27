import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/useTransactions'
import type { Transaction, TransactionFilters as Filters, TransactionCreate } from '@/types'

export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const { data, isLoading } = useTransactions(page, 20, filters)
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const handleCreate = (formData: TransactionCreate) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false)
      },
    })
  }

  const handleUpdate = (formData: TransactionCreate) => {
    if (editingTransaction) {
      updateMutation.mutate(
        { id: editingTransaction.id, data: formData },
        {
          onSuccess: () => {
            setEditingTransaction(null)
          },
        }
      )
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Удалить транзакцию?')) {
      deleteMutation.mutate(id)
    }
  }

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Транзакции</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <TransactionFilters filters={filters} onChange={setFilters} />
      </Card>

      {/* List */}
      <Card>
        <TransactionList
          transactions={data?.items || []}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Назад
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              {page} / {data.pages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === data.pages}
              onClick={() => setPage(page + 1)}
            >
              Вперед
            </Button>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Новая транзакция"
      >
        <TransactionForm
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Редактирование"
      >
        {editingTransaction && (
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTransaction(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>
    </div>
  )
}