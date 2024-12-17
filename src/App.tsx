import AppRoutes from './Routes'
import Loader from './components/Loader'
import { useLoading } from './context/LoadingContext'

function App() {
  const { loading } = useLoading()

  return (
    <>
      <AppRoutes />
      <Loader loading={loading} />
    </>
  )
}

export default App
