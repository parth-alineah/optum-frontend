import React, { Dispatch, SetStateAction, memo } from 'react'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import TableFooterControls from './TableFooterControls'
import TableHeaderControls from './TableHeaderControls'
import TableHeader from './TableHead'
import TableContent from './TableContent'
import {
  Actions,
  ACTIONS_TABLE,
  Controls,
  HandleControls,
  HeaderBtnTypes,
  TABLE_STATES,
  TableStates,
} from '@/types/common'
import { useNavigate } from 'react-router-dom'
import { EApprovalStatus, ERequestType } from '@/utils/constants'
import { EVerificationProcess } from '@/lib/empanelmentCountAndList'

type Props = {
  handleOpen: () => void
  setType: React.Dispatch<React.SetStateAction<TableStates>>
  setEntity: React.Dispatch<React.SetStateAction<any | undefined>>
  rows: any[]
  headCells: any[]
  controls: Controls
  actions: Actions
  tableHeading?: { tableId: string; tableName: string }
  handleControls: HandleControls
  setHandleControls: React.Dispatch<React.SetStateAction<HandleControls>>
  tabs?: { isTabs: boolean; tabComponent: any }
  btnTxtArray: HeaderBtnTypes
  notFound: boolean
  setSelectedRows?: React.Dispatch<React.SetStateAction<any[]>>
  selectedRows?: any[]
  isTableWithOutAction?: boolean
  handleSwitchInCell?: (controlName: string, switchState: boolean) => void
  viewNotRequired?: boolean
  permissionName?: string
  redirectPath?: string
  handleSign?: (item: any) => void
  path?: string
  pathPermission?: string[]
  handleEditAction?: string
  handleCheck?: (item: any) => void
  handleDownload?: (item: any) => void
}

const CustomTable = ({
  rows,
  headCells,
  actions,
  tableHeading,
  controls,
  handleControls,
  setHandleControls,
  handleOpen,
  setType,
  setEntity,
  tabs,
  setSelectedRows,
  selectedRows,
  notFound,
  isTableWithOutAction,
  btnTxtArray,
  handleSwitchInCell,
  viewNotRequired,
  permissionName,
  redirectPath,
  handleSign,
  path,
  pathPermission,
  handleEditAction,
  handleCheck,
  handleDownload,
}: Props) => {
  const nav = useNavigate()
  // Actions

  //Create
  const create = () => {
    setType(TABLE_STATES.ADD)
    setEntity(undefined)
    handleOpen()
  }

  //Edit
  const memoizedHandleEdit = (item: any) => {
    setEntity(item)
    nav(handleEditAction, {
      state: item,
    })
  }

  //Delete
  const memoizedHandleDelete = (item: any) => {
    setType(TABLE_STATES.DELETE)
    setEntity(item)
    handleOpen()
  }

  const memoizedHandleView = (item: any) => {
    if (
      (item?.requestType === ERequestType.Delist ||
        item?.requestType === ERequestType.Activate ||
        item?.requestType === ERequestType.Deactivate) &&
      redirectPath &&
      !viewNotRequired
    ) {
      // setType(TABLE_STATES.EDIT)
      // setEntity(item)
      // handleOpen()
      nav('/manage/nw', {
        state: item,
      })
    } else if (!viewNotRequired && redirectPath) {
      nav(redirectPath, {
        state: item,
      })
      // setType(TABLE_STATES.VIEW)
      // setEntity(item)
      // handleOpen()
    }
  }

  const memoizedHandleNavigate = (item: any) => {
    if (
      path
      // &&
      // (item?.verificationStatusByNw === EVerificationProcess.Pending ||
      //   item?.verificationStatusByLegal === EVerificationProcess.ReturnedByLegal)
    ) {
      nav(path, {
        state: item,
      })
    }
  }

  const memoizedHandleSign = (item: any) => {
    if (handleSign) {
      setEntity(item)
      handleSign(item)
    }
  }

  const memoizedHandleCheckStatus = (item: any) => {
    if (handleCheck) {
      setEntity(item)
      handleCheck(item)
    }
  }

  const handleSwitch = (item: any, switchState: boolean) => {
    if (!actions.includes(ACTIONS_TABLE.SWITCH)) {
      return
    } else {
      if (item.isActive) {
        setType(TABLE_STATES.ACTIVE)
      } else {
        setType(TABLE_STATES.INACTIVE)
      }
      setEntity(item)
      handleOpen()
    }
  }

  // Sorting, Searching and Pagination
  //search
  const search = (srhTxt: string) =>
    setHandleControls({ ...handleControls, search: srhTxt, currentPage: 1 })
  //sort
  const sort = (sort: string, sortOrder: number) =>
    setHandleControls({
      ...handleControls,
      sortParam: sort,
      currentPage: 1,
      sortOrder: sortOrder,
    })

  //Page
  const handlePage = (newPage: number) =>
    setHandleControls({ ...handleControls, currentPage: newPage })

  //RowsPerPage
  const handleRowsPerPage = (pageLimit: number) =>
    setHandleControls({
      ...handleControls,
      limitPerPage: pageLimit,
      currentPage: 1,
    })

  const view = () => {
    setType(TABLE_STATES.VIEW)
    setEntity(undefined)
    handleOpen()
  }
  const handleSwitchCell = (
    item: Record<string, any>,
    switchState: boolean,
    controlName: string,
  ) => {
    if (handleSwitchInCell) {
      handleSwitchInCell(controlName, switchState)
    }
    setType(TABLE_STATES.SWITCH_CELL)
    setEntity(item)
    handleOpen()
  }

  return (
    <Paper
      sx={{
        width: '100%',
        borderRadius: '5px',
        marginBottom: '10px',
      }}
      elevation={3}
    >
      <TableHeaderControls
        heading={tableHeading && tableHeading.tableName}
        searchFnc={search}
        clickFnc={create}
        tabs={tabs}
        btnTxtArray={btnTxtArray}
        selectedRows={selectedRows as any[]}
        clickView={view}
        permissionName={permissionName && permissionName}
      />
      <TableContainer className='scrollBar'>
        <Table aria-labelledby='tableTitle' size='medium'>
          <TableHeader
            headCells={headCells}
            sortFnc={sort}
            handleControls={handleControls}
            setSelectedRows={setSelectedRows as Dispatch<SetStateAction<any[]>>}
            selectedRows={selectedRows as any[]}
            rows={rows}
            isTableWithOutAction={isTableWithOutAction ? isTableWithOutAction : false}
          />
          <TableContent
            rows={rows}
            key={Math.random()}
            handleDelete={memoizedHandleDelete}
            handleEdit={memoizedHandleEdit}
            handleSwitch={handleSwitch}
            handleView={memoizedHandleView}
            actions={actions}
            headCells={headCells}
            selectedRows={selectedRows as any[]}
            setSelectedRows={setSelectedRows as Dispatch<SetStateAction<any[]>>}
            notFound={notFound}
            isTableWithOutAction={isTableWithOutAction ? isTableWithOutAction : false}
            controls={controls}
            handleSwitchCell={handleSwitchCell}
            permissionName={permissionName && permissionName}
            setType={setType}
            handleSign={memoizedHandleSign}
            handleCheckStatus={memoizedHandleCheckStatus}
            handleNav={memoizedHandleNavigate}
            pathPermission={pathPermission}
            viewNotRequired={viewNotRequired}
            handleDownloadDocusign={handleDownload}
          />
        </Table>
      </TableContainer>
      <TableFooterControls
        handlePage={handlePage}
        handleRowsPerPage={handleRowsPerPage}
        numberOfPages={controls.pages}
        from={controls.from}
        to={controls.to}
        total={controls.total}
        currentPage={controls.currentPage}
        handleControls={handleControls}
        notFound={notFound}
      />
    </Paper>
  )
}

export default memo(CustomTable)
