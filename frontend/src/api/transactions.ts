import { apiClient } from './client'
import type {
  Transaction,
  TransactionCreate,
  TransactionUpdate,
  TransactionFilters,
  PaginatedResponse,
} from '@/types'

export const transactionsApi = {
  getAll: async (
    page = 1,
    size = 20,
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('size', String(size))
    
    if (filters?.type) params.append('type', filters.type)
    if (filters?.category_id) params.append('category_id', filters.category_id)
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)

    const response = await apiClient.get(`/transactions?${params}`)
    return response.data
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/${id}`)
    return response.data
  },

  create: async (data: TransactionCreate): Promise<Transaction> => {
    const response = await apiClient.post('/transactions', data)
    return response.data
  },

  update: async (id: string, data: TransactionUpdate): Promise<Transaction> => {
    const response = await apiClient.patch(`/transactions/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`)
  },
}