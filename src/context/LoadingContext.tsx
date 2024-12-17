import { LoadingState } from '@/types/common'
import { ReactNode, createContext, useContext, useState } from 'react'

const LoadingContext = createContext<LoadingState | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<LoadingState['loading']>({
    isLoading: false,
    isPage: false,
    pageProps: undefined,
  })
  const contextValue: LoadingState = {
    loading: loading as LoadingState['loading'],
    setLoading: setLoading as LoadingState['setLoading'],
  }
  return <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}
