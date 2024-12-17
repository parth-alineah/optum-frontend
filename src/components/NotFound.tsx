import { useNavigate } from 'react-router-dom'
import { VITE_APP_FRONTEND_URL } from '@/utils/envVariables'

type Props = {}

const NotFound = ({}: Props) => {
  const nav = useNavigate()
  return (
    <div className='flex flex-col h-screen justify-center items-center'>
      <h2 className='text-3xl'>You are unauthorized please login again...</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
      <div
        // href={`${VITE_APP_FRONTEND_URL}/login`}
        // rel='noopener noreferrer'
        role='button'
        className='text-blue-main'
        onClick={() => {
          nav('/login')
        }}
      >
        Try to refresh!!
      </div>
    </div>
  )
}

export default NotFound
