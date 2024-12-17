import PendingVerificationList from './pendingVerification'
import VerificationList from './verified'
import { useEffect, useState } from 'react'
import { TableStates } from '@/types/common'
import { getCount } from '@/lib/empanelmentCountAndList'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'

type Props = {}

const LegalVerificationPage = (props: Props) => {
  //Modal Open and Close
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<TableStates>(undefined)
  // const [isView, setIsView] = useState<number>(1)
  // const [count, setCount] = useState(null)

  const { setLoading } = useLoading()
  const showToast = useToast()
  //Modal changes function
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setType(undefined)
  }

  // const getData = async () => {
  //   const response = await getCount(setLoading, showToast)
  //   if (response) {
  //     setCount(response?.data)
  //   } else {
  //     setCount(null)
  //   }
  // }

  // useEffect(() => {
  //   getData()
  // }, [])

  // const handleChange = (panel: number) => {
  //   setIsView(panel)
  // }

  return (
    <section>
      <div className='my-5'>
        <PendingVerificationList
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
          setType={setType}
          type={type}
          isDefault={true}
        />
      </div>
    </section>
  )
}

export default LegalVerificationPage
