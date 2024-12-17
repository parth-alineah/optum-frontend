import { Fade, TableCell, Tooltip, Typography, Switch, Checkbox } from '@mui/material'
import { theme } from '../context/ThemeProvider'
import { useToast } from '@/hooks/useToast'
import { Dispatch } from 'react'
import { TableStates } from '@/types/common'
import { EFdStatus, EUserRole, splitDescription } from '@/utils/constants'
import { format, parseISO } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

type Props = {
  x: any
  i: number
  row: any
  handleChecked: (checked: boolean, row: any) => void
  handleView: (item: any) => void
  selectedRows: any[]
  controls: any
  rowIndex: number
  lastIndex: number
  onClickViewFnc: (item: any) => void
  handleSwitchCell: (item: any, switchState: boolean, controlName: string) => void
  setType: Dispatch<React.SetStateAction<TableStates>>
  viewNotRequired: boolean
}

const TableRowCell = ({
  x,
  i,
  row,
  handleChecked,
  handleView,
  selectedRows,
  rowIndex,
  controls,
  lastIndex,
  onClickViewFnc,
  handleSwitchCell,
  setType,
  viewNotRequired,
}: Props) => {
  const showToast = useToast()
  const nav = useNavigate()
  const { user } = useAuth()
  const rowProps = {
    paddingY: '5px',
    paddingX: '8px',
    minWidth: x.width ? x.width : 180,
    [theme.breakpoints.down('xl')]: {
      minWidth: x.width ? x.width : 180,
    },
  }
  const maxLengthCharacter = 15
  const handleViewFnc = (item) => {
    handleView(item)
  }
  const checked = () => {
    const exist = localStorage.getItem('testIds')
    const selected = JSON.parse(exist)
    return selected && selected.includes(row._id)
  }
  switch (x.type) {
    case 'Switch':
      return (
        <TableCell
          component='th'
          key={Math.random()}
          scope='row'
          padding='none'
          sx={{
            ...rowProps,
          }}
        >
          <Switch
            onChange={(e) => {
              handleSwitchCell(row, e.currentTarget.checked, x.id)
            }}
            checked={row[x.id]}
          />
        </TableCell>
      )
    case 'date':
      return (
        <TableCell
          component='th'
          key={Math.random()}
          scope='row'
          padding='none'
          sx={{
            ...rowProps,
          }}
        >
          <Typography
            sx={{
              display: 'inline-block',
              fontWeight: i === 0 || x.isDark ? '400' : '400',
              fontSize: '14px',
              color: 'black',
            }}
          >
            {row[x.id] ? format(parseISO(row[x.id]), 'dd MMM yyyy') : ''}
          </Typography>
        </TableCell>
      )
    case 'dateTime':
      return (
        <TableCell
          component='th'
          key={Math.random()}
          scope='row'
          padding='none'
          sx={{
            ...rowProps,
          }}
        >
          <Typography
            sx={{
              display: 'inline-block',
              fontWeight: i === 0 || x.isDark ? '400' : '400',
              fontSize: '14px',
              color: 'black',
            }}
          >
            {row[x.id] ? format(parseISO(row[x.id]), 'dd MMM yyyy hh:mm a') : ''}
          </Typography>
        </TableCell>
      )
    case 'currentStatus':
      return (
        <TableCell
          component='th'
          key={Math.random()}
          scope='row'
          padding='none'
          sx={{
            ...rowProps,
          }}
        >
          <Typography
            sx={{
              display: 'inline-block',
              fontWeight: i === 0 || x.isDark ? '400' : '400',
              fontSize: '14px',
              color: 'black',
            }}
          >
            {splitDescription(
              row[x.id] === EFdStatus.ForwardedToDC
                ? 'Forwarded To Provider'
                : row[x.id] === EFdStatus.Open
                  ? 'Open'
                  : row[x.id] === EFdStatus.Pending
                    ? 'Pending'
                    : row[x.id] === EFdStatus.Resolved
                      ? 'Resolved'
                      : row[x.id] === EFdStatus.Closed
                        ? 'Closed'
                        : row[x.id] === EFdStatus.DocumentSubmittedByDC
                          ? 'Document Submitted By Provider'
                          : row[x.id] === EFdStatus.ForwardedToLegalAfterQC1
                            ? 'Forwarded To Legal After QC1'
                            : row[x.id] === EFdStatus.DocumentVerifiedByLegal
                              ? 'Document Verified By Legal'
                              : row[x.id] === EFdStatus.IssueInDocumentNw
                                ? 'Issue In Document Nw'
                                : row[x.id] === EFdStatus.IssueInDocument
                                  ? 'Issue In Document'
                                  : row[x.id] === EFdStatus.EmpanelmentSuccessful
                                    ? 'Empanelment Successful'
                                    : row[x.id] === EFdStatus.ManualEmpanelmentStart
                                      ? 'Manual Empanelment Start'
                                      : row[x.id] === EFdStatus.ManualEmpanelmentSubmitted
                                        ? 'Manual Empanelment Submitted'
                                        : row[x.id] === EFdStatus.DocusignProcessStarted
                                          ? 'Docusign Process Started'
                                          : row[x.id] === EFdStatus.DocusignProcessCompleted
                                            ? 'Docusign Process Completed'
                                            : row[x.id] ===
                                                EFdStatus.IssueInDocumentByLegalForProvider
                                              ? 'Issue In Document By Legal For Provider'
                                              : row[x.id] === EFdStatus.DetailsUpdatedByTheDc
                                                ? 'Details Updated By The Provider'
                                                : '',
              30,
            )}
          </Typography>
        </TableCell>
      )
    case 'navigate':
      return (
        <TableCell
          component='th'
          key={Math.random()}
          scope='row'
          padding='none'
          sx={{
            ...rowProps,
          }}
        >
          <Typography
            sx={{
              display: 'inline-block',
              fontWeight: i === 0 || x.isDark ? '400' : '400',
              fontSize: '14px',
              color: user?.role === EUserRole.Network && theme.palette.mBlue?.main,
              textDecorationLine: user?.role === EUserRole.Network && 'underline',
            }}
            onClick={() => {
              if (user?.role === EUserRole.Network) {
                nav('/empanelment/perspective-from-open', {
                  state: row,
                })
              }
            }}
          >
            {row[x.id]}
          </Typography>
        </TableCell>
      )
    case 'checkBox':
      return (
        <TableCell
          component='th'
          key={Math.random()}
          scope='row'
          padding='none'
          sx={{
            ...rowProps,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            checked={checked()}
            onChange={(e, checked) => {
              handleChecked(checked, row)
            }}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 20,
              },
              padding: '2px',
            }}
          />
          <Typography
            sx={{
              display: 'inline-block',
              fontWeight: i === 0 || x.isDark ? '400' : '400',
              fontSize: '14px',
              color: 'black',
            }}
          >
            {row[x?.id] ? splitDescription(row[x?.id], maxLengthCharacter) : ''}
          </Typography>
        </TableCell>
      )
    default:
      if (typeof row[x.id] === 'string' && row[x.id].length >= maxLengthCharacter) {
        return (
          <Tooltip
            key={Math.random()}
            title={row[x.id]}
            arrow
            placement='bottom-start'
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 500 }}
          >
            <TableCell
              onClick={() => handleViewFnc(row)}
              component='th'
              key={Math.random()}
              scope='row'
              padding='none'
              sx={{
                ...rowProps,
                cursor: `${viewNotRequired ? 'default' : 'pointer'}`,
              }}
            >
              <Typography
                sx={{
                  display: 'inline-block',
                  fontWeight: i === 0 || x.isDark ? '400' : '400',
                  fontSize: '14px',
                  color: 'black',
                }}
              >
                {row[x?.id] ? splitDescription(row[x?.id], maxLengthCharacter) : ''}
              </Typography>
            </TableCell>
          </Tooltip>
        )
      } else {
        return (
          <TableCell
            onClick={() => handleViewFnc(row)}
            component='th'
            key={Math.random()}
            scope='row'
            padding='none'
            sx={{
              ...rowProps,
              cursor: `${viewNotRequired ? 'default' : 'pointer'}`,
            }}
          >
            <Typography
              sx={{
                display: 'inline-block',
                fontWeight: i === 0 || x.isDark ? '400' : '400',
                fontSize: '14px',
                color: 'black',
              }}
            >
              {row[x?.id] ?? ''}
            </Typography>
          </TableCell>
        )
      }
  }
}

export default TableRowCell
