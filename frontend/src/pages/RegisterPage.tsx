import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { RegisterForm } from '@/components/auth/RegisterForm'

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Compass className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
          <p className="text-gray-500">Создайте аккаунт</p>
        </div>

        {/* Form */}
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <RegisterForm />
        </div>

        {/* Login link */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Войдите
          </Link>
        </p>
      </div>
    </div>
  )
}