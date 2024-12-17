import { HandleControls, LoadingState, NotFoundState, ShowToastFunction } from '@/types/common'
import { PROVIDER_SEARCH } from '@/utils/endPoints'
import { TABLES } from '@/utils/constants'
import axiosInstance from '../axiosInstance'

export const searchProviderDetails = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = { id: id }
    const res = await axiosInstance.post(PROVIDER_SEARCH.Details, data)
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

export const searchProvider = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  handleControls: any,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(PROVIDER_SEARCH.MainSearch, handleControls)
    if (res?.data?.success) {
      if (res?.data?.data?.records?.length === 0) {
        notFound([...notFoundArray, TABLES.PROVIDER_SEARCH])
      } else {
        notFound([])
      }
      return res?.data?.data
    } else {
      notFound([...notFoundArray, TABLES.PROVIDER_SEARCH])
    }
  } catch (error: any) {
    console.log(error)
    if (error?.response?.status === 404) {
      notFound([...notFoundArray, TABLES.PROVIDER_SEARCH])
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}
