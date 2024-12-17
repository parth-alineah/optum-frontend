import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import Table from '@/components/Table'
import { ACTIONS_TABLE, Controls, HandleControls, HeadCell, TableStates } from '@/types/common'
import { useNotFound } from '@/context/NotFound'
import { EUserRole, limitOfPage, TABLES } from '@/utils/constants'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { EVerificationProcess, getList } from '@/lib/empanelmentCountAndList'

type Props = {
  handleOpen: () => void
  setType: Dispatch<SetStateAction<TableStates>>
  open: boolean
  type: TableStates
  handleClose: () => void
  isDefault: boolean
}

const PendingVerificationList = ({
  handleOpen,
  setType,
  open,
  type,
  handleClose,
  isDefault,
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
    const response = await getList(setLoading, showToast, setNotFound, notFound, {
      ...handleControls,
      status: EVerificationProcess.Pending,
    })
    if (response) {
      const { records, ...rest } = response
      if (records.length === 0) {
        setNotFound([TABLES.PENDING_FOR_VERIFICATION])
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
      id: 'providerName',
      label: 'DC Name',
      isSort: false,
    },
    {
      id: 'incrementalId',
      label: 'DCID',
      isSort: false,
    },
    {
      id: 'pincode',
      label: 'Pincode',
      isSort: false,
    },
    {
      id: 'createdAt',
      label: 'Date Time',
      isSort: false,
      type: 'dateTime',
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
        actions={[ACTIONS_TABLE.NAV, ACTIONS_TABLE.EDIT]}
        tableHeading={{
          tableId: TABLES.PENDING_FOR_VERIFICATION,
          tableName: 'Pending For Verification',
        }}
        notFound={notFound.includes(TABLES.PENDING_FOR_VERIFICATION)}
        btnTxtArray={[]}
        path='network-pending-verify-details'
        pathPermission={[EUserRole.Network]}
        handleEditAction={'network-pending-edit-details'}
        viewNotRequired={true}
      />
    </Box>
  )
}

export default PendingVerificationList
