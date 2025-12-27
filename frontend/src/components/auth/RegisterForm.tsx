import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  first_name?: string
  last_name?: string
}

export function RegisterForm() {
  const { register: registerUser, isRegistering, registerError } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data
    registerUser(registerData)
  }

  const errorMessage = (registerError as AxiosError<ApiError>)?.response?.data?.detail

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Имя"
          placeholder="Иван"
          {...register('first_name')}
        />
        <Input
          label="Фамилия"
          placeholder="Петров"
          {...register('last_name')}
        />
      </div>

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

      <Input
        label="Подтвердите пароль"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Подтвердите пароль',
          validate: (val) => {
            if (watch('password') !== val) {
              return 'Пароли не совпадают'
            }
          },
        })}
      />

      <Button type="submit" className="w-full" isLoading={isRegistering}>
        Зарегистрироваться
      </Button>
    </form>
  )
}