import { styled } from '@mui/material/styles'
import {
  Box,
  IconButton,
  InputBase,
  Select,
  SelectProps,
  TableSortLabel,
  TextField,
  TextFieldProps,
  Theme,
} from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer'
import { HeaderProps } from '@/types/common'
import { drawerWidth } from '@/utils/constants'

export const MobileSelect = styled(Select)<SelectProps>(({}) => ({
  '.MuiSvgIcon-root': {
    visibility: 'hidden',
  },
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  paddingRight: 0,
}))

export const CustomAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<MuiAppBarProps & { theme: Theme; open: boolean }>(({ theme, open }: HeaderProps) => ({
  // backgroundColor: theme.palette.mWhite.main,
  maxWidth: '100%',
  marginLeft: '64px',
  // width: `calc(100% - ${64}px)`,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: 700,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: 700,
    }),
  }),
}))

export const CustomSideBar = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<MuiDrawerProps & { open: boolean; theme: Theme }>(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'fixed',
    overflowX: 'hidden',
    overflowY: 'scroll',
    whiteSpace: 'nowrap',
    backgroundColor: theme.palette.mWhite?.main,
    '::-webkit-scrollbar': {
      display: 'none',
    },
    border: 0,
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: 700,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: 700,
      }),
      width: '64px',
    }),
  },
}))

export const ContentBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<MuiAppBarProps & { open: boolean }>(({ theme, open }: HeaderProps) => ({
  // top: '75px',
  // bottom: '75px',
  // paddingLeft: '10px',
  // paddingRight: '10px',
  width: `100%`,
  // height: '670px',
  // maxWidth: `calc(100% - ${85}px)`,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: 700,
  }),
  ...(open && {
    marginRight: 0,
    // marginLeft: drawerWidth + 10,
    // width: `calc(100% - ${drawerWidth + 20}px )`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: 700,
    }),
    backgroundColor: theme.palette.mWhite?.main,
  }),
}))

export const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  '.MuiTableSortLabel-icon': {
    display: 'none',
  },
}))

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border: '1px solid',
  borderColor: theme.palette.mGray?.main,
  borderRadius: '8px',
  backgroundColor: 'white',
  marginLeft: 0,
  width: '100%',
}))

export const SearchIconWrapper = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  pointerEvents: 'all',
}))

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    // height: '36px',
    [theme.breakpoints.up('sm')]: {
      width: '400px',
    },
  },
}))

export const TextFieldCustom = styled(TextField)<TextFieldProps & { theme: Theme }>(
  ({ theme }) => ({
    '& .MuiInputBase-root.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black',
    },
    '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black',
    },
    '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mDarkBlue?.main,
    },
    '& .MuiFormLabel-root.MuiInputLabel-root:hover': {
      color: 'black',
    },
    '& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused': {
      color: 'black',
      fontWeight: 'bold',
    },
    '& .MuiFormLabel-root.MuiInputLabel-root.Mui-error': {
      color: theme.palette.mDarkBlue?.main,
      fontWeight: 'bold',
    },
    '& .MuiFormHelperText-root.Mui-error': {
      color: theme.palette.mDarkBlue?.main,
      fontWeight: 600,
    },
  }),
)
