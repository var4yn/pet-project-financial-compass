import { apiClient } from './client'
import type { User, TokenPair } from '@/types'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export const authApi = {
  login: async (data: LoginData): Promise<TokenPair> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  refresh: async (refreshToken: string): Promise<TokenPair> => {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  },
}