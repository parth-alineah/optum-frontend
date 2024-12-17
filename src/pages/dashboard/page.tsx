import { theme } from '@/context/ThemeProvider'
import { Button } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import TxtInput from '@/components/TxtInput'
import { acDefaultValue, searchSelectValidation, txtFieldValidation } from '@/utils/form.validation'
import SelectInput from '@/components/SelectInput'
import DashboardTablePage from './tab'
import { EUserRole, EZones, EZonesArray, limitOfPage, TABLES } from '@/utils/constants'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { requestForDcEmpanelment, searchPincode } from '@/lib/empanelmentRequest'
import NumInput from '@/components/NumInput'

type Props = {}

const DashBoardPage = (props: Props) => {
  //default controls
  const defaultControls = {
    search: '',
    currentPage: 1,
    limitPerPage: limitOfPage,
    sortParam: 'createdAt',
    sortOrder: 1,
  }
  const nav = useNavigate()
  const { setLoading } = useLoading()
  const showToast = useToast()
  const [validate, setValidate] = useState(null)
  const [trigger, setTrigger] = useState(false)

  const { control, handleSubmit, clearErrors, setError, setValue, reset } = useForm({
    defaultValues: {
      zone: acDefaultValue,
      pincode: '',
      remark: '',
      pincodeData: { city: '', state: '', block: '', country: '' },
    },
  })

  const onSubmitHandle: SubmitHandler<any> = async (data) => {
    const res = await requestForDcEmpanelment(setLoading, showToast, {
      pincode: validate?.Pincode,
      zone: data?.zone?._id,
      remark: data?.remark,
      pincodeData: {
        city: validate?.District,
        state: validate?.State,
        block: validate?.Block,
        country: validate?.Country,
      },
    })
    if (res) {
      reset()
      setTrigger(true)
    }
  }

  const { user } = useAuth()
  useEffect(() => {
    if (Object.keys(EZones).includes(user?.defaultZone)) {
      setValue('zone', {
        _id: user?.defaultZone,
        label: user?.defaultZone,
      })
    }
  }, [user])

  const validatePincode = async (value: string) => {
    const res = await searchPincode(setLoading, showToast, value)
    if (res?.success) {
      setValidate(res?.data)
      clearErrors('pincode')
    } else {
      setValidate(null)
      showToast('error', 'Pincode is not valid!')
      setError('pincode', { message: '' })
    }
  }
  return (
    <section>
      {user?.role === EUserRole.Operation && (
        <div className='my-5'>
          <span className='text-lg font-black'>Empanelment Request</span>
          <form
            onSubmit={handleSubmit(onSubmitHandle)}
            className='flex justify-center items-center gap-5 pt-3'
          >
            <div className='flex gap-5 w-full'>
              <SelectInput
                clearErrors={clearErrors}
                control={control}
                label='Zone*'
                name='zone'
                options={EZonesArray}
                setError={setError}
                setValue={setValue}
                validation={searchSelectValidation('Zone')}
              />
              <NumInput
                control={control}
                name='pincode'
                handleChange={() => {}}
                placeholder='Enter PIN Code Requested'
                sx={{ minWidth: 300, marginBottom: '20px' }}
                label='PIN Code*'
                validation={txtFieldValidation(true)}
                handleBlue={(e) => {
                  if (e.target.value.length === 6) {
                    validatePincode(e.target.value)
                  }
                }}
              />
              <TxtInput
                control={control}
                name='remark'
                handleChange={() => {}}
                placeholder='Enter Remarks'
                sx={{ minWidth: 300, marginBottom: '20px' }}
                label='Remarks'
                validation={txtFieldValidation(false, 'Description')}
              />
            </div>
            <div className='text-center flex flex-col'>
              <Button
                color='mBlue'
                sx={{
                  minWidth: '100%',
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
          </form>
        </div>
      )}
      <div>
        <DashboardTablePage trigger={trigger} setTrigger={setTrigger} />
      </div>
    </section>
  )
}

export default DashBoardPage
