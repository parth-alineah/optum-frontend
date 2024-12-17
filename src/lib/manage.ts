import { LoadingState, NotFoundState, ShowToastFunction } from '@/types/common'
import { MANAGE_REQUEST } from '@/utils/endPoints'
import { TABLES } from '@/utils/constants'
import axiosInstance from '../axiosInstance'
import { COMMON_MESSAGE } from '@/utils/commonMessages'

export const delistProviderForNetwork = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = { id: id }
    const res = await axiosInstance.post(MANAGE_REQUEST.ChangeStatusNwForDelist, data)
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

export const delistProvider = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = { id: id }
    const res = await axiosInstance.post(MANAGE_REQUEST.CreateDelist, data)
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

export const searchProviderForManage = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  handleControls: any,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(MANAGE_REQUEST.MainSearch, handleControls)
    if (res?.data?.success) {
      if (res?.data?.data?.records?.length === 0) {
        notFound([...notFoundArray, TABLES.MANAGE_SEARCH])
      } else {
        notFound([])
      }
      return res?.data?.data
    } else {
      notFound([...notFoundArray, TABLES.MANAGE_SEARCH])
    }
  } catch (error: any) {
    console.log(error)
    if (error?.response?.status === 404) {
      notFound([...notFoundArray, TABLES.MANAGE_SEARCH])
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const delistProviderApproveRejectFromDashboardForNetwork = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: any,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = { id: formData?.ticketId, status: formData?.status }
    const res = await axiosInstance.post(MANAGE_REQUEST.ChangeStatusForDelist, data)
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

export const modifyProviderForNetwork = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: any,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(MANAGE_REQUEST.ChangeStatusNwForModify, formData)
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

export const modifyProvider = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: any,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(MANAGE_REQUEST.CreateModify, formData)
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

export const modifyProviderApproveRejectFromDashboardForNetwork = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: any,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = { id: formData?.ticketId, status: formData?.status }
    const res = await axiosInstance.post(MANAGE_REQUEST.ChangeStatusForModify, data)
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

export const providerDetails = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: any,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(MANAGE_REQUEST.ProviderDetails, {
      ticketDbId: formData?._id,
      providerId: formData?.providerId,
      requestType: formData?.requestType,
    })
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
