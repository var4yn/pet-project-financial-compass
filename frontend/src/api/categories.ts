import { apiClient } from './client'
import type { Category, CategoryCreate } from '@/types'

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories')
    return response.data
  },

  create: async (data: CategoryCreate): Promise<Category> => {
    const response = await apiClient.post('/categories', data)
    return response.data
  },
}