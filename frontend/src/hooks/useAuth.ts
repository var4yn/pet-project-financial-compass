import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setTokens, setUser, logout, isAuthenticated, user } = useAuthStore()

  // Fetch current user
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    isSuccess,
  } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
  })

  // Update store when user data is fetched
  useEffect(() => {
    if (isSuccess && currentUser) {
      setUser(currentUser)
    }
  }, [isSuccess, currentUser, setUser])

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      navigate('/login')
    },
  })

  // Logout handler
  const handleLogout = () => {
    logout()
    queryClient.clear()
    navigate('/login')
  }

  return {
    user: currentUser ?? user,
    isAuthenticated,
    isLoading: isLoadingUser,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  }
}