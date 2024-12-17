import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Controller } from 'react-hook-form'
import { useState } from 'react'
import { theme } from '../context/ThemeProvider'
import { SxProps, Theme } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers'

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
  onlyHour?: boolean
  onlyMinute?: boolean
}

const TimeInput = ({
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
  onlyHour,
  onlyMinute,
}: Props) => {
  const inputStyleProps: SxProps<Theme> = { ...sx, width: '100%' }
  const [OpenTimer, setOpenTimer] = useState(false)
  const pickerProps = {
    minDate,
  }
  const onKeyDown = (e: any) => {
    e.preventDefault()
    setOpenTimer(true)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={{ clearButtonLabel: 'Clear' }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState }) => (
          <div className='flex flex-col items-start'>
            <label className='text-sm font-semibold'>{label}</label>
            <TimePicker
              open={OpenTimer}
              onClose={() => setOpenTimer(false)}
              onChange={(e, val) => {
                onChange(e)
                handleChange()
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
              value={value}
              reduceAnimations
              slotProps={{
                textField: {
                  error: fieldState.invalid,
                  helperText: fieldState.error?.message ?? '',
                  InputLabelProps: { shrink: true },
                  onKeyDown: onKeyDown,
                  onClick: () => setOpenTimer(!OpenTimer),
                  placeholder: `Select ${label}`,
                  disabled: isDisabled ?? false,
                  sx: inputStyleProps,
                  // label: label,
                },
                actionBar: {
                  // actions: ['clear'],
                  sx: {
                    '& .MuiButtonBase-root': {
                      color: 'white !important',
                      minWidth: 100,
                      maxWidth: 100,
                      maxHeight: 20,
                      background: theme.palette.mPink?.main,
                      ':hover': {
                        background: theme.palette.mPink?.main,
                      },
                    },
                  },
                },
                popper: {
                  sx: {
                    '& .MuiButtonBase-root.Mui-selected': {
                      color: 'white !important',
                      backgroundColor: 'rgba(226, 0, 116, 1) !important',
                    },
                  },
                },
              }}
              // views={(onlyHour && ['hours', 'minutes']) || (onlyMinute && ['minutes'])}
              // format={(onlyHour && 'hh:mm') || (onlyMinute && 'mm')}
              views={(onlyHour && ['hours', 'minutes']) || (onlyMinute && ['minutes'])}
              format={(onlyHour && 'HH:mm') || (onlyMinute && 'mm')}
              ampm={!onlyHour}
            // slots={{ openPickerIcon: () => <SvgIcon iconName='calender' /> }}
            />
          </div>
        )}
        rules={validation}
      />
    </LocalizationProvider>
  )
}

export default TimeInput
