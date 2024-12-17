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
import {
  EVerificationProcess,
  getList,
  processForDocumentSignatureByLegal,
} from '@/lib/empanelmentCountAndList'

type Props = {
  handleOpen: () => void
  setType: Dispatch<SetStateAction<TableStates>>
  open: boolean
  type: TableStates
  handleClose: () => void
  isDefault: boolean
}

const VerificationList = ({ handleOpen, setType, open, type, handleClose, isDefault }: Props) => {
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
      status: EVerificationProcess.Verified,
    })
    if (response) {
      const { records, ...rest } = response
      if (records?.length === 0) {
        setNotFound([TABLES.VERIFICATION])
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
      label: 'Provider Name',
      isSort: false,
    },
    {
      id: 'incrementalId',
      label: 'Provider ID',
      isSort: false,
    },
    {
      id: 'pincode',
      label: 'PIN',
      isSort: false,
    },
    {
      id: 'nwUserName',
      label: 'Network',
      isSort: false,
    },
    {
      id: 'legalUserName',
      label: 'Legal',
      isSort: false,
    },
    {
      id: 'verifiedByLegalDate',
      label: 'Verified Date Time',
      isSort: false,
      type: 'dateTime',
    },
  ]

  const { user } = useAuth()

  const handleDocumentSignature = async (id: string) => {
    const res = await processForDocumentSignatureByLegal(setLoading, showToast, id)
    if (res) {
      getData()
    }
  }

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
        actions={[ACTIONS_TABLE.SIGN, ACTIONS_TABLE.NAV]}
        tableHeading={{
          tableId: TABLES.VERIFICATION,
          tableName: 'Verified',
        }}
        notFound={notFound.includes(TABLES.VERIFICATION)}
        btnTxtArray={[]}
        path='legal-verify-details'
        pathPermission={[EUserRole.Legal]}
        handleSign={(data) => {
          handleDocumentSignature(data)
        }}
        viewNotRequired={true}
      />
    </Box>
  )
}

export default VerificationList
