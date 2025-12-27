import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useCategories } from '@/hooks/useCategories'
import type { TransactionFilters as Filters } from '@/types'

interface TransactionFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  const { data: categories = [] } = useCategories()

  return (
    <div className="flex flex-wrap gap-4">
      <Select
        placeholder="Все типы"
        value={filters.type || ''}
        onChange={(e) =>
          onChange({ ...filters, type: e.target.value as Filters['type'] || undefined })
        }
        options={[
          { value: '', label: 'Все типы' },
          { value: 'income', label: 'Доходы' },
          { value: 'expense', label: 'Расходы' },
        ]}
      />

      <Select
        placeholder="Все категории"
        value={filters.category_id || ''}
        onChange={(e) =>
          onChange({ ...filters, category_id: e.target.value || undefined })
        }
        options={[
          { value: '', label: 'Все категории' },
          ...categories.map((c) => ({
            value: c.id,
            label: `${c.icon || ''} ${c.name}`,
          })),
        ]}
      />

      <Input
        type="date"
        value={filters.date_from || ''}
        onChange={(e) =>
          onChange({ ...filters, date_from: e.target.value || undefined })
        }
        placeholder="От"
      />

      <Input
        type="date"
        value={filters.date_to || ''}
        onChange={(e) =>
          onChange({ ...filters, date_to: e.target.value || undefined })
        }
        placeholder="До"
      />
    </div>
  )
}