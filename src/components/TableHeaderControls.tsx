import { Box, Button } from '@mui/material'
import { useRef } from 'react'
import { Search, SearchIconWrapper, StyledInputBase } from '@/components/MuiStyledComponents'
import { theme } from '@/context/ThemeProvider'
import { debounce } from 'lodash'
import { HEADER_BTN, HeaderBtnTypes } from '@/types/common'
import { useToast } from '@/hooks/useToast'
import SearchIcon from '@mui/icons-material/Search'

type Props = {
  heading?: string
  searchFnc: (srhTxt: string) => void
  clickFnc: () => void
  tabs?: { isTabs: boolean; tabComponent: any }
  btnTxtArray: HeaderBtnTypes
  selectedRows: any[]
  clickView: () => void
  permissionName?: string
}

const TableHeaderControls = ({
  heading,
  searchFnc,
  clickFnc,
  tabs,
  btnTxtArray,
  clickView,
  permissionName,
}: Props) => {
  const showToast = useToast()
  const searchRef = useRef<HTMLInputElement>()
  const delayedSearch = useRef(
    debounce((searchQuery) => {
      searchFnc(searchQuery as string)
    }, 500),
  ).current
  const handleChange = (e: any) => {
    const searchQuery = e.target.value
    delayedSearch(searchQuery)
  }
  const isCreate = btnTxtArray?.find((x) => x.btnType === HEADER_BTN.CREATE)
  const isView = btnTxtArray?.find((x) => x.btnType === HEADER_BTN.VIEW)

  // const [role, setRole] = useState(null)
  // const user = JSON.parse(localStorage.getItem('user'))

  // const getUserCreatePermissions = (permissions: Permissions) => {
  //   const modulePermissions = {}

  //   for (const [module, actions] of Object.entries(permissions)) {
  //     modulePermissions[module] = actions.create
  //   }

  //   return modulePermissions
  // }
  // useEffect(() => {
  //   if (!user.systemAdmin) {
  //     const p = JSON.parse(localStorage.getItem('permissions'))
  //     if (p) {
  //       const r = getUserCreatePermissions(p)
  //       if (r) {
  //         setRole(r)
  //       }
  //     }
  //   }
  // }, [])

  return (
    <>
      <Box
        sx={{
          paddingY: '5px',
          borderBottom: '1px solid',
          borderTop: tabs?.isTabs ? '1px solid' : '',
          borderColor: theme.palette.mDarkGray?.main,
          backgroundColor: theme.palette.mLightGray?.main,
          px: '16px',
          width: '100%',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
          },
        }}
        display={'flex'}
        alignItems={'center'}
        justifyContent={heading ? 'space-between' : 'end'}
      >
        {heading && <h1 className='text-lg font-black'>{heading}</h1>}

        <Box
          display={'flex'}
          alignItems={'center'}
          sx={{
            gap: '12px',
            [theme.breakpoints.down('md')]: {
              flexWrap: 'wrap',
            },
          }}
        >
          <Search>
            <SearchIconWrapper type='submit'>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search Here'
              inputRef={searchRef}
              onChange={handleChange}
            />
          </Search>
          {isCreate && (
            <Button
              color='mBlue'
              sx={{
                minWidth: 100,
                borderRadius: '8px',
                maxHeight: 35,
                color: theme.palette.mWhite?.main,
              }}
              // disableRipple={disableCreateBtn}
              onClick={() => {
                // if ((role && role[permissionName]) || user.systemAdmin) {
                clickFnc()
                // } else {
                //   showToast('info', `You don't have permission to add record`)
                // }
              }}
            >
              {isCreate.btnText ?? HEADER_BTN.CREATE}
            </Button>
          )}
          {isView && (
            <Button
              color='mBlue'
              sx={{
                minWidth: 120,
                borderRadius: '8px',
                maxHeight: 35,
                color: theme.palette.mWhite?.main,
              }}
              onClick={() => {
                clickView()
              }}
            >
              {isView.btnText ?? HEADER_BTN.VIEW}
            </Button>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          pl: '16px',
          pr: '16px',
          width: '100%',
        }}
      >
        {tabs?.isTabs && tabs.tabComponent}
      </Box>
    </>
  )
}

export default TableHeaderControls
