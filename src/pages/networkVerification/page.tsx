import PendingVerificationList from './pendingVerification'
import VerificationList from './verified'
import { useEffect, useState } from 'react'
import { TableStates } from '@/types/common'
import { getCount } from '@/lib/empanelmentCountAndList'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import ReturnByLegalList from './returnByLegal'

type Props = {}

const NetworkVerificationPage = (props: Props) => {
  //Modal Open and Close
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<TableStates>(undefined)
  const [isView, setIsView] = useState<number>(1)
  const [count, setCount] = useState(null)

  const { setLoading } = useLoading()
  const showToast = useToast()
  //Modal changes function
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setType(undefined)
  }

  const getData = async () => {
    const response = await getCount(setLoading, showToast)
    if (response) {
      setCount(response?.data)
    } else {
      setCount(null)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleChange = (panel: number) => {
    setIsView(panel)
  }

  return (
    <section>
      {/* <div className='my-5'>
        <span className='text-lg font-black'>Legal Team DC Verification</span>
      </div> */}
      <div className='flex justify-center gap-10 mb-5 mt-10'>
        <div
          className={`flex flex-col items-center ${isView === 1 ? 'bg-blue-main text-white-main' : ''} justify-center  rounded-md w-40 h-24 shadow`}
          role='button'
          onClick={() => {
            handleChange(1)
          }}
        >
          <span className='text-base font-normal text-center'>Pending For Verification</span>
          <span>{count?.pending ?? 0}</span>
        </div>
        <div
          className={`flex flex-col items-center ${isView === 2 ? 'bg-blue-main text-white-main' : ''} justify-center rounded-md w-40 h-24 shadow`}
          role='button'
          onClick={() => {
            handleChange(2)
          }}
        >
          <span className='text-base font-normal text-center'>Verified</span>
          <span>{count?.verified ?? 0}</span>
        </div>
        <div
          className={`flex flex-col items-center ${isView === 3 ? 'bg-blue-main text-white-main' : ''} justify-center rounded-md w-40 h-24 shadow`}
          role='button'
          onClick={() => {
            handleChange(3)
          }}
        >
          <span className='text-base font-normal text-center'>Return By Legal</span>
          <span>{count?.returnedByLegal ?? 0}</span>
        </div>
        {/* <div
          className={`flex flex-col items-center ${isView === 3 ? 'bg-blue-main text-white-main' : ''} justify-center rounded-md w-40 h-24 shadow`}
          role='button'
          onClick={() => {
            handleChange(3)
          }}
        >
          <span className='text-base font-normal text-center'>Partial Verified</span>
          <span>{count?.partialVerified ?? 0}</span>
        </div> */}
      </div>
      <div>
        {isView === 1 && (
          <PendingVerificationList
            handleClose={handleClose}
            handleOpen={handleOpen}
            open={open}
            setType={setType}
            type={type}
            isDefault={true}
          />
        )}
        {isView === 2 && (
          <VerificationList
            handleClose={handleClose}
            handleOpen={handleOpen}
            open={open}
            setType={setType}
            type={type}
            isDefault={true}
          />
        )}
        {isView === 3 && (
          <ReturnByLegalList
            handleClose={handleClose}
            handleOpen={handleOpen}
            open={open}
            setType={setType}
            type={type}
            isDefault={true}
          />
        )}
      </div>
    </section>
  )
}

export default NetworkVerificationPage
