import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useSearchParams } from 'react-router-dom'
import { theme } from '@/context/ThemeProvider'

type TabItem = {
  label: string
  content: React.ReactNode
}

type Props = {
  tabs: TabItem[]
}

const TabComponent = ({ tabs }: Props) => {
  //for tabs
  const [value, setValue] = React.useState(0)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('tab')) {
      setValue(Number(searchParams.get('tab')))
    }
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <>
      <Box
        sx={{
          justifyContent: 'center',
          flexGrow: 0,
          display: 'grid',
          bgcolor: 'mWhite',
          marginBottom: '10px',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons
          allowScrollButtonsMobile
          aria-label='scrollable force tabs example'
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              sx={{
                color: theme.palette.mBlack?.main,
                '&.Mui-selected': {
                  color: theme.palette.mBlue?.main,
                },
                textTransform: 'none',
              }}
            />
          ))}
        </Tabs>
      </Box>
      <div>{tabs[value].content}</div>
    </>
  )
}

export default TabComponent
