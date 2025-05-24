'use client'

import { Header } from '@/components/header'

import { api } from '@/lib/axios'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { signOut } from '../actions/action'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Interceptor de resposta
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status

          if (status === 401) {
            // Força logout e redireciona
            await signOut()
            router.replace('/sign-in')
            return Promise.reject(new Error('Session expired'))
          }
        }
        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col gap-4 px-6 pt-6">{children}</main>
    </div>
  )
}
