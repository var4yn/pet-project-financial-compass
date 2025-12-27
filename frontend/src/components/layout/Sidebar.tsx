import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Receipt, FolderOpen, User, Compass } from 'lucide-react'
import { cn } from '@/utils/cn'

const navigation = [
  { name: 'Дашборд', href: '/', icon: LayoutDashboard },
  { name: 'Транзакции', href: '/transactions', icon: Receipt },
  { name: 'Категории', href: '/categories', icon: FolderOpen },
  { name: 'Профиль', href: '/profile', icon: User },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-gray-200 bg-white lg:block">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <Compass className="h-8 w-8 text-primary-600" />
        <span className="text-xl font-bold text-gray-900">Finance</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}