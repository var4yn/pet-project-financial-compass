import { Card } from '@/components/ui/Card'
import type { Category } from '@/types'

interface CategoryListProps {
  categories: Category[]
  isLoading: boolean
}

export function CategoryList({ categories, isLoading }: CategoryListProps) {
  const incomeCategories = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  if (isLoading) {
    return <div className="py-12 text-center text-gray-500">Загрузка...</div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Income */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-green-600">Доходы</h3>
        <div className="space-y-2">
          {incomeCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </Card>

      {/* Expense */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-red-600">Расходы</h3>
        <div className="space-y-2">
          {expenseCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </Card>
    </div>
  )
}

function CategoryItem({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
        style={{ backgroundColor: category.color || '#e5e7eb' }}
      >
        {category.icon || '📁'}
      </div>
      <div>
        <p className="font-medium text-gray-900">{category.name}</p>
        {category.is_default && (
          <span className="text-xs text-gray-500">По умолчанию</span>
        )}
      </div>
    </div>
  )
}