import { LoadingState, ShowToastFunction } from '@/types/common'
import { MANUAL_EMPANELMENT } from '@/utils/endPoints'
import axiosInstance from '../axiosInstance'
import { EmpanelmentAddFields } from '@/types/empanelmentAdd'
import { COMMON_MESSAGE } from '@/utils/commonMessages'

export const createManualEmpanelment = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: EmpanelmentAddFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(MANUAL_EMPANELMENT.Create, formData)
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

export const getDataFromId = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(MANUAL_EMPANELMENT.Get, { id: id })
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

export const editManualEmpanelment = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: EmpanelmentAddFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(MANUAL_EMPANELMENT.Edit, formData)
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

export const createPartialManualEmpanelment = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: EmpanelmentAddFields,
  isToastNotRequired?: boolean,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(MANUAL_EMPANELMENT.CreatePartial, formData)
    if (res?.data?.status === 400) {
      toast('error', res.data.message)
    } else {
      isToastNotRequired ? '' : toast('success', COMMON_MESSAGE.Submit)
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
