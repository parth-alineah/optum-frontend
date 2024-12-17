import { SxProps, TextField, Theme } from '@mui/material'
import { Controller, Control } from 'react-hook-form'
type Props = {
  placeholder: string
  name: string
  control: Control<any> | undefined
  handleChange: () => void
  validation: any
  isDisabled?: boolean
  sx?: SxProps<Theme>
  label: string
  handleBlue?: (e) => void
  handleOnChange?: (e) => void
}

const NumInput = ({
  placeholder,
  name,
  control,
  handleChange,
  validation,
  isDisabled,
  sx,
  label,
  handleBlue,
  handleOnChange,
}: Props) => {
  const inputStyleProps: SxProps<Theme> = { ...sx, width: '100%', marginTop: '5px' }
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { onChange, ...rest } = field
        return (
          <div className='flex flex-col items-start'>
            <label className='text-sm font-semibold'>{label}</label>
            <TextField
              {...rest}
              onChange={(e) => {
                onChange(e)
                handleChange()
                if (handleOnChange) {
                  handleOnChange(e)
                }
              }}
              onBlur={(e) => {
                if (handleBlue) {
                  handleBlue(e)
                }
              }}
              // label={label}
              InputLabelProps={{ shrink: true }}
              placeholder={placeholder}
              error={fieldState.invalid}
              // helperText={fieldState.error?.message || ''}
              disabled={isDisabled ?? false}
              sx={inputStyleProps}
              inputProps={{
                type: 'number',
              }}
            />
          </div>
        )
      }}
      rules={validation}
    />
  )
}

export default NumInput
