import { HandleControls, LoadingState, NotFoundState, ShowToastFunction } from '@/types/common'
import { PERSPECTIVE_PROVIDER } from '@/utils/endPoints'
import { TABLES } from '@/utils/constants'
import axiosInstance from '../axiosInstance'
import { PerspectiveProviderFields } from '@/types/perspectiveProvider'
import { COMMON_MESSAGE } from '@/utils/commonMessages'

export const createPerspectiveProvider = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: PerspectiveProviderFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(PERSPECTIVE_PROVIDER.Create, formData)
    if (res?.data?.status === 400) {
      toast('error', res.data.message)
    } else {
      toast('success', COMMON_MESSAGE.Submit)
    }
    return res?.data
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

export const addPerspectiveProvider = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: any,
) => {
  try {
    loading({ isLoading: false, isPage: false })
    const res = await axiosInstance.post(PERSPECTIVE_PROVIDER.Add, formData)
    if (res?.data?.status === 400) {
      toast('error', res.data.message)
    } else {
      toast('success', COMMON_MESSAGE.Submit)
    }
    return res?.data
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

export const getPerspectiveProvider = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(PERSPECTIVE_PROVIDER.Get, { id: id })
    if (res?.data?.success) {
      if (res?.data?.data?.records?.length === 0) {
        notFound([...notFoundArray, TABLES.PERSPECTIVE_PROVIDER])
      } else {
        notFound([])
      }
      return res?.data?.data
    } else {
      notFound([...notFoundArray, TABLES.PERSPECTIVE_PROVIDER])
    }
  } catch (error: any) {
    console.log(error)
    if (error?.response?.status === 404) {
      notFound([...notFoundArray, TABLES.PERSPECTIVE_PROVIDER])
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const deletePerspectiveProvider = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(PERSPECTIVE_PROVIDER.Delete, { id: id })
    if (res?.data?.status === 400) {
      toast('error', res.data.message)
    }
    return res?.data
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
