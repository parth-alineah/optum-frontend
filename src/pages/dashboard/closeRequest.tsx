import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import Table from '@/components/Table'
import { ACTIONS_TABLE, Controls, HandleControls, HeadCell, TableStates } from '@/types/common'
import { useNotFound } from '@/context/NotFound'
import { limitOfPage, TABLES } from '@/utils/constants'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getCloseRequest } from '@/lib/empanelmentRequest'

type Props = {
  handleOpen: () => void
  setType: Dispatch<SetStateAction<TableStates>>
  open: boolean
  type: TableStates
  handleClose: () => void
  isDefault: boolean
}

const CloseRequestArray = [
  {
    requestNo: '12345',
    providerName: 'Dishank Patel',
    requestType: 'Empanelment',
    dateClosed: '10-07-1024',
    requestDate: '10-07-1024',
    pin: '383215',
  },
  {
    requestNo: '567891',
    providerName: 'Vishvajeet Zala',
    requestType: 'Empanelment',
    dateClosed: '10-07-1024',
    requestDate: '15-07-1024',
    pin: '385215',
  },
  {
    requestNo: '52326',
    providerName: 'Parth Parmar',
    requestType: 'Empanelment',
    dateClosed: '10-07-1024',
    requestDate: '11-07-1024',
    pin: '78s3215',
  },
]

const CloseRequestList = ({ handleOpen, setType, open, type, handleClose, isDefault }: Props) => {
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
    const response = await getCloseRequest(
      setLoading,
      showToast,
      setNotFound,
      notFound,
      handleControls,
    )
    if (response) {
      const { records, ...rest } = response
      if (records.length === 0) {
        setNotFound([TABLES.CLOSE_REQUEST])
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
  }, [])

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
      id: 'providerName',
      label: 'Provider Name',
      isSort: false,
    },
    {
      id: 'createdAt',
      label: 'Request Date',
      isSort: false,
      type: 'date',
    },
    {
      id: 'closedAt',
      label: 'Close Date',
      isSort: false,
      type: 'date',
    },
    {
      id: 'pincode',
      label: 'PIN',
      isSort: false,
    },
  ]

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
          tableId: TABLES.CLOSE_REQUEST,
          tableName: 'Close Request',
        }}
        notFound={notFound.includes(TABLES.CLOSE_REQUEST)}
        btnTxtArray={[]}
        viewNotRequired={true}
        isTableWithOutAction={true}
      />
    </Box>
  )
}

export default CloseRequestList
