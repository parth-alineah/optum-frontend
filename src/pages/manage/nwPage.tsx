import { theme } from '@/context/ThemeProvider'
import { Button, Chip, Divider, Switch } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import { EApprovalStatus, ERequestType, EUserRole } from '@/utils/constants'
import {
  delistProviderApproveRejectFromDashboardForNetwork,
  modifyProviderApproveRejectFromDashboardForNetwork,
  providerDetails,
} from '@/lib/manage'
import { useEffect, useState } from 'react'
import ConfirmPopUp from '@/components/ConfirmBox'
import { useAuth } from '@/context/AuthContext'
import _ from 'lodash'

type Props = {}

const ManageForNwPage = (props: Props) => {
  const { state } = useLocation()

  const nav = useNavigate()
  const { setLoading } = useLoading()
  const showToast = useToast()
  const { user } = useAuth()

  // Record and Control States
  const [data, setData] = useState(null)
  const [show, setShow] = useState(false)
  const [showModify, setShowModify] = useState(false)
  const [showFinal, setShowFinal] = useState(false)
  const [showModifyFinal, setShowModifyFinal] = useState(false)
  const [entity, setEntity] = useState<any | undefined>()

  const getData = async () => {
    const res = await providerDetails(setLoading, showToast, state)
    if (res?.success) {
      setData(res?.data)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleDelist = async (id: string) => {
    const res = await delistProviderApproveRejectFromDashboardForNetwork(setLoading, showToast, {
      ticketId: id,
      status: EApprovalStatus.Approved,
    })
    if (res?.success) {
      setShowFinal(false)
      nav('/dashboard?tab=2')
    }
  }

  const handleModify = async (id: string) => {
    const res = await modifyProviderApproveRejectFromDashboardForNetwork(setLoading, showToast, {
      ticketId: id,
      status: EApprovalStatus.Approved,
    })
    if (res?.success) {
      setShowModifyFinal(false)
      nav('/dashboard?tab=2')
    }
  }

  const changed = _.find(data?.insurers, {
    insurerId:
      data?.modifyRequest?.activateForInsurerIds?.length === 1
        ? data?.modifyRequest?.activateForInsurerIds[0]
        : data?.modifyRequest?.deactivateForInsurerIds[0],
  })

  return (
    <section>
      <div className='mt-3 mb-8'>
        <div className='flex items-center py-2 w-full px-4 bg-white-main shadow rounded-md justify-between gap-5 mb-3'>
          <div className='flex gap-10'>
            <span className='text-base font-semibold italic'>
              {state?.requestType === ERequestType.Delist ? 'Delist' : 'Modify'} Provider
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
        <div className='grid grid-cols-3 gap-5 w-full my-5'>
          {data && (
            <div className={`bg-white-main rounded-md min-h-20 z-10 shadow`} key={Math.random()}>
              <div className='flex justify-between items-center px-3 py-2 bg-lightGray-main'>
                <div className='flex flex-col '>
                  <div className='font-medium text-lg'>{data?.providerName}</div>
                  <span className='text-xs font-normal'>{data?.telephone}</span>
                </div>
                <span className='text-orange-main'>{data?.isDelist ? 'Delist' : ''}</span>
              </div>
              <Divider sx={{ borderWidth: '1px' }} />
              <div className='p-3'>
                <div>
                  {' '}
                  <span className='font-normal text-black-main'>Address : </span>
                  {data?.addressLineOne}, {data?.city}, {data?.data} - {data?.pincode}
                </div>
                <div className='mt-2 flex gap-2 items-center flex-wrap'>
                  {' '}
                  <span className='font-normal text-black-main'>Activated : </span>
                  {data?.insurers?.map((x) => {
                    if (x?.isActive) {
                      return <Chip label={x?.name} size='small' variant='outlined' />
                    }
                  })}
                </div>
                <div className='mt-2 mb-1 flex gap-2 items-center flex-wrap'>
                  {' '}
                  <span className='font-normal text-black-main'>Deactivated : </span>{' '}
                  {data?.insurers?.map((x) => {
                    if (!x?.isActive) {
                      return <Chip label={x?.name} size='small' variant='outlined' />
                    }
                  })}
                </div>
                {state?.requestType !== ERequestType.Delist && (
                  <div className='mt-2 mb-1 flex gap-2 items-center flex-wrap'>
                    {data?.modifyRequest?.activateForInsurerIds?.length === 1 ? (
                      <span className='font-normal'>
                        This is a request to activate <b>{changed?.name}</b>
                      </span>
                    ) : (
                      <span className='font-normal'>
                        This is a request to deactivate <b>{changed?.name}</b>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Divider sx={{ borderWidth: '1px' }} />
              <div
                className={`${data?.isDelist ? 'bg-lightGray-main' : 'bg-white-main'} p-3 flex gap-5 items-center w-full justify-center`}
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
                  disabled={state?.requestType === ERequestType.Delist ? true : false}
                  onClick={() => {
                    if (state?.requestType !== ERequestType.Delist) {
                      setShowModify(true)
                      setEntity(data)
                    }
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
                  disabled={state?.requestType !== ERequestType.Delist ? true : false}
                  onClick={() => {
                    if (state?.requestType === ERequestType.Delist) {
                      setShow(true)
                      setEntity(data)
                    }
                  }}
                >
                  Delist
                </Button>
              </div>
            </div>
          )}
        </div>
        {!data && (
          <div className='flex items-center justify-center my-10'>
            There is nothing to show here.
          </div>
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
            handleYes={() => handleDelist(state?._id)}
            content={<>Are you absolutely sure? This action cannot be undone.</>}
            final={true}
          />
        )}
        {showModify && (
          <ConfirmPopUp
            setOpenPopUp={setShowModify}
            openPopUp={showModify}
            handleYes={() => {
              setShowModify(false)
              setShowModifyFinal(true)
            }}
          />
        )}
        {showModifyFinal && (
          <ConfirmPopUp
            setOpenPopUp={setShowModifyFinal}
            openPopUp={showModifyFinal}
            handleYes={() => handleModify(state?._id)}
            content={<>Are you absolutely sure? This action cannot be undone.</>}
            final={true}
          />
        )}
      </div>
    </section>
  )
}

export default ManageForNwPage
