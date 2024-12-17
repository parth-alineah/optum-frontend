import { theme } from '@/context/ThemeProvider'
import { useMediaQuery } from '@mui/material'

export const useDrawerWidth = (
  widthForLarge?: string,
  widthForMedium?: string,
  defaultWidth?: string,
) => {
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  let drawerWidth

  if (isLargeScreen) {
    drawerWidth = widthForLarge ? widthForLarge : '25%'
  } else if (isMediumScreen) {
    drawerWidth = widthForMedium ? widthForMedium : '40%'
  } else if (isSmallScreen) {
    drawerWidth = '100%'
  } else {
    drawerWidth = defaultWidth ? defaultWidth : '60%'
  }

  return drawerWidth
}
