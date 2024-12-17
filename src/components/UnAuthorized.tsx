import { useAuth } from '@/context/AuthContext'
import { EUserRole } from '@/utils/constants'

interface Props {}
const UnAuthorized = ({}: Props) => {
  const { user } = useAuth()
  return (
    <section className='bg-white-main'>
      <div>
        <div className='py-8 px-4 mx-auto max-w-screen-xl flex items-center justify-center  min-h-screen'>
          <div className='mx-auto max-w-screen-sm text-center'>
            <h1 className='mb-4 text-5xl tracking-tight font-extrabold lg:text-7xl text-blue-main'>
              404
            </h1>
            <p className='mb-4 text-xl tracking-tight font-bold text-darkGray-main md:text-2xl '>
              {`Unauthorized access Something's missing.`}
            </p>
            <p className='mb-4 text-lg font-light text-darkGray-main'>
              {`Sorry, we can't find that page. You'll find lots to explore on the home page.`}
            </p>
            <a
              href={user?.role === EUserRole.Legal ? '/search' : '/dashboard'}
              className='inline-flex bg-blue-main text-white-main font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4'
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UnAuthorized
