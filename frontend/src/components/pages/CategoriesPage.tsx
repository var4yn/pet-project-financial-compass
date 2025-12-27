import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { CategoryList } from '@/components/categories/CategoryList'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { useCategories, useCreateCategory } from '@/hooks/useCategories'
import type { CategoryCreate } from '@/types'

export function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: categories = [], isLoading } = useCategories()
  const createMutation = useCreateCategory()

  const handleCreate = (data: CategoryCreate) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>

      {/* List */}
      <CategoryList categories={categories} isLoading={isLoading} />

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Новая категория"
      >
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  )
}