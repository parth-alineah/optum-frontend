import { theme } from '@/context/ThemeProvider'
import { Button, Chip, DialogTitle, Divider, Switch } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import TxtInput from '@/components/TxtInput'
import { txtFieldValidation } from '@/utils/form.validation'
import { EApprovalStatus, EUserRole, limitOfPage, TABLES } from '@/utils/constants'
import {
  delistProvider,
  delistProviderForNetwork,
  modifyProvider,
  modifyProviderForNetwork,
  searchProviderForManage,
} from '@/lib/manage'
import { useEffect, useState } from 'react'
import { useNotFound } from '@/context/NotFound'
import ConfirmPopUp from '@/components/ConfirmBox'
import { useAuth } from '@/context/AuthContext'
import CustomDialog from '@/components/Dialog-custom'
import _ from 'lodash'

type Props = {}

const arr = [
  {
    name: 'Vardaan Diagnosis',
    providerName: 163635,
    address: 'B-502, Gota, Ahemedabad, Gujrat, India',
    status: 'Delist',
    deActivated: ['HDFC', 'IPRU'],
    activated: ['Max Life', 'RS', 'SBI'],
  },
  {
    name: 'Krishna Pathology Lab',
    providerName: 163335,
    address: 'B-602, Sola, Ahemedabad, Gujrat, India',
    status: '',
    deActivated: ['HDFC', 'IPRU'],
    activated: ['SBI'],
  },
  {
    name: 'Ashirwad Hospitals',
    providerName: 183635,
    address: 'A-502, Naroda, Ahemedabad, Gujrat, India',
    status: 'Delist',
    deActivated: ['HDFC', 'IPRU'],
    activated: ['Max Life'],
  },
  {
    name: 'Shah Pathology Lab',
    providerName: 177635,
    address: 'B-555, Helifax, Ontirio, Cananda',
    status: '',
    deActivated: ['IPRU'],
    activated: ['Max Life', 'RS', 'SBI'],
  },
  {
    name: 'Bombay Laboratory',
    providerName: 163995,
    address: 'B-502, Jamnagar, Purvanchal, Gujrat, India',
    status: 'Delist',
    deActivated: ['HDFC', 'IPRU'],
    activated: ['Max Life', 'SBI'],
  },
]

const getKeysByValue = (obj, valueToFind) =>
  Object.entries(obj)
    .filter(([key, value]) => value === valueToFind)
    .map(([key]) => key)

const ManagePage = (props: Props) => {
  const nav = useNavigate()
  const { setLoading } = useLoading()
  const showToast = useToast()
  const { setNotFound, notFound } = useNotFound()
  const { user } = useAuth()

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
  const [show, setShow] = useState(false)
  const [showModify, setShowModify] = useState(false)
  const [showFinal, setShowFinal] = useState(false)
  const [showSecondConfirm, setShowSecondConfirm] = useState(false)
  const [showModifyFinal, setShowModifyFinal] = useState(false)
  const [searchData, setSearchData] = useState(null)
  const [entity, setEntity] = useState<any | undefined>()
  const [controls, setControls] = useState<any>({})
  const [handleControls, setHandleControls] = useState<any>(defaultControls)
  const [switchStates, setSwitchStates] = useState<any>({})
  const [initialSwitchStates, setInitialSwitchStates] = useState<any>({})

  const { control, handleSubmit, clearErrors, setError, setValue } = useForm({
    defaultValues: {
      search: '',
    },
  })

  const getModifiedData = () => {
    setData([])
    setHandleControls(defaultControls)
  }

  const onSubmitHandle: SubmitHandler<any> = async (data) => {
    getModifiedData()
    setSearchData(data)
    const response = await searchProviderForManage(setLoading, showToast, setNotFound, notFound, {
      ...handleControls,
      search: data?.search,
    })
    if (response) {
      const { records, ...rest } = response
      if (records?.length === 0) {
        setNotFound([TABLES.MANAGE_SEARCH])
      } else {
        setNotFound([])
        setData(records)
        setControls(rest)
      }
    } else {
      setData([])
    }
  }

  const handleDelist = async (id: string) => {
    let res
    if (user?.role?.includes(EUserRole.Network)) {
      res = await delistProviderForNetwork(setLoading, showToast, id)
    } else {
      res = await delistProvider(setLoading, showToast, id)
    }
    if (res?.success) {
      setShowFinal(false)
      await onSubmitHandle(searchData)
    }
  }
  const getKeysByValue = (obj, valueToFind) =>
    Object.entries(obj)
      .filter(([key, value]) => value === valueToFind)
      .map(([key]) => key)
  const insurerMap = _.keyBy(entity?.insurers, 'insurerId')
  const insurerStatusMap = _.mapValues(insurerMap, 'isActive')
  const differences = _.pickBy(insurerStatusMap, (value, key) => {
    return switchStates[key] !== undefined && switchStates[key] !== value
  })
  const activateForInsurerIds =
    getKeysByValue(differences, false)?.length === 1 ? getKeysByValue(differences, false) : []
  const deactivateForInsurerIds =
    getKeysByValue(differences, true)?.length === 1 ? getKeysByValue(differences, true) : []
  const handleModify = async (id: string) => {
    let res

    if (user?.role?.includes(EUserRole.Network)) {
      res = await modifyProviderForNetwork(setLoading, showToast, {
        id: id,
        activateForInsurerIds,
        deactivateForInsurerIds,
      })
    } else {
      res = await modifyProvider(setLoading, showToast, {
        id: id,
        activateForInsurerIds,
        deactivateForInsurerIds,
      })
    }
    if (res?.success) {
      // setShowModifyFinal(false)
      setShowSecondConfirm(false)
      await onSubmitHandle(searchData)
    }
  }

  const initializeSwitchStates = (insurers: any[]) => {
    const initialStates = insurers.reduce(
      (acc, insurer) => {
        acc[insurer?.insurerId] = insurer?.isActive || false
        return acc
      },
      {} as Record<string, boolean>,
    )
    setInitialSwitchStates(initialStates)
    setSwitchStates(initialStates)
  }

  // const handleSwitchChange = (insurerId: string, isChecked: boolean) => {
  //   const updatedSwitchStates = { ...initialSwitchStates }

  //   if (isChecked) {
  //     Object.keys(updatedSwitchStates).forEach((id) => {
  //       updatedSwitchStates[id] = id === insurerId ? true : initialSwitchStates
  //     })
  //   } else {
  //     updatedSwitchStates[insurerId] = false
  //   }

  //   setSwitchStates(updatedSwitchStates)
  // }
  const handleSwitchChange = (insurerId: string, isChecked: boolean) => {
    const updatedSwitchStates = { ...initialSwitchStates }
    updatedSwitchStates[insurerId] = isChecked
    setSwitchStates(updatedSwitchStates)
  }
  return (
    <section>
      <div className='mt-5 mb-8'>
        <form
          onSubmit={handleSubmit(onSubmitHandle)}
          className='flex justify-center items-center gap-5 pt-3'
        >
          <div className='flex items-end justify-center gap-5'>
            <TxtInput
              control={control}
              name='search'
              handleChange={() => {}}
              placeholder='Search By Name, PIN & City'
              sx={{ minWidth: 300 }}
              label='Search'
              validation={txtFieldValidation(true)}
            />

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
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className='grid grid-cols-3 gap-5 w-full my-3'>
        {data?.length > 0 &&
          data?.map((x) => (
            <div
              className={`${x?.isDelist ? 'bg-white-main' : 'bg-white-main'} rounded-md min-h-20 z-10 shadow`}
              key={Math.random()}
            >
              <div className='flex justify-between items-center px-3 py-2 bg-lightGray-main'>
                <div className='flex flex-col '>
                  <div className='font-medium text-lg'>{x?.providerName}</div>
                  <span className='text-xs font-normal'>{x?.telephone}</span>
                </div>
                <span className='text-orange-main'>{x?.isDelist ? 'Delist' : ''}</span>
              </div>
              <Divider sx={{ borderWidth: '1px' }} />
              <div className='p-3 min-h-40 max-h-40'>
                <div>
                  {' '}
                  <span className='font-normal text-black-main'>Address : </span>
                  {x?.addressLineOne}, {x?.city}, {x?.state} - {x?.pincode}
                </div>
                <div className='mt-2 flex gap-2 items-center flex-wrap'>
                  {' '}
                  <span className='font-normal text-black-main'>Activated : </span>
                  {x?.insurers?.map((x) => {
                    if (x?.isActive) {
                      return <Chip label={x?.name} size='small' variant='outlined' />
                    }
                  })}
                </div>
                <div className='mt-2 mb-1 flex gap-2 items-center flex-wrap'>
                  {' '}
                  <span className='font-normal text-black-main'>Deactivated : </span>{' '}
                  {x?.insurers?.map((x) => {
                    if (!x?.isActive) {
                      return <Chip label={x?.name} size='small' variant='outlined' />
                    }
                  })}
                </div>
              </div>
              <Divider sx={{ borderWidth: '1px' }} />
              <div
                className={`${x?.isDelist ? 'bg-lightGray-main' : 'bg-white-main'} p-3 flex gap-5 items-center w-full justify-center`}
              >
                <Button
                  color='mBlue'
                  sx={{
                    minWidth: '80px',
                    maxWidth: '80px',
                    maxHeight: '35px',
                    minHeight: '35px',
                    color: theme.palette.mWhite.main,
                  }}
                  disabled={
                    x?.modifyRequest?.status === EApprovalStatus.Pending || x?.isDelist
                      ? true
                      : false
                  }
                  onClick={() => {
                    setShowModify(true)
                    setEntity(x)
                    initializeSwitchStates(x?.insurers || [])
                  }}
                >
                  Modify
                </Button>
                <Button
                  color='mWhite'
                  sx={{
                    minWidth: '80px',
                    maxWidth: '80px',
                    maxHeight: '35px',
                    minHeight: '35px',
                  }}
                  variant='contained'
                  disabled={
                    x?.delistRequest?.status === EApprovalStatus.Pending || x?.isDelist
                      ? true
                      : false
                  }
                  onClick={() => {
                    setShow(true)
                    setEntity(x)
                  }}
                >
                  Delist
                </Button>
              </div>
            </div>
          ))}
        {/* {data?.length > 0 && data?.length < controls?.total && (
          <div className='flex w-full justify-center items-center'>
            <span role='button' onClick={handleSeeMore}>
              See More...
            </span>
          </div>
        )} */}
      </div>
      {data?.length === 0 && (
        <div className='flex items-center justify-center my-10'>There is nothing to show here.</div>
      )}
      {show && (
        <ConfirmPopUp
          setOpenPopUp={setShow}
          openPopUp={show}
          handleYes={() => {
            setShow(false)
            setShowFinal(true)
          }}
          content={
            <>
              Are you sure you want to delist provider <b>{entity?.providerName}</b> with provider
              id <b>{entity?.incrementalId}</b>?
            </>
          }
        />
      )}
      {showFinal && (
        <ConfirmPopUp
          setOpenPopUp={setShowFinal}
          openPopUp={showFinal}
          handleYes={() => handleDelist(entity?._id)}
          content={
            <div className='text-center'>
              Are you absolutely sure? This action cannot be undone.
              <br /> You are about to delist
              <span className='font-bold'> {entity?.providerName} </span>
              (ID:
              <span className='font-bold'> {entity?.incrementalId} </span>).
            </div>
          }
          final={true}
        />
      )}
      {showModify && (
        <CustomDialog
          action={{ component: null, isAction: false }}
          handleClose={() => {
            setShowModify(false)
          }}
          open={showModify}
          header={{
            isHeader: true,
            component: <></>,
          }}
          maxWidth='xl'
          dialogStyleProps={{
            minWidth: 500,
          }}
          type={undefined}
        >
          <div className='flex flex-col gap-4 justify-center'>
            <div className='flex items-start justify-between flex-row'>
              <span className='text-lg font-black'>{entity?.providerName}</span>
              <span>{entity?.incrementalId}</span>
            </div>
            <div>
              <table className='w-full divide-y-2 '>
                <thead>
                  <tr>
                    <th className='w-[70%] text-start font-semibold'>Name</th>
                    <th className='w-[30%] text-start font-semibold'>Action</th>
                  </tr>
                </thead>
                <tbody className='w-full divide-y'>
                  {entity?.insurers?.map((x) => (
                    <tr key={x?.id}>
                      <td className='text-sm font-normal w-[70%]'>{x?.name}</td>
                      <td className='text-sm font-normal w-[30%]'>
                        <Switch
                          key={x?.insurerId}
                          onChange={(e) => {
                            handleSwitchChange(x?.insurerId, e.currentTarget.checked)
                          }}
                          checked={switchStates[x?.insurerId] || false}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex justify-center gap-5 px-5'>
              <Button
                color='mWhite'
                sx={{
                  minWidth: '120px',
                  maxWidth: '120px',
                }}
                onClick={() => {
                  setShowModify(false)
                }}
              >
                Cancel
              </Button>
              <Button
                color='mBlue'
                sx={{
                  minWidth: '120px',
                  maxWidth: '120px',
                  color: theme.palette.mWhite.main,
                }}
                onClick={() => {
                  setShowModify(false)
                  setShowModifyFinal(true)
                }}
                disabled={
                  activateForInsurerIds.length === 0 && deactivateForInsurerIds.length === 0
                }
              >
                Confirm
              </Button>
            </div>
          </div>
        </CustomDialog>
      )}
      {showModifyFinal && (
        <ConfirmPopUp
          setOpenPopUp={setShowModifyFinal}
          openPopUp={showModifyFinal}
          handleYes={() =>
            // handleModify(entity?._id)
            {
              setShowSecondConfirm(true)
              setShowModifyFinal(false)
            }
          }
          content={
            <>
              Are you sure want to {activateForInsurerIds.length !== 0 ? 'activate' : 'deactivate'}{' '}
              this{' '}
              <span className='font-bold'>
                {
                  entity?.insurers?.find(
                    (x) =>
                      x?.insurerId ===
                      (activateForInsurerIds.length !== 0
                        ? activateForInsurerIds[0]
                        : deactivateForInsurerIds[0]),
                  )?.name
                }{' '}
              </span>
              for provider <span className='font-bold'>{entity?.providerName}</span> with provider
              id <span className='font-bold'>{entity?.incrementalId}</span>?
            </>
          }
          final={true}
        />
      )}
      {showSecondConfirm && (
        <ConfirmPopUp
          setOpenPopUp={setShowSecondConfirm}
          openPopUp={showSecondConfirm}
          handleYes={
            () => handleModify(entity?._id)
            // {setShowSecondConfirm(true)
            // setShowModifyFinal(false)}
          }
          content={
            <>
              Please confirm again: You are about to{' '}
              {activateForInsurerIds.length !== 0 ? 'activate' : 'deactivate'} the{' '}
              <span className='font-bold'>
                {
                  entity?.insurers?.find(
                    (x) =>
                      x?.insurerId ===
                      (activateForInsurerIds.length !== 0
                        ? activateForInsurerIds[0]
                        : deactivateForInsurerIds[0]),
                  )?.name
                }{' '}
              </span>
              for the <span className='font-bold'>{entity?.providerName}</span> with the following
              details id <span className='font-bold'>{entity?.incrementalId}</span>?
            </>
          }
          final={true}
        />
      )}
    </section>
  )
}

export default ManagePage
