import { Button, Divider, IconButton, Tooltip } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import { HandleControls } from '@/types/common'
import { useNotFound } from '@/context/NotFound'
import { limitOfPage, splitDescription, TABLES } from '@/utils/constants'
import { useEffect, useState } from 'react'
import { numberFieldValidation, txtFieldValidation } from '@/utils/form.validation'
import TxtInput from '@/components/TxtInput'
import { theme } from '@/context/ThemeProvider'
import {
  addPerspectiveProvider,
  createPerspectiveProvider,
  deletePerspectiveProvider,
  getPerspectiveProvider,
} from '@/lib/perspectiveProvider'
import { EEmpanelmentType, PerspectiveProviderFields } from '@/types/perspectiveProvider'
import NumInput from '@/components/NumInput'
import DeleteIcon from '@mui/icons-material/Delete'
import { format, parseISO } from 'date-fns'
import { searchPincode } from '@/lib/empanelmentRequest'

type Props = {}

const PerspectiveDetailsPage = (props: Props) => {
  const nav = useNavigate()
  const state = useLocation()
  const { setLoading } = useLoading()
  const showToast = useToast()
  const { setNotFound, notFound } = useNotFound()

  //default controls
  const defaultControls = {
    search: '',
    currentPage: 1,
    limitPerPage: limitOfPage,
    sortParam: 'createdAt',
    sortOrder: -1,
  }

  // Record and Control States
  const [data, setData] = useState<any[]>([])
  const [validate, setValidate] = useState(null)
  const [handleControls, setHandleControls] = useState<HandleControls>(defaultControls)
  const [isPending, setIsPending] = useState(false)

  const { control, handleSubmit, clearErrors, setError, setValue, reset } = useForm({
    defaultValues: {
      requestNumber: '',
      pincode: '',
      providerName: '',
      district: '',
      state: '',
      contactPersonName: '',
      zone: '',
      email: '',
      contactNo: '',
    },
  })

  const getData = async () => {
    const response = await getPerspectiveProvider(
      setLoading,
      showToast,
      setNotFound,
      notFound,
      state?.state?.parentDbId,
    )
    if (response) {
      if (response?.length === 0) {
        setNotFound([TABLES.PERSPECTIVE_PROVIDER])
      } else {
        setNotFound([])
        setData(response)
      }
    } else {
      setData([])
    }
  }

  const getModifiedData = () => {
    setData([])
    setHandleControls(defaultControls)
  }

  useEffect(() => {
    getData()
  }, [handleControls])

  const onSubmitHandle: SubmitHandler<PerspectiveProviderFields> = async (data) => {
    const res = await createPerspectiveProvider(setLoading, showToast, {
      ...data,
      parentDbId: state?.state?.parentDbId,
      pincode: validate?.Pincode ? validate?.Pincode : state?.state?.pincode,
    })
    if (res?.success) {
      reset((formValues) => {
        return {
          ...formValues,
          providerName: '',
          contactPersonName: '',
          email: '',
          contactNo: '',
          pincode: '',
          state: '',
          district: '',
        }
      })
      getData()
    }
  }

  useEffect(() => {
    setValue('requestNumber', state?.state?.ticketId)
    setValue('zone', state?.state?.zone)
    // setValue('pincodeId', state?.state?.pincode)
    // setValue('district', state?.state?.pincodeObj?.city)
    // setValue('state', state?.state?.pincodeObj?.state)
    setValue('pincode', state?.state?.pincode)
    setValue('district', state?.state?.pincodeObj?.city)
    setValue('state', state?.state?.pincodeObj?.state)
    validatePincode(state?.state?.pincode)
  }, [])

  const handleDelete = async (id: string) => {
    const res = await deletePerspectiveProvider(setLoading, showToast, id)
    if (res) {
      getModifiedData()
    }
  }

  const handleAutoAdd = async (id: string) => {
    setIsPending(true)
    showToast('success', 'Email will be sent in some time')
    const res = await addPerspectiveProvider(setLoading, showToast, {
      id: id,
      empanelType: EEmpanelmentType?.Auto,
    })
    if (res) {
      setIsPending(false)
      getData()
    } else {
      setIsPending(false)
    }
  }

  const handleManualAdd = async (id: string) => {
    nav(`/empanelment/manual-empanelment/${id}`)
  }

  const validatePincode = async (value: string) => {
    const res = await searchPincode(setLoading, showToast, value)
    if (res?.success) {
      setValidate(res?.data)
      setValue('district', res?.data?.District)
      setValue('state', res?.data?.State)
      clearErrors('pincode')
    } else {
      setValidate(null)
      setValue('district', '')
      setValue('state', '')
      showToast('error', 'Pincode is not valid!')
      setError('pincode', { message: '' })
    }
  }
  console.log(state, 'ss')

  return (
    <section>
      <div className='mt-3 mb-8'>
        <div className='flex items-center py-2 w-full px-5 bg-white-main rounded-md shadow justify-between gap-5'>
          <div className='flex gap-10'>
            <span className='font-normal'>
              Request Number : <b>{state?.state?.ticketId}</b>
            </span>
            <span className='font-normal'>
              PIN Code : <b>{validate?.Pincode ? validate?.Pincode : state?.state?.pincode}</b>
            </span>
          </div>
          <div className='text-center flex items-end justify-end'>
            <Button
              color='mBlue'
              sx={{
                minWidth: '100px',
                maxWidth: '100px',
                maxHeight: '35px',
                minHeight: '35px',
                color: theme.palette.mWhite.main,
              }}
              onClick={() => {
                window.history.go(-1)
              }}
            >
              Back
            </Button>
          </div>
        </div>

        <div className='flex lg:flex-nowrap flex-wrap w-full gap-5 pt-5'>
          <form
            onSubmit={handleSubmit(onSubmitHandle)}
            className='flex flex-col gap-5 w-3/5 max-h-[400px] min-h-[360px]'
          >
            <div className='bg-white-main shadow p-5 rounded-md'>
              <div className='flex items-start justify-start pb-4'>
                <span className='text-lg font-black'>Add Prospective Provider (Automation)</span>
              </div>
              <div className='grid lg:grid-cols-2 grid-cols-1 gap-3'>
                <TxtInput
                  control={control}
                  name='providerName'
                  handleChange={() => {}}
                  placeholder='Enter Provider Name'
                  sx={{ minWidth: 300 }}
                  label='Provider Name*'
                  validation={txtFieldValidation(true)}
                />
                <TxtInput
                  control={control}
                  name='pincode'
                  handleChange={() => {}}
                  placeholder='Enter PIN Code'
                  sx={{ minWidth: 300 }}
                  label='PIN Code*'
                  validation={txtFieldValidation(true)}
                  handleBlue={(e) => {
                    if (e.target.value.length === 6) {
                      validatePincode(e.target.value)
                    } else {
                      setValidate(null)
                      setValue('district', '')
                      setValue('state', '')
                    }
                  }}
                />
                <TxtInput
                  control={control}
                  name='district'
                  handleChange={() => {}}
                  placeholder='Enter District'
                  sx={{ minWidth: 300 }}
                  label='District*'
                  validation={txtFieldValidation(true)}
                  isDisabled={true}
                />
                <TxtInput
                  control={control}
                  name='state'
                  handleChange={() => {}}
                  placeholder='Enter State'
                  sx={{ minWidth: 300 }}
                  label='State*'
                  validation={txtFieldValidation(true)}
                  isDisabled={true}
                />
                <TxtInput
                  control={control}
                  name='contactPersonName'
                  handleChange={() => {}}
                  placeholder='Enter Contact Person Name'
                  sx={{ minWidth: 300 }}
                  label='Contact Person Name*'
                  validation={txtFieldValidation(true)}
                />
                <TxtInput
                  control={control}
                  name='email'
                  handleChange={() => {}}
                  placeholder='Enter Contact Email ID'
                  sx={{ minWidth: 300 }}
                  label='Contact Email ID*'
                  validation={txtFieldValidation(true, 'Email')}
                />
                <NumInput
                  control={control}
                  name='contactNo'
                  handleChange={() => {}}
                  placeholder='Enter Contact Mobile No'
                  sx={{ minWidth: 300 }}
                  label='Contact Mobile No*'
                  validation={numberFieldValidation(true, undefined, 'Phone')}
                />
              </div>
              <div className='text-center items-center flex flex-col pt-6'>
                <Button
                  color='mBlue'
                  sx={{
                    maxHeight: '35px',
                    minHeight: '35px',
                    color: theme.palette.mWhite.main,
                  }}
                  type='submit'
                  disabled={validate ? false : true}
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
          {data?.length > 0 && (
            <div className='w-2/5'>
              <div className='bg-white-main shadow p-5 rounded-md'>
                <div className='flex items-start justify-start pb-4'>
                  <span className='text-lg font-black'>
                    Prospective Providers Added for this Request
                  </span>
                </div>
                <Divider />
                <div className='overflow-y-scroll max-h-[335px] scrollBar'>
                  {data?.length > 0 &&
                    data?.map((x, i) => (
                      <>
                        <div className='flex items-center w-full py-2' key={x?._id}>
                          <Tooltip title={x?.providerName} placement='left-start'>
                            <span className='w-[60%] font-normal'>
                              {x?.providerName ? splitDescription(x?.providerName, 20) : ''}
                              {x?.isDisabled && <div className='text-xs'>{x?.empanelType}</div>}
                            </span>
                          </Tooltip>
                          <div className='w-[40%] flex justify-end items-center gap-3 py-1'>
                            {!x?.isDisabled && (
                              <>
                                {x?.partialEmpanelType !== 'Manual' && (
                                  <Button
                                    color='mBlue'
                                    sx={{
                                      minWidth: '70px',
                                      maxWidth: '70px',
                                      maxHeight: '35px',
                                      minHeight: '35px',
                                      color: theme.palette.mWhite.main,
                                    }}
                                    onClick={() => {
                                      if (!x?.isDisabled) {
                                        handleAutoAdd(x?._id)
                                      }
                                    }}
                                    disabled={
                                      x?.isDisabled ? x?.isDisabled : isPending ? true : false
                                    }
                                  >
                                    Auto
                                  </Button>
                                )}
                                <Button
                                  color='mWhite'
                                  sx={{
                                    minWidth: '70px',
                                    maxWidth: '70px',
                                    maxHeight: '35px',
                                    minHeight: '35px',
                                    color: theme.palette.mBlack.main,
                                  }}
                                  onClick={() => {
                                    if (!x?.isDisabled) {
                                      handleManualAdd(x?._id)
                                    }
                                  }}
                                  disabled={
                                    x?.isDisabled ? x?.isDisabled : isPending ? true : false
                                  }
                                >
                                  Manual
                                </Button>
                                <div
                                  role='button'
                                  onClick={() => {
                                    if (!x?.isDisabled && !isPending) {
                                      handleDelete(x?._id)
                                    }
                                  }}
                                  className={` ${x?.isDisabled ? 'cursor-default text-darkGray-main' : isPending ? 'cursor-default text-darkGray-main' : 'text-orange-main'}`}
                                >
                                  <DeleteIcon />
                                </div>
                              </>
                            )}
                            {x?.isDisabled && (
                              <div className='text-xs'>
                                {x?.actionDate
                                  ? format(parseISO(x?.actionDate), 'dd MMM yyyy')
                                  : format(parseISO(x?.updatedAt), 'dd MMM yyyy')}
                              </div>
                            )}
                          </div>
                        </div>
                        {data?.length !== i + 1 && <Divider />}
                      </>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PerspectiveDetailsPage
