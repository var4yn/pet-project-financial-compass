export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  icon: string | null
  color: string | null
  user_id: string
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string
  type: 'income' | 'expense'
  amount: number
  currency: string
  description: string | null
  transaction_date: string
  created_at: string
  updated_at: string
  category: Category | null
}

export interface TransactionCreate {
  category_id: string
  type: 'income' | 'expense'
  amount: number
  currency?: string
  description?: string
  transaction_date: string
}

export interface TransactionUpdate {
  category_id?: string
  amount?: number
  description?: string
  transaction_date?: string
}

export interface TransactionFilters {
  type?: 'income' | 'expense'
  category_id?: string
  date_from?: string
  date_to?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface CategoryCreate {
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
}

export interface PeriodSummary {
  period_start: string
  period_end: string
  total_income: number
  total_expense: number
  balance: number
  transaction_count: number
}

export interface CategorySummary {
  category_id: string
  category_name: string
  category_icon: string | null
  category_color: string | null
  total_amount: number
  transaction_count: number
  percentage: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expense: number
  balance: number
}

export interface AnalyticsReport {
  summary: PeriodSummary
  expense_by_category: CategorySummary[]
  income_by_category: CategorySummary[]
  monthly_trends: MonthlyTrend[]
}

export interface ApiError {
  detail: string
}