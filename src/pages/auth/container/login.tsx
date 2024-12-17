import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { SubmitHandler, useForm } from 'react-hook-form'
import TxtInput from '@/components/TxtInput'
import { txtFieldValidation } from '@/utils/form.validation'
import { Button, Divider } from '@mui/material'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import PasswordInput from '@/components/PasswordInput'
import { theme } from '@/context/ThemeProvider'
import { SignInFormFields } from '@/types/authTypes'
import Logo from '/Alinea_logo.png'
import { loginUser } from '@/lib/auth'
import { AUTH_PATH } from '@/paths/index'
import { EUserRole } from '@/utils/constants'

interface Props {}

const LogIn = ({}: Props) => {
  const nav = useNavigate()
  const { setLoading } = useLoading()
  const showToast = useToast()
  const { addStorage } = useAuth()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmitHandle: SubmitHandler<SignInFormFields> = async (data) => {
    const res = await loginUser(setLoading, showToast, data)
    if (res?.data) {
      const token = res?.data?.token
      addStorage(token)
      if (res?.data?.role === EUserRole.Legal) {
        nav('/search')
      } else {
        nav('/dashboard')
      }
    }
  }

  return (
    <div className='min-h-screen h-screen w-screen diagonal-split py-5 flex items-center justify-center'>
      <div className='flex flex-col justify-center bg-white-main w-[450px] py-5 rounded-xl items-center px-5'>
        <div className='text-center py-3'>
          <img src={Logo} alt='Alinea Health' className='pb-3' />
          <span className='text-sm'>Login in to your account</span>
        </div>
        <form onSubmit={handleSubmit(onSubmitHandle)}>
          <TxtInput
            control={control}
            name='email'
            handleChange={() => {}}
            placeholder='Enter Email'
            sx={{ minWidth: 300, marginBottom: '10px' }}
            label='Email*'
            validation={txtFieldValidation(true, 'Email')}
          />
          <PasswordInput
            control={control}
            name='password'
            handleChange={() => {}}
            placeholder='Enter Your Password'
            sx={{ minWidth: 300, marginBottom: '20px' }}
            validation={{ required: 'required' }}
            label='Password*'
          />
          <div className='text-center flex flex-col gap-2 mb-5'>
            <Button
              color='mBlue'
              sx={{ minWidth: '100%', color: theme.palette.mWhite.main }}
              type='submit'
            >
              Login
            </Button>
          </div>
          <Button
            color='mLightBlack'
            sx={{ minWidth: '100%' }}
            variant='outlined'
            onClick={() => {
              nav(`${AUTH_PATH.FORGET_PASSWORD}`)
            }}
          >
            Forgot password?
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LogIn
