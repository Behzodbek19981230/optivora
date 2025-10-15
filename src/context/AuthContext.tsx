// ** React Imports
import { createContext, ReactNode, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import toast from 'react-hot-toast'
import { DataService } from 'src/configs/dataService'
import { AuthValuesType, ErrCallbackType, LoginClientParams, LoginParams, UserDataType } from './types'
import endpoints from 'src/configs/endpoint '

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),

}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const router = useRouter()
  const initAuth = async (): Promise<void> => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
    if (storedToken) {
      setLoading(true)
        await DataService.get(endpoints.me)
        .then(async response => {
          setLoading(false)
          setUser({ ...response.data?.result })
          localStorage.setItem('userData', JSON.stringify(response.data.result))
        })
        .catch(() => {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login') && !storedToken) {
            router.replace('/login')
          }
        })
    } else {
      setLoading(false)
    }
  }
  useEffect(() => {
    initAuth()
    console.log('loading', loading)
  }, [])

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    try {
      const res = await DataService.login(endpoints.login, {
       ...params
      })

      window.localStorage.setItem(authConfig.storageTokenKeyName, res.data?.result.access_token)

      const returnUrl = router.query.returnUrl

      setUser({
        ...res.data?.result
      })

      params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(res.data?.result)) : null

      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
      initAuth()

      router
        .replace('/')

        .catch(err => {
          if (errorCallback) errorCallback(err)
        })
    } catch (error: any) {
      toast.error(error?.message)
      if (errorCallback) errorCallback(error?.message)
    }
  }
 

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
