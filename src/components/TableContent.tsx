import {
  Grid,
  IconButton,
  Switch,
  TableBody,
  TableCell,
  TableRow,
  Link,
  Tooltip,
} from '@mui/material'
import {
  Actions,
  ACTIONS_TABLE,
  HeadCell,
  sortTableRowsByHeadCells,
  TableStates,
} from '@/types/common'
import TableRowCell from './TableRowCells'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import {
  EDCEmpanelmentStatus,
  EDocusignStatus,
  EVerificationProcess,
} from '@/lib/empanelmentCountAndList'
import { theme } from '@/context/ThemeProvider'
import { useAuth } from '@/context/AuthContext'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

type Props = {
  rows: any[]
  handleEdit: (item: any) => void
  handleDelete: (item: any) => void
  handleSwitch: (item: any, switchState: boolean) => void
  handleSwitchCell: (item: any, switchState: boolean, controlName: string) => void
  handleView: (item: any) => void
  actions: Actions
  headCells: HeadCell[]
  selectedRows: any[]
  setSelectedRows: Dispatch<SetStateAction<any[]>>
  notFound: boolean
  isTableWithOutAction: boolean
  controls: any
  permissionName?: string
  setType: Dispatch<React.SetStateAction<TableStates>>
  handleSign: (item: any) => void
  handleNav: (item: any) => void
  pathPermission: string[]
  viewNotRequired: boolean
  handleCheckStatus: (item: any) => void
  handleDownloadDocusign: (item: any) => void
}

const TableContent = ({
  rows,
  handleEdit,
  handleDelete,
  handleSwitch,
  handleView,
  actions,
  headCells,
  selectedRows,
  setSelectedRows,
  notFound,
  controls,
  handleSwitchCell,
  permissionName,
  setType,
  handleSign,
  handleNav,
  pathPermission,
  viewNotRequired,
  handleCheckStatus,
  handleDownloadDocusign,
}: Props) => {
  const showToast = useToast()
  const { user } = useAuth()
  // const [role, setRole] = useState(null)
  // const [dRole, setDRole] = useState(null)
  // const user = JSON.parse(localStorage.getItem('user'))

  // const getUserUpdatePermissions = (permissions: Permissions) => {
  //   const modulePermissions = {}

  //   for (const [module, actions] of Object.entries(permissions)) {
  //     modulePermissions[module] = actions.update
  //   }

  //   return modulePermissions
  // }
  // const getUserDeletePermissions = (permissions: Permissions) => {
  //   const modulePermissions = {}

  //   for (const [module, actions] of Object.entries(permissions)) {
  //     modulePermissions[module] = actions.delete
  //   }

  //   return modulePermissions
  // }
  // useEffect(() => {
  //   if (!user.systemAdmin) {
  //     const p = JSON.parse(localStorage.getItem('permissions'))
  //     if (p) {
  //       const r = getUserUpdatePermissions(p)
  //       const d = getUserDeletePermissions(p)
  //       if (r) {
  //         setRole(r)
  //       }
  //       if (d) {
  //         setDRole(d)
  //       }
  //     }
  //   }
  // }, [])
  // const handleChecked = (checked: boolean, row: any) => {
  //   if (selectedRows.find((x) => x._id == row._id)) {
  //     const arr = selectedRows.filter((x) => x._id !== row._id)
  //     setSelectedRows(arr)
  //   } else {
  //     setSelectedRows((prevSelectedRows) => [...prevSelectedRows, row])
  //   }
  // }
  const handleChecked = (checked, row) => {
    const exist = localStorage.getItem('testIds')
    const selected = JSON.parse(exist)

    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, row])
      let combined
      if (selected) {
        combined = [...selected, row._id]
      } else {
        combined = [row._id]
      }
      localStorage.setItem('testIds', JSON.stringify(combined))
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((selectedRow) => selectedRow._id !== row._id),
      )
      const filtered = selected.filter((x) => x !== row._id)
      localStorage.setItem('testIds', JSON.stringify(filtered))
    }
  }
  const rowProps = {
    paddingY: '5px',
  }
  return (
    <>
      {!notFound && (
        <TableBody
          sx={{
            maxWidth: '300px',
            overflow: 'scroll',
          }}
        >
          {rows.map((row, indexRow) => {
            const _isNewRecord = row.isNewRecord
            let tableRows: HeadCell[] = []
            if (row?.image) {
              const { image, ...rest } = row
              tableRows = sortTableRowsByHeadCells(Object.keys(rest), headCells)
            } else {
              const { ...rest } = row
              tableRows = sortTableRowsByHeadCells(Object.keys(rest), headCells)
            }

            return (
              <TableRow
                role='checkbox'
                tabIndex={-1}
                key={row._id ?? row.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.palette.mLightGray?.main,
                  },
                }}
              >
                {tableRows.map((x, i) => {
                  return (
                    <TableRowCell
                      setType={setType}
                      x={x}
                      i={i}
                      row={row}
                      rowIndex={indexRow}
                      controls={controls}
                      key={Math.random()}
                      handleView={handleView}
                      selectedRows={selectedRows}
                      handleChecked={handleChecked}
                      lastIndex={rows.length - 1}
                      onClickViewFnc={handleView}
                      handleSwitchCell={handleSwitchCell}
                      viewNotRequired={viewNotRequired}
                    />
                  )
                })}
                <TableCell
                  align='left'
                  padding='none'
                  sx={{
                    position: 'sticky',
                    right: 0,
                    ...rowProps,
                  }}
                >
                  <Grid display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    {actions.includes(ACTIONS_TABLE.NAV) && (
                      <Tooltip title='Open' arrow placement='left-start'>
                        <Grid item>
                          <Link
                            sx={{
                              display: 'inline-block',
                              fontWeight: '600',
                              fontSize: '14px',
                              color: `${
                                // user?.role?.includes(pathPermission) &&
                                // (row?.verificationStatusByNw === EVerificationProcess.Pending ||
                                //   row?.verificationStatusByLegal ===
                                //     EVerificationProcess.ReturnedByLegal)
                                //   ?
                                '#004DAA'
                                // : theme.palette.mDarkGray?.main
                              }`,
                              cursor: `${
                                // user?.role?.includes(pathPermission) &&
                                // (row?.verificationStatusByNw === EVerificationProcess.Pending ||
                                //   row?.verificationStatusByLegal ===
                                //     EVerificationProcess.ReturnedByLegal)
                                //   ?
                                'pointer'
                                // : 'default'
                              }`,
                              marginRight: '10px',
                            }}
                            onClick={() => {
                              if (user?.role?.includes(pathPermission)) {
                                handleNav(row)
                              }
                            }}
                          >
                            Open
                          </Link>
                        </Grid>
                      </Tooltip>
                    )}
                    {actions.includes(ACTIONS_TABLE.VIEW) && (
                      <Tooltip title='View' arrow>
                        <Grid item>
                          <Link
                            sx={{
                              display: 'inline-block',
                              fontWeight: '600',
                              fontSize: '14px',
                              color: '#004DAA',
                              marginRight: '10px',
                            }}
                            onClick={() => handleView(row)}
                          >
                            View
                          </Link>
                        </Grid>
                      </Tooltip>
                    )}
                    {actions.includes(ACTIONS_TABLE.EDIT) && (
                      <Tooltip title='Edit' arrow>
                        <Grid item>
                          <Link
                            sx={{
                              display: 'inline-block',
                              fontWeight: '600',
                              fontSize: '14px',
                              color: `${
                                user?.role?.includes(pathPermission) &&
                                (row?.verificationStatusByNw === EVerificationProcess.Pending ||
                                  row?.verificationStatusByLegal ===
                                    EVerificationProcess.ReturnedByLegal)
                                  ? '#004DAA'
                                  : theme.palette.mDarkGray?.main
                              }`,
                              cursor: `${
                                user?.role?.includes(pathPermission) &&
                                (row?.verificationStatusByNw === EVerificationProcess.Pending ||
                                  row?.verificationStatusByLegal ===
                                    EVerificationProcess.ReturnedByLegal)
                                  ? 'pointer'
                                  : 'default'
                              }`,
                              marginRight: '10px',
                            }}
                            onClick={() => {
                              if (
                                user?.role?.includes(pathPermission) &&
                                (row?.verificationStatusByNw === EVerificationProcess.Pending ||
                                  row?.verificationStatusByLegal ===
                                    EVerificationProcess.ReturnedByLegal)
                              ) {
                                handleEdit(row)
                              }
                            }}
                          >
                            Edit
                          </Link>
                        </Grid>
                      </Tooltip>
                    )}
                    {/* {actions.includes(ACTIONS_TABLE.DELETE) && (
                          <Tooltip title='Delete' arrow>
                            <Grid
                              item
                              sx={{
                                cursor:
                                  row.isActive && actions.includes(ACTIONS_TABLE.SWITCH)
                                    ? 'not-allowed'
                                    : 'pointer',
                              }}
                            >
                              <IconButton
                                onClick={() => {
                                  if (
                                    (dRole && dRole[permissionName] && !row.isActive) ||
                                    (!row.isActive && user.systemAdmin)
                                    // &&
                                    // !actions.includes(ACTIONS_TABLE.SWITCH)
                                  ) {
                                    handleDelete(row)
                                  } else {
                                    showToast(
                                      'info',
                                      row.isActive && actions.includes(ACTIONS_TABLE.SWITCH)
                                        ? COMMON_MESSAGE.Inactive
                                        : `You don't have permission to delete record`,
                                    )
                                  }
                                  // if (row.isActive && actions.includes(ACTIONS_TABLE.SWITCH)) {
                                  //   showToast('info', COMMON_MESSAGE.Inactive)
                                  // } else {
                                  //   handleDelete(row)
                                  // }
                                }}
                                sx={{
                                  cursor:
                                    row.isActive && actions.includes(ACTIONS_TABLE.SWITCH)
                                      ? 'not-allowed'
                                      : 'pointer',
                                }}
                                disableRipple={row.isActive && actions.includes(ACTIONS_TABLE.SWITCH)}
                              >
                                <DeleteIcon
                                  sx={{
                                    color:
                                      (dRole && dRole[permissionName] && !row.isActive) ||
                                      (!row.isActive && user.systemAdmin)
                                        ? //? row.isActive && actions.includes(ACTIONS_TABLE.SWITCH)
                                          theme.palette.mLightOrange.main
                                        : theme.palette.mMediumGray.main,
                                  }}
                                />
                              </IconButton>
                            </Grid>
                          </Tooltip>
                        )} */}
                    {actions.includes(ACTIONS_TABLE.SWITCH) && (
                      <Tooltip title='Switch' arrow>
                        <Grid item>
                          <Switch
                            onChange={(e) => {
                              handleSwitch(row, e.currentTarget.checked)
                            }}
                            checked={row.isActive}
                          />
                        </Grid>
                      </Tooltip>
                    )}
                    {actions.includes(ACTIONS_TABLE.SIGN) && (
                      <Tooltip title='Document Signature' arrow placement='left-start'>
                        <Grid item>
                          <Link
                            sx={{
                              display: 'inline-block',
                              fontWeight: '600',
                              fontSize: '14px',
                              color: row?.canRetry ? '#004DAA' : theme.palette.mDarkGray?.main,
                              marginRight: '10px',
                              cursor:
                                // (!row?.envelopeId || row?.envelopeId === '') &&
                                // row?.empanelmentStatus === EDCEmpanelmentStatus.Pending &&
                                // row?.verificationStatusByLegal === EVerificationProcess.Verified &&
                                row?.canRetry ? 'pointer' : 'default',
                            }}
                            onClick={() => {
                              if (row?.canRetry) {
                                handleSign(row?._id)
                              }
                            }}
                          >
                            Re-Sign
                          </Link>
                        </Grid>
                      </Tooltip>
                    )}
                    {actions.includes(ACTIONS_TABLE.CHECK_STATUS) && (
                      <Tooltip
                        title={
                          row?.envelopeId &&
                          row?.envelopeId !== '' &&
                          row.envelopeStatus !== EDocusignStatus.completed
                            ? 'Check Status'
                            : 'Empanel'
                        }
                        arrow
                        placement='left-start'
                      >
                        <Grid item>
                          <Link
                            sx={{
                              display: 'inline-block',
                              fontWeight: '600',
                              fontSize: '14px',
                              color:
                                row?.envelopeId && row?.envelopeId !== ''
                                  ? // && row.envelopeStatus !== EDocusignStatus.completed
                                    '#004DAA'
                                  : theme.palette.mDarkGray?.main,
                              marginRight: '10px',
                              cursor:
                                row?.envelopeId && row?.envelopeId !== ''
                                  ? //&& row.envelopeStatus !== EDocusignStatus.completed
                                    'pointer'
                                  : 'default',
                            }}
                            onClick={() => {
                              if (
                                row?.envelopeId &&
                                row?.envelopeId !== ''
                                //  && row.envelopeStatus !== EDocusignStatus.completed
                              ) {
                                handleCheckStatus(row)
                              }
                            }}
                          >
                            {row?.envelopeId &&
                            row?.envelopeId !== '' &&
                            row.envelopeStatus !== EDocusignStatus.completed
                              ? 'Check'
                              : 'Empanel'}
                          </Link>
                        </Grid>
                      </Tooltip>
                    )}
                    {actions.includes(ACTIONS_TABLE.DOWNLOAD) && (
                      <Tooltip title='Download' arrow placement='left-start'>
                        <Grid item>
                          <Link
                            sx={{
                              display: 'inline-block',
                              fontWeight: '600',
                              fontSize: '14px',
                              color:
                                row?.envelopeId &&
                                row?.envelopeId !== '' &&
                                row.envelopeStatus === EDocusignStatus.completed
                                  ? '#004DAA'
                                  : theme.palette.mDarkGray?.main,
                              marginRight: '10px',
                              cursor:
                                row?.envelopeId &&
                                row?.envelopeId !== '' &&
                                row.envelopeStatus === EDocusignStatus.completed
                                  ? 'pointer'
                                  : 'default',
                            }}
                            onClick={() => {
                              if (
                                row?.envelopeId &&
                                row?.envelopeId !== '' &&
                                row.envelopeStatus === EDocusignStatus.completed
                              ) {
                                handleDownloadDocusign(row?.envelopeId)
                              }
                            }}
                          >
                            <PictureAsPdfIcon />
                          </Link>
                        </Grid>
                      </Tooltip>
                    )}
                  </Grid>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      )}
    </>
  )
}

export default TableContent
