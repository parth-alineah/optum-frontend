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
  CheckStatusForDocumentSignature,
  EDocusignStatus,
  EVerificationProcess,
  FinalEmpanelStatus,
  getList,
  getListForLegal,
  processForDocumentSignatureByLegal,
} from '@/lib/empanelmentCountAndList'
import { EMPANELMENT_COUNT_AND_LIST } from 'src/utils/endPoints'
import { VITE_APP_API_URL } from 'src/utils/envVariables'

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

  const checkStatus = async (item: any) => {
    if (item.envelopeStatus !== EDocusignStatus.completed) {
      const res = await CheckStatusForDocumentSignature(setLoading, showToast, item?.envelopeId)
      if (res?.success) {
        showToast('info', `Envelope status ${res?.data?.envelope?.envelopeStatus}`)
        getData()
      }
    } else {
      const res = await FinalEmpanelStatus(setLoading, showToast, item?._id)
      if (res?.success) {
        getData()
      }
    }
  }

  const downloadPdf = async (id: string) => {
    window.open(VITE_APP_API_URL + EMPANELMENT_COUNT_AND_LIST.DownloadDocusign + id, '_blank')
  }

  const getData = async () => {
    const response = await getListForLegal(
      setLoading,
      showToast,
      setNotFound,
      notFound,
      handleControls,
    )
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
      id: 'parentTicketFdId',
      label: 'Parent Req',
      isSort: false,
      width: 100,
    },
    {
      id: 'childTicketFdId',
      label: 'Request No',
      isSort: false,
      width: 100,
    },
    {
      id: 'empanelmentStatus',
      label: 'Empanelment',
      isSort: false,
      width: 80,
    },
    {
      id: 'providerName',
      label: 'Provider Name',
      isSort: false,
      width: 120,
    },
    {
      id: 'incrementalId',
      label: 'Provider ID',
      isSort: false,
      width: 100,
    },
    {
      id: 'pincode',
      label: 'PIN',
      isSort: false,
      width: 70,
    },
    {
      id: 'childTicketStatus',
      label: 'Current Status',
      isSort: false,
      width: 70,
      type: 'currentStatus',
    },
    // {
    //   id: 'nwUserName',
    //   label: 'Network',
    //   isSort: false,
    //   width: 100,
    // },
    // {
    //   id: 'verificationStatusByLegal',
    //   label: 'Legal Status',
    //   isSort: false,
    //   width: 100,
    // },
    {
      id: 'verifiedByNwDate',
      label: 'Verified By Nw',
      isSort: false,
      type: 'dateTime',
    },
  ]

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
        actions={[
          ACTIONS_TABLE.NAV,
          ACTIONS_TABLE.SIGN,
          ACTIONS_TABLE.CHECK_STATUS,
          ACTIONS_TABLE.DOWNLOAD,
        ]}
        tableHeading={{
          tableId: TABLES.PENDING_FOR_VERIFICATION,
          tableName: 'Verification',
        }}
        notFound={notFound.includes(TABLES.PENDING_FOR_VERIFICATION)}
        btnTxtArray={[]}
        path='legal-pending-verify-details'
        pathPermission={[EUserRole.Legal]}
        handleSign={(data) => {
          handleDocumentSignature(data)
        }}
        viewNotRequired={true}
        handleCheck={(data) => {
          checkStatus(data)
        }}
        handleDownload={(data) => {
          downloadPdf(data)
        }}
      />
    </Box>
  )
}

export default PendingVerificationList
