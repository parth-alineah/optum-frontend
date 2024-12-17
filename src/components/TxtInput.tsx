import { SxProps, TextField, Theme, TextareaAutosize } from '@mui/material'
import { Controller, Control } from 'react-hook-form'
type Props = {
  placeholder: string
  name: string
  control: Control<any> | undefined
  handleChange: () => void
  validation: any
  isDisabled?: boolean
  sx?: SxProps<Theme>
  multiline?: number
  label?: string
  handleClick?: () => void
  readonly?: boolean
  handleBlue?: (e) => void
  handleOnChange?: (e) => void
}

const TxtInput = ({
  placeholder,
  name,
  control,
  handleChange,
  validation,
  isDisabled,
  sx,
  multiline,
  label,
  handleClick,
  readonly,
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
              onClick={() => {
                if (handleClick) {
                  handleClick()
                }
              }}
              placeholder={placeholder}
              error={fieldState.invalid}
              // helperText={fieldState.error?.message || ''}
              disabled={isDisabled ?? false}
              sx={inputStyleProps}
              multiline={multiline ? true : false}
              minRows={multiline ?? 0}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: readonly ? readonly : false }}
              // label={label}
            />
          </div>
        )
      }}
      rules={validation}
    />
  )
}

export default TxtInput
