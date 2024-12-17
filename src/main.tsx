import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import 'react-toastify/dist/ReactToastify.css'
import './styles/toast.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AppThemeProvider from '@/context/ThemeProvider'
import { AuthProvider } from '@/context/AuthContext'
import { LoadingProvider } from '@/context/LoadingContext'
import { NotFoundProvider } from './context/NotFound'
import App from './App'
import ErrorBoundary from './components/Error'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <AuthProvider>
      <AppThemeProvider>
        <LoadingProvider>
          <ToastContainer
            limit={3}
            position='top-right'
            autoClose={2000}
            pauseOnFocusLoss={false}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            theme='colored'
            icon={false}
          />
          {/* <ErrorBoundary> */}
          <NotFoundProvider>
            <App />
          </NotFoundProvider>
          {/* </ErrorBoundary> */}
        </LoadingProvider>
      </AppThemeProvider>
    </AuthProvider>
  </BrowserRouter>,
)
