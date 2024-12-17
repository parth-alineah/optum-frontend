import { LoadingState, ShowToastFunction } from '@/types/common'
import { AUTH_ENDPOINT } from '@/utils/endPoints'
import { ForgetPassFields, ResetPasswordFields, SignInFormFields } from '@/types/authTypes'
import axiosInstance, { axiosUnAuth } from '../axiosInstance'

export const loginUser = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: SignInFormFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = {
      email: formData?.email,
      password: formData?.password,
    }
    const res = await axiosUnAuth.post(AUTH_ENDPOINT.Login, data)
    if (res.data.status === 400) {
      toast('error', res.data.message)
    }
    return res.data
  } catch (error: any) {
    console.log(error)
    if (error.response.status === 400) {
      toast('error', error.response.data.message)
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const forgotPassword = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: ForgetPassFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = {
      email: formData?.email,
    }
    const res = await axiosUnAuth.post(AUTH_ENDPOINT.ForgotPassword, data)
    if (res.data.status === 400) {
      toast('error', res.data.message)
    }
    return res.data
  } catch (error: any) {
    console.log(error)
    if (error.response.status === 400) {
      toast('error', error.response.data.message)
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const resetPassword = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: ResetPasswordFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = {
      password: formData?.password,
      token: formData?.token,
    }
    const res = await axiosUnAuth.post(AUTH_ENDPOINT.ResetPassword, data)
    if (res.data.status === 400) {
      toast('error', res.data.message)
    }
    return res.data
  } catch (error: any) {
    console.log(error)
    if (error.response.status === 400) {
      toast('error', error.response.data.message)
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const getCurrentUserDetails = async () => {
  try {
    const res = await axiosInstance.post(`${AUTH_ENDPOINT.CurrentUser}`, {})
    return res.data
  } catch (error: any) {
    console.log(error)
    return null
  }
}
