import { theme } from '@/context/ThemeProvider'
import { Box, Button, Chip, DialogTitle, Divider, IconButton } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import TxtInput from '@/components/TxtInput'
import { txtFieldValidation } from '@/utils/form.validation'
import { searchProvider } from '@/lib/providerSearch'
import { useNotFound } from '@/context/NotFound'
import { limitOfPage, TABLES } from '@/utils/constants'
import { useEffect, useState } from 'react'
import CustomDialog from '@/components/Dialog-custom'
import Table from '@/components/Table'
import { Controls, HandleControls, HeadCell, SearchDDL } from '@/types/common'
import { dropdownCategory, getLabTests } from '@/lib/dropdown'

type Props = {}

const SearchPage = (props: Props) => {
  const nav = useNavigate()
  const { setLoading } = useLoading()
  const showToast = useToast()
  const { setNotFound, notFound } = useNotFound()

  //default controls
  const defaultControls = {
    search: '',
    currentPage: 1,
    limitPerPage: limitOfPage,
    sortParam: 'createdAt',
    sortOrder: -1,
  }

  // Record and Control States
  const [data, setData] = useState<any[]>([])
  const [entity, setEntity] = useState<any | undefined>()
  const [controls, setControls] = useState<any>({})
  const [handleControls, setHandleControls] = useState<any>(defaultControls)
  const [openPopUp, setOpenPopUp] = useState(false)

  const { control, handleSubmit, clearErrors, setError, setValue } = useForm({
    defaultValues: {
      search: '',
    },
  })

  const getModifiedData = () => {
    setData([])
    setHandleControls(defaultControls)
  }

  const onSubmitHandle: SubmitHandler<any> = async (data) => {
    getModifiedData()
    const response = await searchProvider(setLoading, showToast, setNotFound, notFound, {
      ...handleControls,
      search: data?.search,
      testIds: localStorage.getItem('testIds') ? JSON.parse(localStorage.getItem('testIds')) : [],
    })
    if (response) {
      const { records, ...rest } = response
      if (records?.length === 0) {
        setNotFound([TABLES.PROVIDER_SEARCH])
      } else {
        setNotFound([])
        setData(records)
        setControls(rest)
      }
    } else {
      setData([])
    }
  }

  const handleSeeMore = (x: any) => {
    nav('details', {
      state: x,
    })
  }

  // Record and Control States
  const [categoryData, setCategoryData] = useState<SearchDDL[]>([])
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [labTestData, setLabTestData] = useState<any[]>([])
  const [controlsFilter, setControlsFilter] = useState({})
  const [handleControlsFilter, setHandleControlsFilter] = useState<HandleControls>(defaultControls)

  const getCategoryData = async () => {
    const res = await dropdownCategory(setLoading, showToast, true)
    if (res) {
      setCategoryData(res)
      getLabTestData(res[0]?._id)
      setSelectedCategory(res[0])
    }
  }

  useEffect(() => {
    getCategoryData()
  }, [])

  const getLabTestData = async (categoryId: string) => {
    const response = await getLabTests(setLoading, showToast, setNotFound, notFound, {
      ...handleControlsFilter,
      categoryId,
    })
    if (response) {
      const { records, ...rest } = response
      if (records.length === 0) {
        setNotFound([TABLES.CLOSE_REQUEST])
      } else {
        setNotFound([])
        setLabTestData(records)
        setControlsFilter(rest)
      }
    } else {
      setLabTestData([])
    }
  }

  const getModifiedDataFilter = () => {
    setLabTestData([])
    setHandleControlsFilter(defaultControls)
  }

  useEffect(() => {
    getModifiedDataFilter()
  }, [])

  useEffect(() => {
    getLabTestData(selectedCategory?._id)
  }, [handleControlsFilter])

  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Test Name',
      isSort: false,
      type: 'checkBox',
    },
    {
      id: 'code',
      label: 'Code',
      isSort: false,
    },
    {
      id: 'loincCode',
      label: 'LOINC Code',
      isSort: false,
    },
  ]

  return (
    <section>
      <div className='my-5'>
        <form
          onSubmit={handleSubmit(onSubmitHandle)}
          className='flex justify-center items-center gap-5 pt-3'
        >
          <div className='flex items-end justify-center gap-5'>
            <div className='flex flex-row gap-3'>
              <div className='flex flex-col gap-3'>
                <TxtInput
                  control={control}
                  name='search'
                  handleChange={() => {}}
                  placeholder='Search By Name, PIN & City'
                  sx={{ minWidth: 300 }}
                  label='Search'
                  validation={txtFieldValidation(
                    JSON.parse(localStorage.getItem('testIds'))?.length > 0 ? false : true,
                  )}
                />
                <div className='text-center flex items-center'>
                  <Button
                    color='mWhite'
                    sx={{
                      minWidth: '150px',
                      maxWidth: '150px',
                      maxHeight: '35px',
                      minHeight: '35px',
                      color: theme.palette.mBlack.main,
                    }}
                    onClick={() => {
                      setOpenPopUp(true)
                    }}
                  >
                    Filter by Test
                  </Button>
                </div>
              </div>
              <div className='text-center flex flex-col mt-6'>
                <Button
                  color='mBlue'
                  sx={{
                    minWidth: '100%',
                    maxHeight: '35px',
                    minHeight: '35px',
                    color: theme.palette.mWhite.main,
                  }}
                  type='submit'
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className='grid grid-cols-3 gap-5 w-full mt-3'>
        {data?.length > 0 &&
          data?.map((x) => (
            <div className='bg-white-main shadow rounded-md min-h-20 z-10 mb-5'>
              <div className='flex justify-between items-center px-3 py-2 bg-lightGray-main'>
                <div className='flex flex-col'>
                  <div className='font-medium text-lg'>{x?.providerName}</div>
                  <span className='text-xs font-normal'>{x?.telephone}</span>
                </div>
                <span className='text-orange-main'>{x?.isDelist ? 'Delist' : ''}</span>
              </div>
              <Divider sx={{ borderWidth: '1px' }} />
              <div className='p-3'>
                <div className='line-clamp-1'>
                  {' '}
                  <span className='font-normal text-black-main'>Address : </span>
                  {x?.addressLineOne}, {x?.city}, {x?.state} - {x?.pincode}
                </div>
                <div className='line-clamp-1'>
                  {' '}
                  <span className='font-normal text-black-main'>Zone : </span>
                  {x?.zone}
                </div>
                {/* <div className='mt-2 flex gap-2 items-center'>
                  {' '}
                  <span className='font-normal text-black-main'>Activated : </span>
                  {x?.activated?.map((x) => {
                    return <Chip label={x} size='small' variant='outlined' />
                  })}
                </div>
                <div className='mt-2 mb-1 flex gap-2 items-center'>
                  {' '}
                  <span className='font-normal text-black-main'>Deactivated : </span>{' '}
                  {x?.deActivated?.map((x) => {
                    return <Chip label={x} size='small' variant='outlined' />
                  })}
                </div> */}
              </div>
              <Divider sx={{ borderWidth: '1px' }} />
              <div className='p-3 flex gap-5 items-center w-full justify-center'>
                <Button
                  color='mBlue'
                  sx={{
                    minWidth: '80px',
                    maxWidth: '80px',
                    maxHeight: '35px',
                    minHeight: '35px',
                    color: theme.palette.mWhite.main,
                  }}
                  onClick={() => {
                    handleSeeMore(x)
                  }}
                >
                  More
                </Button>
              </div>
            </div>
          ))}

        {data?.length > 0 && data?.length < controls?.total && (
          <div className='flex w-full justify-center items-center'>
            <span role='button' onClick={handleSeeMore}>
              See More...
            </span>
          </div>
        )}
      </div>
      {data?.length === 0 && (
        <div className='flex items-center justify-center my-10'>There is nothing to show here.</div>
      )}
      <CustomDialog
        action={{ component: null, isAction: false }}
        handleClose={() => {
          setOpenPopUp(false)
        }}
        open={openPopUp}
        header={{
          component: <></>,
          isHeader: true,
        }}
        maxWidth='xl'
        dialogStyleProps={{
          minWidth: 800,
          maxWidth: 800,
          minHeight: 500,
          maxHeight: 500,
        }}
        type={undefined}
      >
        <div className='flex flex-col gap-4 items-center justify-center'>
          <div className='flex flex-wrap gap-2 mt-1 mb-3'>
            {categoryData?.map((x) => (
              <div
                role='button'
                onClick={() => {
                  getLabTestData(x?._id as string)
                  setSelectedCategory(x)
                  setHandleControls(defaultControls)
                }}
                className={`border-[1px] rounded-md px-2 ${selectedCategory?._id === x?._id ? 'bg-blue-main text-white-main' : ''} `}
              >
                {x?.label}
              </div>
            ))}
          </div>
          <Table
            handleOpen={() => {}}
            setType={undefined}
            setEntity={setEntity}
            rows={labTestData}
            headCells={headCells}
            controls={controlsFilter as Controls}
            handleControls={handleControlsFilter}
            setHandleControls={setHandleControlsFilter}
            actions={[]}
            tableHeading={{
              tableId: TABLES.CLOSE_REQUEST,
              tableName: selectedCategory?.label,
            }}
            notFound={notFound.includes(TABLES.CLOSE_REQUEST)}
            btnTxtArray={[]}
            viewNotRequired={true}
            isTableWithOutAction={true}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
          />
          <div className='flex justify-between gap-3 px-5'>
            <Button
              color='mWhite'
              sx={{
                minWidth: '120px',
                maxWidth: '120px',
              }}
              onClick={() => {
                setOpenPopUp(false)
              }}
            >
              Cancel
            </Button>
            <Button
              color='mBlue'
              sx={{
                minWidth: '120px',
                maxWidth: '120px',
                color: theme.palette.mWhite.main,
              }}
              onClick={() => {
                setOpenPopUp(false)
              }}
            >
              Done
            </Button>
            <Button
              color='mBlue'
              sx={{
                minWidth: '120px',
                maxWidth: '120px',
                color: theme.palette.mWhite.main,
              }}
              onClick={() => {
                localStorage.removeItem('testIds')
                setOpenPopUp(false)
                setSelectedRows([])
              }}
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </CustomDialog>
    </section>
  )
}

export default SearchPage
