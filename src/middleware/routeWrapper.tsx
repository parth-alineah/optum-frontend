import { Route, Routes } from 'react-router-dom'
import NotFound from '../components/NotFound'
import React from 'react'

interface Props {
  children: any
}

const RouteWrapper = ({ children }: Props) => {
  return (
    <Routes>
      {children}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default RouteWrapper
