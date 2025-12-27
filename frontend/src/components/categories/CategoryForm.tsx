import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { CategoryCreate } from '@/types'

interface CategoryFormProps {
  onSubmit: (data: CategoryCreate) => void
  onCancel: () => void
  isLoading?: boolean
}

const ICONS = ['💰', '🛒', '🚗', '🏠', '🎬', '🍔', '✈️', '💊', '📚', '💻', '🎮', '👕']
const COLORS = [
  '#4CAF50', '#FF9800', '#2196F3', '#9C27B0',
  '#E91E63', '#00BCD4', '#FF5722', '#795548',
]

export function CategoryForm({ onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryCreate>({
    defaultValues: {
      type: 'expense',
      icon: '📁',
      color: '#4CAF50',
    },
  })

  const selectedIcon = watch('icon')
  const selectedColor = watch('color')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Название"
        placeholder="Название категории"
        error={errors.name?.message}
        {...register('name', { required: 'Введите название' })}
      />

      <Select
        label="Тип"
        options={[
          { value: 'expense', label: 'Расход' },
          { value: 'income', label: 'Доход' },
        ]}
        {...register('type')}
      />

      {/* Icon picker */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Иконка</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', icon)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg border-2 text-lg transition-colors',
                selectedIcon === icon
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:bg-gray-50'
              )}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Цвет</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={cn(
                'h-10 w-10 rounded-lg border-2 transition-transform',
                selectedColor === color
                  ? 'scale-110 border-gray-900'
                  : 'border-transparent hover:scale-105'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Отмена
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          Создать
        </Button>
      </div>
    </form>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}