import { HandleControls, LoadingState, NotFoundState, ShowToastFunction } from '@/types/common'
import { EMPANELMENT_COUNT_AND_LIST } from '@/utils/endPoints'
import { TABLES } from '@/utils/constants'
import axiosInstance from '../axiosInstance'
import { VerifyEmpanelment } from '@/types/empanelmentAdd'
import { COMMON_MESSAGE } from '@/utils/commonMessages'

export enum EVerificationProcess {
  Pending = 'Pending',
  PartialVerified = 'PartialVerified',
  Verified = 'Verified',
  ReturnedByLegal = 'ReturnedByLegal',
  ReturnedByLegalProvider = 'ReturnedByLegalProvider',
}

export enum EDCEmpanelmentStatus {
  Pending = 'Pending',
  Registered = 'Registered',
  Rejected = 'Rejected',
}

export enum EDocusignStatus {
  completed = 'completed',
  pending = 'pending',
  correct = 'correct',
  created = 'created',
  declined = 'declined',
  deleted = 'deleted',
  delivered = 'delivered',
  sent = 'sent',
  signed = 'signed',
  template = 'template',
  timedout = 'timedout',
  voided = 'voided',
}

export const getCount = async (loading: LoadingState['setLoading'], toast: ShowToastFunction) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.Count)
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

export const getList = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  handleControls: HandleControls,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.List, handleControls)
    if (res?.data?.success) {
      if (res?.data?.data?.records?.length === 0) {
        notFound([...notFoundArray, TABLES.PENDING_FOR_VERIFICATION])
      } else {
        notFound([])
      }
      return res?.data?.data
    } else {
      notFound([...notFoundArray, TABLES.PENDING_FOR_VERIFICATION])
    }
  } catch (error: any) {
    console.log(error)
    if (error?.response?.status === 404) {
      notFound([...notFoundArray, TABLES.PENDING_FOR_VERIFICATION])
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const getOneEmpanelmentData = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.GetOne, { id: id })
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

export const verifyEmpanelmentByNetwork = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: VerifyEmpanelment,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.VerifyByNetwork, formData)
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

export const verifyEmpanelmentByLegal = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: VerifyEmpanelment,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.VerifyByLegal, formData)
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

export const processForDocumentSignatureByLegal = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.DocumentSignature, { id: id })
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

export const getListForLegal = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  notFound: NotFoundState['setNotFound'],
  notFoundArray: NotFoundState['notFound'],
  handleControls: HandleControls,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.ListForLegal, handleControls)
    if (res?.data?.success) {
      if (res?.data?.data?.records?.length === 0) {
        notFound([...notFoundArray, TABLES.PENDING_FOR_VERIFICATION])
      } else {
        notFound([])
      }
      return res?.data?.data
    } else {
      notFound([...notFoundArray, TABLES.PENDING_FOR_VERIFICATION])
    }
  } catch (error: any) {
    console.log(error)
    if (error?.response?.status === 404) {
      notFound([...notFoundArray, TABLES.PENDING_FOR_VERIFICATION])
    } else {
      toast('error', error.response.statusText)
    }
  } finally {
    loading({ isLoading: false, isPage: false })
  }
}

export const CheckStatusForDocumentSignature = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.CheckStatus, { id: id })
    if (res?.data?.status === 400) {
      toast('error', res.data.message)
    } else {
      // toast('success', COMMON_MESSAGE.Submit)
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

export const FinalEmpanelStatus = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  id: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(EMPANELMENT_COUNT_AND_LIST.FinalEmpanel, { id: id })
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
