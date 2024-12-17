import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { theme } from '@/context/ThemeProvider'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export type TabItem = {
  label: React.ReactNode
  id: string
  component: React.ReactNode
  role?: string[]
}

type TabPanelProps = {
  children?: React.ReactNode
  index: number
  value: number
}

type DynamicTabsProps = {
  tabs: TabItem[]
}

export const DynamicTabs = ({ tabs }: DynamicTabsProps) => {
  const location = useLocation()
  const history = useNavigate()
  const [queryParams] = useSearchParams()
  const searchParams = new URLSearchParams(location.search)
  const initialTabIndex = parseInt(searchParams.get('tab') || '0', 10)

  const [value, setValue] = useState(initialTabIndex)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    const newSearchParams = new URLSearchParams(location.search)
    newSearchParams.set('tab', String(newValue))
    history(`?${newSearchParams.toString()}`)
  }

  useEffect(() => {
    if (queryParams) {
      setValue(initialTabIndex)
    }
  }, [initialTabIndex, queryParams])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ marginBottom: '10px' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='Dynamic Tabs'
          sx={{
            '.MuiTab-root': {
              textTransform: 'capitalize',
              color: theme.palette?.mBlack.main,
              '&.Mui-selected': {
                color: theme.palette.mBlue?.main,
              },
            },
            '.MuiTabs-indicator': {
              backgroundColor: theme.palette.mBlue?.main,
            },
            '.MuiTabs-flexContainer': {
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
          variant='scrollable'
          scrollButtons={true}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab.component}
        </CustomTabPanel>
      ))}
    </Box>
  )
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`dynamic-tabpanel-${index}`}
      aria-labelledby={`dynamic-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `dynamic-tab-${index}`,
    'aria-controls': `dynamic-tabpanel-${index}`,
  }
}
