import { LoadingState, ShowToastFunction } from '@/types/common'
import { VERIFICATION } from '@/utils/endPoints'
import axiosInstance from '../axiosInstance'
import { Aadharcard, Bank, Company, Pancard } from '@/types/verifyData'

export const verifyPancardDetails = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: Pancard,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(VERIFICATION.VerifyPancard, formData)
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

export const verifyAadhaarcardDetails = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: string,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(VERIFICATION.VerifyAadhaarcard, {
      aadhaar_number: formData,
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

export const verifyBankDetails = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: Bank,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(VERIFICATION.VerifyBank, formData)
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

export const verifyCompanyDetails = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: Company,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(VERIFICATION.VerifyCompany, formData)
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

export const verifyPancardDetailsFrs = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: Pancard,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(VERIFICATION.VerifyPancardFrs, formData)
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

export const verifyBankDetailsFrs = async (
  loading: LoadingState['setLoading'],
  toast: ShowToastFunction,
  formData: Bank,
) => {
  try {
    loading({ isLoading: true, isPage: false })
    const res = await axiosInstance.post(VERIFICATION.VerifyBankFrs, formData)
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
