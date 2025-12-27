import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api/analytics'
import { format, startOfMonth } from 'date-fns'

export function useAnalyticsReport(dateFrom?: string, dateTo?: string) {
  const today = new Date()
  const defaultFrom = format(startOfMonth(today), 'yyyy-MM-dd')
  const defaultTo = format(today, 'yyyy-MM-dd')

  return useQuery({
    queryKey: ['analytics', 'report', dateFrom || defaultFrom, dateTo || defaultTo],
    queryFn: () => analyticsApi.getReport(dateFrom || defaultFrom, dateTo || defaultTo),
  })
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: analyticsApi.getSummary,
  })
}