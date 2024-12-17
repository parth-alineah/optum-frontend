import { Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import Table from '@/components/Table'
import { Controls, HandleControls, HeadCell, TableStates } from '@/types/common'
import { useNotFound } from '@/context/NotFound'
import { EUserRole, limitOfPage, TABLES } from '@/utils/constants'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getOpenRequest } from '@/lib/empanelmentRequest'
import { useAuth } from '@/context/AuthContext'

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

const OpenRequestArray = [
  {
    requestNo: '12345',
    providerName: 'Dishank Patel',
    currentStatus: 'Empanelment',
    requestDate: '10-07-1024',
    pin: '383215',
  },
  {
    requestNo: '567891',
    providerName: 'Vishvajeet Zala',
    currentStatus: 'Empanelment',
    requestDate: '15-07-1024',
    pin: '385215',
  },
  {
    requestNo: '52326',
    providerName: 'Parth Parmar',
    currentStatus: 'Empanelment',
    requestDate: '11-07-1024',
    pin: '78s3215',
  },
  {
    requestNo: '567591',
    providerName: 'Yash Patel',
    currentStatus: 'Empanelment',
    requestDate: '15-07-1024',
    pin: '385215',
  },
]

const OpenRequestList = ({
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

  const { control, handleSubmit, clearErrors, setError, setValue } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const getData = async () => {
    const response = await getOpenRequest(
      setLoading,
      showToast,
      setNotFound,
      notFound,
      handleControls,
    )
    if (response) {
      const { records, ...rest } = response
      if (records.length === 0) {
        setNotFound([TABLES.OPEN_REQUEST])
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
      id: 'parentFdId',
      label: 'Parent Request No',
      isSort: false,
      type: 'navigate',
    },
    {
      id: 'requestedPin',
      label: 'Request PIN',
      isSort: false,
      width: 60,
    },
    {
      id: 'ticketId',
      label: 'Request No',
      isSort: false,
      width: 60,
    },
    {
      id: 'requestType',
      label: 'Request Type',
      isSort: false,
      width: 60,
    },
    {
      id: 'providerName',
      label: 'Provider Name',
      isSort: false,
    },
    {
      id: 'statusId',
      label: 'Current Status',
      isSort: false,
      type: 'currentStatus',
    },
    {
      id: 'createdAt',
      label: 'Request Date',
      isSort: false,
      type: 'date',
      width: 60,
    },
    {
      id: 'pincode',
      label: 'PIN',
      isSort: false,
      width: 60,
    },
  ]

  const { user } = useAuth()

  return (
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
          tableId: TABLES.OPEN_REQUEST,
          tableName: 'Open Request',
        }}
        notFound={notFound.includes(TABLES.OPEN_REQUEST)}
        btnTxtArray={[]}
        isTableWithOutAction={true}
        // redirectPath={user?.role?.includes(EUserRole.Network) ? '/empanelment/perspective' : ''}
        viewNotRequired={true}
      />
    </Box>
  )
}

export default OpenRequestList
