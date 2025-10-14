"use client"
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import type { ChildrenType } from '@core/types'
import { useAuth } from '@/contexts/auth/AuthContext'

export default function AuthGuard({ children }: ChildrenType ) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading || !user) return null

  return <>{children}</>
}
