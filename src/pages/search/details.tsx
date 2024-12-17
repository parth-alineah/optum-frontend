import { useLocation, useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import { searchProviderDetails } from '@/lib/providerSearch'
import { useEffect, useState } from 'react'
import GoogleMapComponent from '@/components/Map'
import { Button, Chip, Divider, Tooltip } from '@mui/material'
import { EUserRole, splitDescription } from '@/utils/constants'
import { theme } from '@/context/ThemeProvider'
import { useAuth } from '@/context/AuthContext'
import _ from 'lodash'

type Props = {}

const arr = [
  {
    test: 'CBC',
    rate: 500,
    Date: '14-08-2024',
  },
  {
    test: 'ECG',
    rate: 700,
    Date: '12-08-2024',
  },
  {
    test: 'TMT',
    rate: 400,
    Date: '14-08-2024',
  },
  {
    test: 'FB',
    rate: 500,
    Date: '14-08-2024',
  },
  {
    test: 'ECG',
    rate: 700,
    Date: '12-08-2024',
  },
  {
    test: 'TMT',
    rate: 400,
    Date: '14-08-2024',
  },
  {
    test: 'FB',
    rate: 500,
    Date: '14-08-2024',
  },
  {
    test: 'ECG',
    rate: 700,
    Date: '12-08-2024',
  },
  {
    test: 'TMT',
    rate: 400,
    Date: '14-08-2024',
  },
  {
    test: 'FB',
    rate: 500,
    Date: '14-08-2024',
  },
  {
    test: 'ECG',
    rate: 700,
    Date: '12-08-2024',
  },
  {
    test: 'TMT',
    rate: 400,
    Date: '14-08-2024',
  },
  {
    test: 'FB',
    rate: 500,
    Date: '14-08-2024',
  },
]

const SearchDetailsPage = (props: Props) => {
  const nav = useNavigate()
  const { setLoading } = useLoading()
  const { state } = useLocation()
  const showToast = useToast()
  // Record and Control States
  const [data, setData] = useState(null)

  const getData = async () => {
    const res = await searchProviderDetails(setLoading, showToast, state?._id)
    if (res?.success) {
      setData(res?.data)
    }
  }

  useEffect(() => {
    getData()
  }, [])
  const { user } = useAuth()
  const [testData, setTestData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    if (data?.tests?.length > 0) {
      const groupedByCategoryId = _.groupBy(data?.tests, 'categoryId')
      const result = _.mapValues(groupedByCategoryId, (items) => {
        return {
          category: items[0].category,
          items,
        }
      })
      setTestData([result])
      setSelectedCategory(Object.values([result][0])[0]?.category)
    }
  }, [data])

  return (
    <section
      style={{
        maxHeight: 'calc(100vh - 70px)',
        overflow: 'auto',
      }}
    >
      <div>
        <div className='flex items-center py-2 mt-3 w-full px-4 bg-white-main shadow rounded-md justify-between gap-5'>
          <div className='flex gap-10'>
            <span className='text-base font-semibold italic'>Provider Details</span>
          </div>
          <div className='text-center flex items-end justify-end'>
            <Button
              color='mBlue'
              sx={{
                minWidth: '100px',
                maxWidth: '100px',
                maxHeight: '35px',
                minHeight: '35px',
                color: theme.palette.mWhite.main,
              }}
              onClick={() => {
                window.history.go(-1)
              }}
            >
              Back
            </Button>
          </div>
        </div>

        <div className='my-5 grid grid-cols-2 gap-5'>
          <div className='flex flex-col'>
            <div className='bg-midBlue-main h-full w-full flex items-center justify-center'>
              <GoogleMapComponent
                locations={[{ lat: Number(data?.latitude), lng: Number(data?.longitude) }]}
              />
            </div>
          </div>
          <div className='flex flex-col gap-5'>
            <div className='shadow rounded-md'>
              <div className='flex bg-lightGray-main p-2 justify-between w-full'>
                <div className='font-bold'>Basic Details</div>
                <b className='text-orange-main'>{data?.isDelist ? 'Delist' : ''}</b>
              </div>
              <div className='p-2'>
                <p className='font-normal text-sm text-darkGray-main'>
                  Provider Name: <b>{data?.providerName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Provider Id: <b>123456</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Address:{' '}
                  <b>
                    {data?.addressLineOne}, {data?.addressLineTwo}, {data?.city}, {data?.state} -{' '}
                    {data?.pincode}
                  </b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  City: <b>{data?.city}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  State: <b>{data?.state}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Pincode: <b>{data?.pincode}</b>
                </p>
              </div>
            </div>
            <div className='shadow bg-lightGray-main font-bold rounded-md'>
              <div className='bg-lightGray-main p-2 font-bold'>Contact Details</div>
              <div className='p-2'>
                <p className='font-normal text-sm text-darkGray-main'>
                  Primary Contact Name: <b>{data?.primaryContactName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Primary Contact Email: <b>{data?.primaryContactEmail}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Secondary Contact Name: <b>{data?.secondaryContactName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Secondary Contact Email: <b>{data?.secondaryContactEmail}</b>
                </p>
              </div>
            </div>
          </div>
        </div>
        {user?.role === EUserRole.Network && (
          <div className='my-5 grid grid-cols-2 gap-5'>
            <div className='shadow rounded-md'>
              <div className='bg-lightGray-main p-2 font-bold'>Banking Information</div>
              <div className='p-2'>
                <p className='font-normal text-sm text-darkGray-main'>
                  Account Name: <b>{data?.bankAccName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Account Number: <b>{data?.bankAccNo}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Account Type: <b>{data?.bankAccType}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Bank Name: <b>{data?.bankName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  City: <b>{data?.bankBranchCity}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  IFSC: <b>{data?.bankAccIFSC}</b>
                </p>
              </div>
            </div>
            <div className='shadow rounded-md'>
              <div className='bg-lightGray-main p-2 font-bold'>Ownership</div>
              <div className='p-2'>
                <p className='font-normal text-sm text-darkGray-main'>
                  Owner: <b>{data?.ownershipName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Organization Type: <b>{data?.ownershipTypeName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  PAN No: <b>{data?.panNo}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  PAN Name: <b>{data?.panName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Aadhar No: <b>{data?.aadharNo}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Aadhar Name: <b>{data?.aadharName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Contact No : <b>{data?.ownerContactNo}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Authorized Signatory Name: <b>{data?.authorizedSignatoryName}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Authorized Signatory Designation: <b>{data?.authorizedSignatoryDesignation}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Authorized Signatory Email: <b>{data?.authorizedSignatoryEmail}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  Registered Office Address:{' '}
                  <b>
                    {data?.officeAddressLineOne}, {data?.officeAddressLineTwo}
                  </b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  City: <b>{data?.officeCity}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  PIN: <b>{data?.officePincode}</b>
                </p>
                <p className='font-normal text-sm text-darkGray-main'>
                  State: <b>{data?.officeState}</b>
                </p>
              </div>
            </div>
          </div>
        )}
        <div className='my-5 grid grid-cols-2 gap-5'>
          <div className='flex flex-col gap-5 '>
            <div className='shadow rounded-md max-h-[335px] min-h-[335px]'>
              <div className='bg-lightGray-main p-2 font-bold'>Available Tests</div>
              <div className='flex flex-wrap gap-2 mt-3 mb-3 px-3'>
                {testData?.length > 0 &&
                  Object.values(testData[0])?.map((x: any) => (
                    <div
                      key={x.category._id}
                      role='button'
                      onClick={() => setSelectedCategory(x.category)}
                      className={`border-[1px] rounded-md px-2 ${selectedCategory?._id === x.category._id ? 'bg-blue-main text-white-main' : ''}`}
                    >
                      {x.category.name}
                    </div>
                  ))}
              </div>
              <div
                className={
                  testData?.length > 0 ? `grid grid-cols-3 gap-3 px-3 overflow-y-scroll` : 'px-3'
                }
              >
                {testData?.length > 0 ? (
                  (
                    Object.values(testData[0])?.filter(
                      (x: any) => x?.category?._id === selectedCategory?._id,
                    )[0] as any
                  )?.items?.map((y: any) => (
                    <div
                      key={Math.random()}
                      className='rounded-md max-w-44 min-w-44 px-2 py-1 bg-lightGray-main'
                    >
                      <Tooltip title={y?.test?.name}>
                        <p className='text-sm font-bold'>
                          {y?.test?.name ? splitDescription(y?.test?.name, 20) : ''}
                        </p>
                      </Tooltip>
                      <p className='text-xs'>{y?.test?.code}</p>
                      <p className='text-xs'>{y?.test?.loincCode}</p>
                    </div>
                  ))
                ) : (
                  <div className='mb-3 justify-center flex w-full'>
                    There is not tests data available here!
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=' font-bold '>
            <div className='rounded-md shadow max-h-[335px] overflow-y-scroll scrollBar '>
              <div className='bg-lightGray-main p-2 font-bold'>Test Rates</div>
              <div className='px-2'>
                {arr?.length > 0 &&
                  arr?.map((x, i) => (
                    <>
                      <div className='flex items-center w-full py-2' key={Math.random()}>
                        <Tooltip title={x?.test} placement='left-start'>
                          <span className='w-[60%] font-normal'>
                            {x?.test ? splitDescription(x?.test, 20) : ''}
                          </span>
                        </Tooltip>
                        <span className='w-[20%] font-normal'>{x?.rate}</span>
                        <span className='w-[20%] font-normal'>{x?.Date}</span>
                      </div>
                      {data?.length !== i + 1 && <Divider />}
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-5 mb-5'>
          <div className='shadow rounded-md max-h-[150px] min-h-[150px]'>
            <div className='bg-lightGray-main p-2 font-bold'>Insurers</div>
            <div className='p-2 flex gap-2 items-center flex-wrap'>
              {' '}
              <span className='font-normal text-black-main'>Activated : </span>
              {data?.insurers?.map((x) => {
                if (x?.isActive) {
                  return <Chip label={x?.name} size='small' variant='outlined' />
                }
              })}
            </div>
            <div className='p-2 flex gap-2 items-center flex-wrap'>
              {' '}
              <span className='font-normal text-black-main'>Deactivated : </span>{' '}
              {data?.insurers?.map((x) => {
                if (!x?.isActive) {
                  return <Chip label={x?.name} size='small' variant='outlined' />
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchDetailsPage
