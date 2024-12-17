import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import PasswordInput from '@/components/PasswordInput'
import { useCallback, useEffect, useState } from 'react'
import { theme } from '@/context/ThemeProvider'
import Logo from '/Alinea_logo.png'
import { txtFieldValidation } from '@/utils/form.validation'
import { ResetPasswordFields } from '@/types/authTypes'
import { resetPassword } from '@/lib/auth'
import { AUTH_ENDPOINT } from '@/utils/endPoints'

const ResetPassword = () => {
  const nav = useNavigate()
  const { setLoading } = useLoading()
  const [isVerified, setIsVerified] = useState(false)
  const showToast = useToast()
  const { control, handleSubmit, setValue, watch, getValues } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  // const isTokenValid = useCallback(
  //   async (t) => {
  //     const res = await verifyToken(setLoading, showToast, t)
  //     if (!res?.success) {
  //       setTimeout(() => {
  //         nav('/auth/login')
  //       }, 500)
  //     } else {
  //       setIsVerified(true)
  //     }
  //   },
  //   [token],
  // )
  // useEffect(() => {
  //   isTokenValid(token)
  // }, [token, isTokenValid])

  const onSubmitHandle: SubmitHandler<ResetPasswordFields> = async (data) => {
    const res = await resetPassword(setLoading, showToast, { ...data, token: token })
    if (res?.success) nav(AUTH_ENDPOINT.Login)
  }
  return (
    <div className='min-h-screen h-screen w-screen diagonal-split py-5 flex items-center justify-center'>
      <div className='flex flex-col justify-center bg-white-main w-[450px] py-5 rounded-xl items-center px-5'>
        <div className='text-center py-3'>
          <img src={Logo} alt='Alinea Health' className='pb-3' />
          <span className='text-sm'>Reset your password</span>
        </div>
        <form onSubmit={handleSubmit(onSubmitHandle)}>
          <PasswordInput
            control={control}
            name='password'
            handleChange={() => {}}
            placeholder='Enter Password'
            sx={{ minWidth: 300, marginBottom: '10px' }}
            validation={txtFieldValidation(true)}
            label='Password*'
            // isDisabled={!isVerified}
          />
          <PasswordInput
            control={control}
            name='confirmPassword'
            handleChange={() => {}}
            placeholder='Enter Confirm Password'
            sx={{ minWidth: 300, marginBottom: '10px' }}
            validation={{
              required: 'Required.',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            }}
            label='Confirm Password*'
            // isDisabled={!isVerified}
          />
          <div className='text-center flex flex-col gap-2 mb-5'>
            <Button
              color='mBlue'
              sx={{ minWidth: '100%', color: theme.palette.mWhite.main }}
              type='submit'
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
