import { HandleControls } from '@/types/common'
import {
  Box,
  Grid,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { theme } from '@/context/ThemeProvider'
import { COMMON_MESSAGE } from '@/utils/commonMessages'
import { useToast } from '@/hooks/useToast'

type Props = {
  handleRowsPerPage: (pageLimit: number) => void
  numberOfPages: number
  handlePage: (newPage: number) => void
  from: number
  to: number
  total: number
  currentPage: number
  handleControls: HandleControls
  notFound: boolean
}

const TableFooterControls = ({
  handleRowsPerPage,
  numberOfPages,
  handlePage,
  from,
  to,
  total,
  handleControls,
  notFound,
}: Props) => {
  const showToast = useToast()

  //Select Page Function
  const handleChangePage = (event: any, newPage: number) => {
    handlePage(newPage)
  }

  //Changing Rows Per Page
  const [rowsPerPage, setRowsPerPage] = useState(handleControls.limitPerPage)
  const handleChangeRowsPerPage = (e: SelectChangeEvent<number>, child: ReactNode) => {
    setRowsPerPage(handleControls.limitPerPage)
    handleRowsPerPage(Number(e.target.value))
  }

  useEffect(() => {
    setRowsPerPage(handleControls.limitPerPage)
  }, [handleControls.limitPerPage])
  const { control, handleSubmit, formState } = useForm()

  //Form Submission
  const onSubmitHandle: SubmitHandler<any> = (data) => {
    if (Number(data.page) <= 0 || Number(data.page) > numberOfPages) {
      showToast('warning', COMMON_MESSAGE.PageInvalid)
    } else {
      handlePage(Number(data.page))
    }
  }
  return (
    <>
      {notFound && (
        <Typography
          sx={{
            textAlign: 'center',
            color: '#DB4437',
            fontWeight: '900',
            fontSize: '18px',
            margin: '20px 16px 20px 16px',
          }}
        >
          {COMMON_MESSAGE.NoRecordFound}
        </Typography>
      )}
      <Grid
        container
        display={'flex'}
        justifyContent={'end'}
        alignItems={'center'}
        sx={{
          paddingY: '5px',
          [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
          },
        }}
        gap={2}
      >
        <Grid item>
          <Box display={'flex'} justifyContent={'end'} alignItems={'center'} gap={2}>
            <Typography
              style={{
                fontSize: '14px',
                cursor: 'pointer',
                color: theme.palette.mDarkBlue?.main,
                fontWeight: '400',
                border: 0,
                backgroundColor: 'transparent',
              }}
            >
              Rows per page
            </Typography>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              sx={{
                height: '32px',
                width: '90px',
                fontWeight: '500',
              }}
              className='format-default-border'
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </Box>
        </Grid>
        <Grid item>
          <Typography
            sx={{ fontWeight: '400', fontSize: '14px', color: theme.palette.mDarkBlue?.main }}
          >
            {`${from === undefined ? 0 : from} - ${to === undefined ? 0 : to} of ${
              total === undefined ? 0 : total
            }`}
          </Typography>
        </Grid>
        <Grid item>
          <Pagination
            count={numberOfPages}
            onChange={handleChangePage}
            shape='rounded'
            variant='outlined'
            page={handleControls.currentPage}
            siblingCount={0}
          />
        </Grid>
        <Grid item>
          <Box
            display={'flex'}
            justifyContent={'end'}
            alignItems={'center'}
            gap={1}
            marginRight={2}
          >
            <form onSubmit={handleSubmit(onSubmitHandle)}>
              <Box display={'flex'} justifyItems={'center'} alignItems={'center'} gap={1}>
                <button
                  style={{
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: theme.palette.mDarkBlue?.main,
                    fontWeight: '400',
                    border: 0,
                    backgroundColor: 'transparent',
                  }}
                  type='submit'
                >
                  Go To Page
                </button>
                <Controller
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <TextField
                      id='outlined-basic'
                      variant='outlined'
                      sx={{
                        width: '50px',
                        fontWeight: '500',
                        borderRadius: '27px',
                      }}
                      inputProps={{
                        style: {
                          borderColor: theme.palette.mDarkBlue?.main,
                          fontSize: '14px',
                        },
                      }}
                      className='format-default-border'
                      onChange={onChange}
                      onBlur={onBlur}
                      inputRef={ref}
                      value={value}
                      type='number'
                    />
                  )}
                  name='page'
                  control={control}
                />
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default TableFooterControls
