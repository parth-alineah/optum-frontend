import { LoadingState, ShowToastFunction } from '@/types/common'
import { AUTO_EMPANELMENT } from '@/utils/endPoints'
import { axiosUnAuth } from '../axiosInstance'
import { EmpanelmentAddFields } from '@/types/empanelmentAdd'
import { COMMON_MESSAGE } from '@/utils/commonMessages'

export const createAutoEmpanelment = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: EmpanelmentAddFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosUnAuth.post(AUTO_EMPANELMENT.Create, formData)
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

export const editAutoEmpanelment = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: EmpanelmentAddFields,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosUnAuth.post(AUTO_EMPANELMENT.Edit, formData)
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
