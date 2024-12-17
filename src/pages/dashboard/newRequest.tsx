import { Box, Button, DialogTitle } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import Table from '@/components/Table'
import { Controls, HandleControls, HeadCell, TABLE_STATES, TableStates } from '@/types/common'
import { useNotFound } from '@/context/NotFound'
import { EApprovalStatus, EUserRole, limitOfPage, TABLES } from '@/utils/constants'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getNewRequest } from '@/lib/empanelmentRequest'
import { useAuth } from '@/context/AuthContext'
import { theme } from '@/context/ThemeProvider'
import CustomDialog from '@/components/Dialog-custom'
import { delistProviderApproveRejectFromDashboardForNetwork } from '@/lib/manage'

type Props = {
  handleOpen: () => void
  setType: Dispatch<SetStateAction<TableStates>>
  open: boolean
  type: TableStates
  handleClose: () => void
  isDefault: boolean
  trigger: boolean
  setTrigger: Dispatch<SetStateAction<boolean>>
}

const NewRequestList = ({
  handleOpen,
  setType,
  open,
  type,
  handleClose,
  isDefault,
  trigger,
  setTrigger,
}: Props) => {
  const nav = useNavigate()
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
  const [entity, setEntity] = useState<any | undefined>()
  const [controls, setControls] = useState({})
  const [handleControls, setHandleControls] = useState<HandleControls>(defaultControls)

  const getData = async () => {
    const response = await getNewRequest(
      setLoading,
      showToast,
      setNotFound,
      notFound,
      handleControls,
    )
    if (response) {
      const { records, ...rest } = response
      if (records.length === 0) {
        setNotFound([TABLES.NEW_REQUEST])
      } else {
        setNotFound([])
        setData(records)
        setControls(rest)
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
    getModifiedData()
    setTrigger(false)
  }, [trigger])

  useEffect(() => {
    getData()
  }, [handleControls])

  const headCells: HeadCell[] = [
    {
      id: 'ticketId',
      label: 'Request No',
      isSort: false,
    },
    {
      id: 'requestType',
      label: 'Request Type',
      isSort: false,
    },
    {
      id: 'createdAt',
      label: 'Request Date',
      isSort: false,
      type: 'date',
    },
    {
      id: 'pincode',
      label: 'PIN',
      isSort: false,
    },
  ]
  const { user } = useAuth()
  const handleDelistRequest = async (ticketId: string, status: string) => {
    const res = await delistProviderApproveRejectFromDashboardForNetwork(setLoading, showToast, {
      ticketId: ticketId,
      status: status,
    })
    if (res?.success) {
      handleClose()
      getModifiedData()
    }
  }
  return (
    <>
      <Box>
        <Table
          handleOpen={handleOpen}
          setType={setType}
          setEntity={setEntity}
          rows={data}
          headCells={headCells}
          controls={controls as Controls}
          handleControls={handleControls}
          setHandleControls={setHandleControls}
          actions={[]}
          tableHeading={{
            tableId: TABLES.NEW_REQUEST,
            tableName: 'New Request',
          }}
          notFound={notFound.includes(TABLES.NEW_REQUEST)}
          btnTxtArray={[]}
          isTableWithOutAction={true}
          redirectPath={user?.role?.includes(EUserRole.Network) ? '/empanelment/perspective' : ''}
          viewNotRequired={!user?.role?.includes(EUserRole.Network)}
        />
      </Box>
      {type === TABLE_STATES.EDIT && (
        <CustomDialog
          action={{ component: null, isAction: false }}
          handleClose={handleClose}
          open={open}
          header={{
            isHeader: true,
            component: <></>,
          }}
          maxWidth='xl'
          dialogStyleProps={{
            minWidth: 450,
          }}
          type={undefined}
        >
          <div className='flex flex-col gap-4 items-center justify-center'>
            <p className='p-2 rounded-md text-xl font-bold'>
              Are you sure you want to perform this action?
            </p>
            <div className='flex justify-between gap-3 px-5'>
              <Button
                color='mWhite'
                sx={{
                  minWidth: '120px',
                  maxWidth: '120px',
                }}
                onClick={handleClose}
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
                  handleDelistRequest(entity?._id, EApprovalStatus.Approved)
                }}
              >
                Confirm
              </Button>
              <Button
                color='mBlue'
                sx={{
                  minWidth: '120px',
                  maxWidth: '120px',
                  color: theme.palette.mWhite.main,
                }}
                onClick={() => {
                  handleDelistRequest(entity?._id, EApprovalStatus.Rejected)
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        </CustomDialog>
      )}
    </>
  )
}

export default NewRequestList
