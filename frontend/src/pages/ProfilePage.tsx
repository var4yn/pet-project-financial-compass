import { useAuth } from '@/hooks/useAuth'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/formatters'
import { User, Mail, Calendar, Shield } from 'lucide-react'

export function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>

      <Card>
        <CardHeader>
          <CardTitle>Информация о пользователе</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Имя</p>
              <p className="font-medium">
                {user.first_name || ''} {user.last_name || ''}
                {!user.first_name && !user.last_name && '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Дата регистрации</p>
              <p className="font-medium">{formatDate(user.created_at)}</p>
            </div>
          </div>

          {user.is_verified && (
           <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Статус</p>
              <p className="font-medium">
                {user.is_verified ? (
                  <span className="text-green-600">Подтвержден</span>
                ) : (
                  <span className="text-yellow-600">Не подтвержден</span>
                )}
              </p>
            </div>
          </div>)}

        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <Button variant="danger" onClick={logout}>
            Выйти из аккаунта
          </Button>
        </div>
      </Card>
    </div>
  )
}