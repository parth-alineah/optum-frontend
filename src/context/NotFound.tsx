import { NotFoundContextType, NotFoundState } from '@/types/common'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

const NotFoundContext = createContext<NotFoundState | undefined>(undefined)
export function NotFoundProvider({ children }: { children: ReactNode }) {
  const [notFound, setNotFound] = useState<NotFoundContextType[]>([])
  const contextValue: NotFoundState = {
    notFound,
    setNotFound: setNotFound as Dispatch<SetStateAction<NotFoundContextType[]>>,
  }
  return <NotFoundContext.Provider value={contextValue}>{children}</NotFoundContext.Provider>
}

export function useNotFound() {
  const context = useContext(NotFoundContext)
  if (!context) {
    throw new Error('useLoading must be used within NotFoundProvider')
  }
  return context
}
