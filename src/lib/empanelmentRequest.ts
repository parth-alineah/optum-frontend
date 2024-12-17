import { HandleControls, LoadingState, NotFoundState, ShowToastFunction } from '@/types/common'
import { EMPANELMENT_REQUEST } from '@/utils/endPoints'
import { TABLES } from '@/utils/constants'
import axiosInstance from '../axiosInstance'
import { EmpanelmentRequestFields } from '@/types/empanelmentRequest'
import { COMMON_MESSAGE } from '@/utils/commonMessages'

export const searchPincode = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  pincode: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const data = { pincode: pincode }
    const res = await axiosInstance.post(EMPANELMENT_REQUEST.Pincode, data)
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

export const requestForDcEmpanelment = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: EmpanelmentRequestFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_REQUEST.Empanelment_Send, formData)
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

export const getNewRequest = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  handleControls: HandleControls,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(
      EMPANELMENT_REQUEST.Empanelment_New_Request,
      handleControls,
    )
    if (res?.data?.success) {
      if (res?.data?.data?.records?.length === 0) {
        notFound([...notFoundArray, TABLES.NEW_REQUEST])
      } else {
        notFound([])
      }
      return res?.data?.data
    } else {
      notFound([...notFoundArray, TABLES.NEW_REQUEST])
    }
  } catch (error: any) {
    console.log(error)
    if (error?.response?.status === 404) {
      notFound([...notFoundArray, TABLES.NEW_REQUEST])
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const getOpenRequest = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  handleControls: HandleControls,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(
      EMPANELMENT_REQUEST.Empanelment_Open_Request,
      handleControls,
    )
    if (res?.data?.success) {
      if (res?.data?.data?.records?.length === 0) {
        notFound([...notFoundArray, TABLES.OPEN_REQUEST])
      } else {
        notFound([])
      }
      return res?.data?.data
    } else {
      notFound([...notFoundArray, TABLES.OPEN_REQUEST])
    }
  } catch (error: any) {
    console.log(error)
    if (error?.response?.status === 404) {
      notFound([...notFoundArray, TABLES.OPEN_REQUEST])
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const getCloseRequest = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  handleControls: HandleControls,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(
      EMPANELMENT_REQUEST.Empanelment_Close_Request,
      handleControls,
    )
    if (res?.data?.success) {
      if (res?.data?.data?.records?.length === 0) {
        notFound([...notFoundArray, TABLES.CLOSE_REQUEST])
      } else {
        notFound([])
      }
      return res?.data?.data
    } else {
      notFound([...notFoundArray, TABLES.CLOSE_REQUEST])
    }
  } catch (error: any) {
    console.log(error)
    if (error?.response?.status === 404) {
      notFound([...notFoundArray, TABLES.CLOSE_REQUEST])
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}
