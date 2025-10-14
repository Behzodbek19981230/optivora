"use client"
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

import Cookies from 'js-cookie'

export type AuthUser = {
  id: string
  email: string
  name?: string
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const AUTH_COOKIE = 'app_auth'

const parseUser = (raw: string | undefined): AuthUser | null => {
  if (!raw) return null

  try {
    const obj = JSON.parse(raw)

    if (obj && obj.id && obj.email) return obj
    
return null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(parseUser(Cookies.get(AUTH_COOKIE)))
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) return false

    const fakeUser: AuthUser = { id: '1', email, name: email.split('@')[0] }

    Cookies.set(AUTH_COOKIE, JSON.stringify(fakeUser), { expires: 7 })
    setUser(fakeUser)

    return true
  }, [])

  const logout = useCallback(() => {
    Cookies.remove(AUTH_COOKIE)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)

  if (!ctx) throw new Error('useAuth must be used within AuthProvider')

  return ctx
}
