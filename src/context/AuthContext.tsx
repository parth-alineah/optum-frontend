import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AuthParams } from '../types/common'
import { useNavigate } from 'react-router-dom'
import { getCurrentUserDetails } from '@/lib/auth'

interface AuthContextType {
  authParams: AuthParams | undefined
  addStorage: (token: string, role?: string) => void | undefined
  clearStorage: () => void | undefined
  setAuthParams: Dispatch<SetStateAction<AuthParams | undefined>>
  user: any
  setProfileRef: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const nav = useNavigate()
  const [authParams, setAuthParams] = useState<AuthParams | undefined>({
    isAuth: localStorage.getItem('token') !== null,
    role: localStorage.getItem('role') as string,
  })

  const [user, setUser] = useState<any>(null)
  const [profileRef, setProfileRef] = useState(false)

  const addStorage = (token: string, role?: string) => {
    localStorage.setItem('token', token)
    setAuthParams({ isAuth: true, role })
  }

  const clearStorage = () => {
    setUser(null)
    setAuthParams({
      isAuth: false,
      role: '0',
    })
    nav('/login')
    localStorage.clear()
  }

  const getCurrentUser = async () => {
    const res = await getCurrentUserDetails()
    if (res?.data) {
      setUser(res?.data?.user)
      setProfileRef(false)
    } else {
      clearStorage()
    }
  }

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (authParams?.isAuth === true) {
      getCurrentUser()
      console.log('Session called')
    }
  }, [authParams?.isAuth, token, profileRef])

  return (
    <AuthContext.Provider
      value={{
        authParams,
        addStorage,
        clearStorage,
        setAuthParams,
        user,
        setProfileRef,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}
