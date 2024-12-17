import { Autocomplete, TextField, MenuItem, Tooltip, SxProps, Theme } from '@mui/material'
import { acDefaultValue } from '../utils/form.validation'
import {
  Control,
  Controller,
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form'
import { splitDescription } from '../utils/constants'
import { SearchDDL } from '../types/common'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import { useEffect } from 'react'
import { theme } from '@/context/ThemeProvider'

type Props = {
  options: SearchDDL[]
  name: string
  control: Control<any> | undefined
  label: string
  setValue: UseFormSetValue<any>
  setError: UseFormSetError<any>
  clearErrors: UseFormClearErrors<any>
  validation: any
  notRequired?: boolean
  tooltip?: { isTooltip: boolean; length: number }
  sx?: SxProps<Theme>
  handleChange?: () => void
  selectDefault?: boolean
  handleOnChange?: any
  isDisable?: boolean
}

export const listBoxPropsDropdown = () => {
  return {
    sx: {
      maxHeight: 300,
      overflow: 'auto',
      '&& .Mui-selected': {
        backgroundColor: '#095aac !important',
        fontWeight: '500 !important',
        color: theme.palette?.mWhite?.main,
      },
    },
    className: 'scrollBarNone',
  }
}

const ListItemDropdown = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: any,
  _id: string,
  isSplitTrue: boolean,
  length: number,
) => {
  if (option.label.length < 13 || !isSplitTrue || isSplitTrue === undefined) {
    return (
      <MenuItem
        {...props}
        key={option._id}
        sx={{
          color: 'black',
          fontWeight: option._id === _id ? '500' : '300',
          backgroundColor: 'white',
        }}
        selected={option._id === _id}
      >
        {option.label}
      </MenuItem>
    )
  } else {
    return (
      <Tooltip title={option.label} placement='right-end' arrow key={option._id}>
        <MenuItem
          {...props}
          key={option._id}
          sx={{
            color: 'black',
            fontWeight: '300',
            backgroundColor: 'white',
          }}
          selected={option._id === _id}
        >
          {splitDescription(option.label, length)}
        </MenuItem>
      </Tooltip>
    )
  }
}
const SelectInput = ({
  name,
  control,
  notRequired,
  validation,
  setValue,
  setError,
  clearErrors,
  label,
  tooltip,
  options,
  handleChange,
  sx,
  selectDefault,
  handleOnChange,
  isDisable,
}: Props) => {
  const inputStyleProps: SxProps<Theme> = { ...sx, width: '100%' }

  useEffect(() => {
    if (selectDefault && options && options.length > 0) {
      setValue(name, options[0])
    }
  }, [selectDefault, options])

  return (
    <Controller
      name={name}
      control={control}
      rules={validation}
      render={({ fieldState, field }) => (
        <Autocomplete
          sx={inputStyleProps}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          options={options}
          disableClearable
          onChange={(e, val) => {
            if (val !== null) {
              if (!notRequired) {
                setValue(name, val)
                if (handleChange) {
                  handleChange()
                }
                if (handleOnChange) {
                  handleOnChange(val)
                }
                if (val._id === acDefaultValue._id) {
                  setError(name, { type: 'validate', message: `Select ${label}` })
                } else {
                  clearErrors(name)
                }
              } else {
                if (handleChange) {
                  handleChange()
                }
                setValue(name, val)
              }
            }
          }}
          value={field.value || null}
          renderInput={(params) => {
            return (
              <div className='flex flex-col items-start'>
                <label className='text-sm font-semibold'>{label}</label>
                <TextField
                  {...params}
                  error={fieldState.invalid}
                  placeholder={`Select ${label}`}
                  // helperText={fieldState.error ? fieldState.error.message : ''}
                  // label={label}
                  InputLabelProps={{ shrink: true }}
                  sx={{ marginTop: '5px' }}
                />
              </div>
            )
          }}
          ListboxProps={listBoxPropsDropdown()}
          renderOption={(props, option) =>
            ListItemDropdown(
              props,
              option,
              field.value?._id,
              tooltip ? tooltip.isTooltip : false,
              tooltip ? tooltip.length : 13,
            )
          }
          popupIcon={<ArrowCircleDownIcon sx={{ width: 20, height: 20 }} />}
          disabled={isDisable ? true : false}
        />
      )}
    />
  )
}

export default SelectInput
