import React, { Component, ReactNode } from 'react'
import ErrorIcon from '@mui/icons-material/Error'
import { theme } from '@/context/ThemeProvider'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // This method is called when an error is thrown in the child components
  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  // You can also log the error to an error reporting service
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service (e.g., Sentry, LogRocket)
    const data = {
      name: 'Frontend',
      code: 'ER-Other',
      location: '',
      data: JSON.stringify({ stack: error?.stack, name: error?.name }),
      description: JSON.stringify(error?.message),
      ip: '',
      module: error?.name || 'Unknown Error',
      origin: 'Web',
      user: -1,
      type: 'Admin',
      isError: true,
    }
    // createEventLog(data)
    //   .then((response) => {
    //     console.log('Error reported successfully', response)
    //   })
    //   .catch((apiError) => {
    //     console.error('Error reporting failed', apiError)
    //   })
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <div className='flex items-center justify-center p-5 w-full'>
            <div className='text-center'>
              <div className='inline-flex rounded-full bg-red-100 p-4'>
                <div className='rounded-full stroke-red-600 bg-red-200 p-4'>
                  <ErrorIcon sx={{ color: theme.palette.mOrange.main, fontSize: 50 }} />
                </div>
              </div>
              <h1 className='text-[36px] font-bold text-slate-800 lg:text-[50px]'>
                500 - Server error
              </h1>
              <p className='text-slate-600 mt-5 lg:text-lg'>
                Oops something went wrong. this page or{' '}
                <span
                  role='button'
                  onClick={() => location.reload()}
                  className='text-darkBlue-main font-bold'
                >
                  Try to refresh
                </span>{' '}
                <br /> feel free to contact us if the problem presists.
              </p>
            </div>
          </div>
        </>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
