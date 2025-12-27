import { apiClient } from './client'
import type { AnalyticsReport } from '@/types'

export const analyticsApi = {
  getReport: async (dateFrom: string, dateTo: string): Promise<AnalyticsReport> => {
    const response = await apiClient.get('/analytics/report', {
      params: { date_from: dateFrom, date_to: dateTo },
    })
    return response.data
  },

  getSummary: async (): Promise<{
    period: string
    total_income: number
    total_expense: number
    balance: number
    top_expense_category: string | null
  }> => {
    const response = await apiClient.get('/analytics/summary')
    return response.data
  },
}