import axios, { AxiosInstance, CancelTokenSource } from 'axios'
import { VITE_APP_API_URL } from './utils/envVariables'

export const axiosUnAuth = axios.create({
  baseURL: VITE_APP_API_URL,
})

const _cancelTokenQueue = new Map<string, CancelTokenSource>()

const axiosInstance: AxiosInstance = axios.create({
  baseURL: VITE_APP_API_URL as string,
  timeoutErrorMessage: 'Timeout! something went wrong',
})

axiosInstance.interceptors.request.use(
  (config) => {
    const { cancelToken } = config
    if (cancelToken) {
      const cancelTokenKey = cancelToken?.toString()
      // Cancel previous request and delete from queue
      if (_cancelTokenQueue.has(cancelTokenKey as string)) {
        const source = _cancelTokenQueue.get(cancelTokenKey as string)
        source?.cancel('Request canceled by user')
        _cancelTokenQueue.delete(cancelTokenKey as string)
      }
      // Add current request to the queue
      const source = axios.CancelToken.source()
      config.cancelToken = source.token
      _cancelTokenQueue.set(cancelTokenKey, source)
    }
    const accessToken = localStorage.getItem('token')
    if (!accessToken) {
      // window.location.reload()
    } else {
      config.headers['Authorization'] = `${accessToken}`
    }

    return config
  },
  (error: any) => Promise.reject(error),
)

const redirectLogin = () => {
  localStorage.clear()
  // window.location.reload()
}

axiosInstance.interceptors.response.use(
  function (response) {
    const allowedApis = ['/auth/current-user']
    const url = response?.config?.url
    if (response?.data?.status === 401 && !allowedApis.includes(url)) redirectLogin()
    return response
  },
  function (error) {
    const allowedApis = ['/auth/current-user']
    const url = error?.response?.config?.url
    const status = error?.response?.data?.status
    if ((status === 401 && !allowedApis.includes(url)) || status === 500) {
      // redirectLogin()
    }
    return Promise.reject(error)
  },
)

axiosUnAuth.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default axiosInstance
