import { Button, InputAdornment, SxProps, TextField, Theme } from '@mui/material'
import { Controller, Control } from 'react-hook-form'
import { theme } from '@/context/ThemeProvider'

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
  isVerify?: boolean
}

const VerifyTextInput = ({
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
  isVerify,
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
              }}
              onClick={() => {
                if (handleClick) {
                  handleClick()
                }
              }}
              type={'text'}
              placeholder={placeholder}
              error={fieldState.invalid}
              // helperText={fieldState.error?.message || ''}
              disabled={isDisabled ?? false}
              sx={inputStyleProps}
              multiline={multiline ? true : false}
              minRows={multiline ?? 0}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: readonly ? readonly : false,
                endAdornment: (
                  <InputAdornment position='end'>
                    <Button
                      color={isVerify ? 'mGreen' : 'mBlue'}
                      sx={{
                        maxWidth: '70px',
                        minWidth: '70px',
                        maxHeight: '25px',
                        minHeight: '25px',
                        color: theme.palette.mWhite.main,
                      }}
                      type='submit'
                    >
                      {isVerify ? 'Verified' : 'Verify'}
                    </Button>
                  </InputAdornment>
                ),
              }}
              // label={label}
            />
          </div>
        )
      }}
      rules={validation}
    />
  )
}

export default VerifyTextInput
