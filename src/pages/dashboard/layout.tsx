import Header from '@/components/Header'
import { ContentBox } from '@/components/MuiStyledComponents'
import { theme } from '@/context/ThemeProvider'
import { Box, useMediaQuery } from '@mui/material'
import { useState } from 'react'

type Props = {
  children: any
}

const DashBoardLayout = ({ children }: Props) => {
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mWhite.main,
        overflowY: 'scroll',
        maxHeight: '100vh',
      }}
      className='hideScroll'
    >
      <Header open={open} setOpen={setOpen} />
      <ContentBox
        open={open}
        theme={theme}
        sx={{
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        <div className={`flex flex-col justify-between ${isMobile ? '' : 'pb-4'} flex-1`}>
          <div
            className={`overflow-x-hidden px-3 mt-16 ${isMobile ? 'pb-3 overflow-y-scroll' : ''}`}
          >
            {children}
          </div>
        </div>
      </ContentBox>
    </Box>
  )
}

export default DashBoardLayout
