import { IconButton, InputAdornment, SxProps, TextField, Theme } from '@mui/material'
import { Controller, Control } from 'react-hook-form'
import { useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

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
}

const PasswordInput = ({
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
}: Props) => {
  //Hide and show passowrd
  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }
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
              type={showPassword ? 'text' : 'password'}
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
                    <IconButton
                      onClick={toggleShowPassword}
                      sx={{
                        padding: 0,
                      }}
                    >
                      {showPassword ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                    </IconButton>
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

export default PasswordInput
