import { DynamicTabs, TabItem } from '@/components/TabComponent'
import { Dispatch, SetStateAction, useState } from 'react'
import { TableStates } from '@/types/common'
import NewRequestList from './newRequest'
import OpenRequestList from './openRequest'
import CloseRequestList from './closeRequest'
import { Badge } from '@mui/material'
import { theme } from '@/context/ThemeProvider'
import { EUserRole } from '@/utils/constants'
import { useAuth } from '@/context/AuthContext'
import NetworkVerificationList from './networkRequest'

type Props = {
  trigger: boolean
  setTrigger: Dispatch<SetStateAction<boolean>>
}

const DashboardTablePage = ({ trigger, setTrigger }: Props) => {
  //Modal Open and Close
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<TableStates>(undefined)

  //Modal changes function
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setType(undefined)
  }
  const { user } = useAuth()
  const TabLabel = ({ label, count }: { label: any; count: any }) => {
    return (
      <div>
        {label}
        {/* <Badge
          badgeContent={count}
          className='pl-5'
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: theme.palette.mBlue?.main,
              color: theme.palette.mWhite?.main,
            },
          }}
        /> */}
      </div>
    )
  }

  const tabs: TabItem[] = [
    {
      label: <TabLabel label='New Request' count={3} />,
      id: '0',
      component: (
        <NewRequestList
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
          setType={setType}
          type={type}
          isDefault={true}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      ),
      role: [EUserRole.Operation, EUserRole.Network, EUserRole.Legal],
    },
    {
      label: <TabLabel label='Open Request' count={4} />,
      id: '1',
      component: (
        <OpenRequestList
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
          setType={setType}
          type={type}
          isDefault={true}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      ),
      role: [EUserRole.Operation, EUserRole.Network, EUserRole.Legal],
    },
    {
      label: <TabLabel label='Closed Request' count={3} />,
      id: '2',
      component: (
        <CloseRequestList
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
          setType={setType}
          type={type}
          isDefault={true}
        />
      ),
      role: [EUserRole.Operation, EUserRole.Network, EUserRole.Legal],
    },
    {
      label: <TabLabel label='Network Verification' count={3} />,
      id: '3',
      component: (
        <NetworkVerificationList
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
          setType={setType}
          type={type}
          isDefault={true}
        />
      ),
      role: [EUserRole.Network],
    },
  ]
  const filterTab = tabs?.filter((x) => x?.role?.includes(user?.role))
  return <DynamicTabs tabs={filterTab} />
}

export default DashboardTablePage
