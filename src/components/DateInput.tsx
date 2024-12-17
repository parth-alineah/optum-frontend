import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller } from 'react-hook-form'
import { enGB } from 'date-fns/locale'
import { useState } from 'react'
import { theme } from '../context/ThemeProvider'
import { SxProps, Theme } from '@mui/material'

type Props = {
  name: string
  control: any
  label: string
  setError: any
  clearErrors: any
  validation: any
  minDate?: Date | null
  handleChange: () => void
  isDisabled?: boolean
  sx?: SxProps<Theme>
  showClearButton?: boolean
}

export const DateInput = ({
  name,
  control,
  label,
  setError,
  clearErrors,
  validation,
  minDate,
  handleChange,
  isDisabled,
  sx,
  showClearButton = true,
}: Props) => {
  const inputStyleProps: SxProps<Theme> = { ...sx, width: '100%', marginTop: '5px' }
  const [openCalendar, setOpenCalendar] = useState(false)
  const pickerProps = {
    minDate,
  }
  const onKeyDown = (e: any) => {
    e.preventDefault()
    setOpenCalendar(true)
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      localeText={{ clearButtonLabel: 'Clear' }}
      adapterLocale={enGB}
    >
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <div className='flex flex-col items-start'>
              <label className='text-sm font-semibold'>{label}</label>
              <DatePicker
                open={openCalendar}
                onClose={() => setOpenCalendar(false)}
                onChange={(e, val) => {
                  onChange(e)
                  handleChange()
                  // setOpenCalendar(false)
                  if (val === undefined) {
                    setError(name, {
                      type: 'validate',
                      message: `Select ${label}`,
                    })
                  } else {
                    clearErrors(name)
                  }
                }}
                {...pickerProps}
                value={value ? new Date(value) : ''}
                minDate={minDate}
                reduceAnimations
                slotProps={{
                  textField: {
                    error: fieldState.invalid,
                    // helperText: fieldState.error?.message ?? '',
                    InputLabelProps: { shrink: true },
                    onKeyDown: onKeyDown,
                    onClick: () => setOpenCalendar(!openCalendar),
                    placeholder: `Select ${label}`,
                    disabled: isDisabled ?? false,
                    sx: inputStyleProps,
                    // label: label,
                  },
                  actionBar: {
                    actions: showClearButton ? ['clear', 'accept'] : ['accept'],
                    sx: {
                      '& .MuiButtonBase-root': {
                        color: 'white !important',
                        background: theme.palette.mBlue?.main,
                        minWidth: '70px',
                        maxWidth: '70px',
                        minHeight: '30px',
                        maxHeight: '30px',
                        ':hover': {
                          background: theme.palette.mBlue?.main,
                        },
                      },
                    },
                  },
                  popper: {
                    sx: {
                      '& .MuiButtonBase-root.Mui-selected': {
                        color: 'white !important',
                        backgroundColor: theme.palette.mBlue?.main,
                      },
                    },
                  },
                }}
                disabled={isDisabled ?? false}
                // slots={{ openPickerIcon: () => <SvgIcon iconName='calender' /> }}
              />
            </div>
          </>
        )}
        rules={validation}
      />
    </LocalizationProvider>
  )
}
