import { ToastOptions } from 'react-toastify'
import { SetStateAction, Dispatch } from 'react'
import { ALIGN_DIALOG } from '../utils/constants'
import { TableCellProps, Theme } from '@mui/material'

export type PaletteColor = {
  light?: string
  main: string
  dark?: string
  contrastText?: string
}
export type HeaderProps = {
  theme: Theme
  open: boolean
}

export type AuthState = {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
}
export type SideBarItemsType = {
  id: number
  listMembers: { id: number; iconName: string; txt: string }[]
  divideNotRequired?: boolean
}

export type AuthParams = {
  isAuth: boolean
  role: string
}

export type CacheType = {
  cacheData: Record<string, any>
  cacheExpDate: Record<string, string | undefined>
}

export type HeaderLinkType = {
  id: number
  name: string
  path: string
}

export type AlignDialogProp =
  | ALIGN_DIALOG.BOTTOM_LEFT
  | ALIGN_DIALOG.BOTTOM_RIGHT
  | ALIGN_DIALOG.TOP_LEFT
  | ALIGN_DIALOG.TOP_RIGHT

export type LoadingState = {
  loading: { isLoading: boolean; isPage: boolean; pageProps?: { image: any; pageTxt: string } }
  setLoading: Dispatch<
    SetStateAction<{
      isLoading: boolean
      isPage: boolean
      pageProps?: { image: any; pageTxt: string }
    }>
  >
}

export type SelectDDL = { label: string; _id: string }

export type GoToFields = {
  page: number
}

export type NotFoundContextType = string
export type NotFoundState = {
  notFound: NotFoundContextType[]
  setNotFound: Dispatch<SetStateAction<NotFoundContextType[]>>
}

export type SearchDDL = { label: string; _id: string | number }
export type SimpleDDL = {
  _id: number | string
  label: string
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ShowToastFunction = (type: ToastType, message: string, options?: ToastOptions) => void

export type Radios = { value: string | number; name: string }

export type HeadCell = {
  id: any
  label: string
  isSort: boolean
  isDate?: boolean
  isToolTip?: boolean
  align?: TableCellProps['align']
  type?:
    | 'image'
    | 'date'
    | 'linkTxt'
    | 'linkNumber'
    | 'checkBox'
    | 'InformedStatus'
    | 'Warranty'
    | 'checkBoxDate'
    | 'linkTxtView'
    | 'downloadLink'
    | 'Switch'
    | 'actions'
    | 'isFinal'
    | 'Order'
    | 'isError'
    | 'copy'
    | 'currentStatus'
    | 'dateTime'
    | 'navigate'
  lengthOfText?: number
  imageSrc?: string
  linkPath?: any
  secondLineLabel?: string
  etx?: string
  isDark?: boolean
  onView?: { isView: boolean; viewFnc: (item: any) => void }
  width?: number
  trueTxt?: string
  falseTxt?: string
  isCopy?: any
}

export const enum HEADER_BTN {
  CREATE = 'CREATE',
  VIEW = 'VIEW',
  DOWNLOAD = 'DOWNLOAD',
  GENERATE = 'GENERATE',
}

export type HeaderBtnTypes = Array<
  | { btnType: HEADER_BTN.CREATE; btnText?: string }
  | { btnType: HEADER_BTN.VIEW; btnText?: string }
  | { btnType: HEADER_BTN.DOWNLOAD; btnText?: string }
  | { btnType: HEADER_BTN.GENERATE; btnText?: string }
>

export type Controls = {
  currentPage: number
  pages: number
  total: number
  from: number
  to: number
  trashCount: number
}

export type HandleControls = {
  search: string
  currentPage: number
  limitPerPage: number
  sortParam: string
  sortOrder: number
  id?: string
  status?: string
}

export type Actions = Array<AllowedAction>

export type EnumValues<T extends Record<string, string | number>> = T[keyof T]

export const enum TABLE_STATES {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  VIEW = 'VIEW',
  SWITCH_CELL = 'SWITCH_CELL',
}

export const enum ACTIONS_TABLE {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  SWITCH = 'SWITCH',
  MAP = 'MAP',
  VIEW = 'VIEW',
  SIGN = 'SIGN',
  NAV = 'NAV',
  CHECK_STATUS = 'CHECK_STATUS',
  DOWNLOAD = 'DOWNLOAD',
}

export type TableStates = EnumValues<typeof TABLE_STATES> | undefined
export type AllowedAction = EnumValues<typeof ACTIONS_TABLE> | undefined
export type SearchBooleanDDL = { label: string | boolean; _id: string }

export const sortTableRowsByHeadCells = (tableRow: any[], headCell: HeadCell[]) => {
  const sortedTableRows: any = []
  headCell.map((cell) => {
    const matchingRow = tableRow.find((row) => row === cell.id)
    if (matchingRow) {
      sortedTableRows.push(cell)
    } else {
      sortedTableRows.push(cell)
    }
  })
  return sortedTableRows
}
