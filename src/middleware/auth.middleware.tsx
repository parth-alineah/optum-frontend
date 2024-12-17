import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AUTH_PATH, MAIN_PATH } from '@/paths/index'

const withAuth = (Component: React.ComponentType, allowedRoles?: string[]) => {
  return (props: any) => {
    const { authParams } = useAuth()
    const auth = () => {
      if (authParams === undefined || !authParams.isAuth) {
        return <Navigate to={`${MAIN_PATH.AUTH.split('/*')[0]}${AUTH_PATH.LOGIN}`} />
      } else if (allowedRoles && !allowedRoles.includes(authParams?.role)) {
        return <Navigate to={MAIN_PATH.UNAUTHORIZED} />
      } else {
        return <Component {...props} />
      }
    }
    useEffect(() => {
      auth()
    }, [authParams])

    return auth()
  }
}

export default withAuth
