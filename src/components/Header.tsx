import { Dispatch, SetStateAction, useState, useEffect, useReducer, useRef } from 'react'
import { CustomAppBar } from './MuiStyledComponents'
import { theme } from '@/context/ThemeProvider'
import {
  Button,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuItemProps,
  Popover,
  Theme,
  styled,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomDialog from './Dialog-custom'
import { useAuth } from '@/context/AuthContext'
import { AUTH_PATH, MAIN_PATH } from '@/paths/index'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CameraIcon from '@mui/icons-material/Camera'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuIcon from '@mui/icons-material/Menu'
import { EUserRole } from '@/utils/constants'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import LockIcon from '@mui/icons-material/Lock'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const ConfirmPopUp = ({
  setOpenPopUp,
  openPopUp,
}: {
  setOpenPopUp: Dispatch<SetStateAction<boolean>>
  openPopUp: boolean
}) => {
  const { clearStorage } = useAuth()
  const nav = useNavigate()
  const handleYes = () => {
    clearStorage()
    nav(`${MAIN_PATH.AUTH.split('/*')[0]}${AUTH_PATH.LOGIN}`)
  }
  return (
    <CustomDialog
      action={{ component: null, isAction: false }}
      handleClose={() => {
        setOpenPopUp(false)
      }}
      open={openPopUp}
      header={{
        component: (
          <DialogTitle
            sx={{
              padding: '16px 24px 14px 24px',
            }}
          >
            <div className='flex justify-end items-baseline -mt-2 -mr-4'>
              <button
                onClick={() => {
                  setOpenPopUp(false)
                }}
              >
                <SettingsIcon sx={{ fill: theme.palette.mDarkGray?.main }} />
              </button>
            </div>
          </DialogTitle>
        ),
        isHeader: true,
      }}
      maxWidth='xl'
      dialogStyleProps={{
        minWidth: 700,
      }}
      type={undefined}
    >
      <div className=' flex flex-col gap-4 items-center justify-center'>
        <p className='p-2 rounded-md  text-2xl font-bold'>Are you sure want to sign out ?</p>
        <div className='flex justify-between gap-3 px-5'>
          <Button color='mBlue' sx={{ minWidth: '150px' }} onClick={handleYes}>
            Confirm
          </Button>
          <Button
            color='mBlue'
            sx={{ minWidth: '150px' }}
            onClick={() => {
              setOpenPopUp(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomDialog>
  )
}

export const CustomMenuItem = styled(MenuItem)<MenuItemProps & { theme: Theme }>(({ theme }) => ({
  color: theme.palette.mDarkBlue?.main,
  marginRight: '10px',
  marginLeft: '10px',
  gap: '10px',
  fontSize: '20px',
  fontWeight: 'bold',
}))

const Header = ({ open, setOpen }: Props) => {
  const { pathname } = useLocation()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const nav = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openPopOver = Boolean(anchorEl)
  const id = openPopOver ? 'simple-popover' : undefined

  const { user, clearStorage } = useAuth()
  const roleWiseHeader = HeadingList?.filter((x) => x?.role?.includes(user?.role))
  return (
    <>
      <CustomAppBar
        open={open}
        theme={theme}
        sx={{
          '&.MuiPaper-root': {
            boxShadow: 'none',
            backgroundColor: theme.palette.mWhite.main,
          },
        }}
      >
        <div className='flex justify-between items-center px-4 text-white-main shadow-md'>
          <div
            className='ml-3 flex gap-10 items-center'
            role='button'
            onClick={() => {
              setOpen(!open)
            }}
          >
            <span
              className='text-lg text-black-main'
              role='button'
              onClick={() => {
                nav('/dashboard')
              }}
            >
              Provider Portal
            </span>
            <div className='flex gap-5'>
              {roleWiseHeader?.map((x) => {
                return (
                  <span
                    className={`text-sm font-medium hover:underline ${x?.path?.split('/')[1] === lastSegment ? 'underline' : ''} text-black-main `}
                    role='button'
                    onClick={() => {
                      nav(x?.path)
                    }}
                    key={Math.random()}
                  >
                    {x?.title}
                  </span>
                )
              })}
            </div>
          </div>
          <div className='min-h-14 flex items-center justify-end gap-3'>
            <div className='text-sm font-medium text-black-main'>
              {user?.role ? user?.role : ''}
            </div>
            <IconButton aria-describedby={id} onClick={handleClick}>
              <AccountCircleIcon sx={{ fontSize: 23, color: theme.palette.mBlack.main }} />
            </IconButton>
            <Popover
              id={id}
              open={openPopOver}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <List
                sx={{
                  width: '150px',
                  bgcolor: 'background.paper',
                  '&.MuiList-root': {
                    paddingTop: '0px',
                    paddingBottom: '0px',
                  },
                }}
                component='nav'
                aria-labelledby='nested-list-subheader'
              >
                <ListItemButton
                  onClick={() => {
                    clearStorage()
                  }}
                >
                  <ListItemText primary='Logout' />
                </ListItemButton>
              </List>
            </Popover>
          </div>
        </div>
      </CustomAppBar>
    </>
  )
}

export default Header

const MainHeading = () => {
  const [heading, setHeading] = useState<string | undefined>()

  const { pathname } = useLocation()
  useEffect(() => {
    const segments = pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    console.log(lastSegment)
    // const formattedSegment = lastSegment
    //   .split('-')
    //   .map((x) => {
    //     const u = x.charAt(0).toUpperCase()
    //     return u + x.slice(1)
    //   })
    //   .join(' ')
    const h = HeadingNames.find((x) => x.path === lastSegment)
    setHeading(h?.title ?? '')
  }, [pathname])

  return <h1 className='text-sm font-medium text-black-main'>{heading}</h1>
}

const HeadingNames = [
  {
    path: '',
    title: 'Dashboard',
  },
]

const HeadingList = [
  {
    path: '/search',
    title: 'Search',
    role: [EUserRole.Operation, EUserRole.Network, EUserRole.Legal],
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    role: [EUserRole.Operation, EUserRole.Network],
  },
  {
    path: '/manage',
    title: 'Manage',
    role: [EUserRole.Operation, EUserRole.Network],
  },
  // {
  //   path: '/network-verification',
  //   title: 'Network Verification',
  //   role: [EUserRole.Network],
  // },
  {
    path: '/legal-verification',
    title: 'Legal Verification',
    role: [EUserRole.Legal],
  },
]
