import { DROPDOWN } from '@/utils/endPoints'
import axiosInstance, { axiosUnAuth } from '../axiosInstance'
import {
  HandleControls,
  LoadingState,
  NotFoundState,
  SelectDDL,
  ShowToastFunction,
} from '@/types/common'
import { acDefaultValue } from '@/utils/form.validation'
import { TABLES } from '@/utils/constants'

type DrpType = {
  _id: string | number
  name: string
  displayName: string
}

export const dropdownCouncil = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  isMulti?: boolean,
) => {
  try {
    loading({
      isLoading: true,
      isPage: false,
    })
    const res = await axiosInstance.post(DROPDOWN.Council, {})
    if (res && res?.data?.success && res?.data) {
      const { data } = res
      const drpValues: SelectDDL[] = !isMulti ? [acDefaultValue] : []
      ;(data?.data as DrpType[])?.map((x) => {
        drpValues.push({ _id: String(x?._id), label: x?.displayName })
      })
      return drpValues
    } else {
      return []
    }
  } catch (error: any) {
    console.log(error)
    if (error.response.status === 404) {
      return []
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({
      isLoading: false,
      isPage: false,
    })
  }
}

export const dropdownQualification = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  isMulti?: boolean,
) => {
  try {
    loading({
      isLoading: true,
      isPage: false,
    })
    const res = await axiosInstance.post(DROPDOWN.Qualification, {})
    if (res && res?.data?.success && res?.data) {
      const { data } = res
      const drpValues: any[] = !isMulti ? [acDefaultValue] : []
      ;(data?.data as any[])?.map((x) => {
        drpValues.push({ _id: String(x?._id), label: x?.displayName,staffType:x?.staffType })
      })
      return drpValues
    } else {
      return []
    }
  } catch (error: any) {
    console.log(error)
    if (error.response.status === 404) {
      return []
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({
      isLoading: false,
      isPage: false,
    })
  }
}

export const dropdownOwnership = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  isMulti?: boolean,
) => {
  try {
    loading({
      isLoading: true,
      isPage: false,
    })
    const res = await axiosInstance.post(DROPDOWN.Ownership, {})
    if (res && res?.data?.success && res?.data) {
      const { data } = res
      const drpValues: SelectDDL[] = !isMulti ? [acDefaultValue] : []
      ;(data?.data as DrpType[])?.map((x) => {
        drpValues.push({ _id: String(x?._id), label: x?.displayName })
      })
      return drpValues
    } else {
      return []
    }
  } catch (error: any) {
    console.log(error)
    if (error.response.status === 404) {
      return []
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({
      isLoading: false,
      isPage: false,
    })
  }
}

export const dropdownCategory = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  isMulti?: boolean,
) => {
  try {
    loading({
      isLoading: true,
      isPage: false,
    })
    const res = await axiosInstance.post(DROPDOWN.TestCategory, {})
    if (res && res?.data?.success && res?.data) {
      const { data } = res
      const drpValues: SelectDDL[] = !isMulti ? [acDefaultValue] : []
      ;(data?.data as DrpType[])?.map((x) => {
        drpValues.push({ _id: String(x?._id), label: x?.displayName })
      })
      return drpValues
    } else {
      return []
    }
  } catch (error: any) {
    console.log(error)
    if (error.response.status === 404) {
      return []
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({
      isLoading: false,
      isPage: false,
    })
  }
}

export const getLabTests = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  handleControls: any,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(DROPDOWN.LabTestFromCategory, handleControls)
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
