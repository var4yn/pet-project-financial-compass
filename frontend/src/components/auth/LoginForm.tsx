import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  const errorMessage = (loginError as AxiosError<ApiError>)?.response?.data?.detail

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email обязателен',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Некорректный email',
          },
        })}
      />

      <Input
        label="Пароль"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', {
          required: 'Пароль обязателен',
          minLength: {
            value: 8,
            message: 'Минимум 8 символов',
          },
        })}
      />

      <Button type="submit" className="w-full" isLoading={isLoggingIn}>
        Войти
      </Button>
    </form>
  )
}