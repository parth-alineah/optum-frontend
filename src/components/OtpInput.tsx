import { useEffect } from 'react'
import { TextField } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { txtFieldValidation } from '../utils/form.validation'
type Props = {
  name: string[]
  control: Control<any> | undefined
}

const OtpInput = ({ name, control }: Props) => {
  const focusNextInput = (nextIndex: number) => {
    const nextInput = document.getElementById(name[nextIndex])
    if (nextInput) {
      nextInput.focus()
    }
  }
  const blurInput = (currentIndex: number) => {
    const currentInput = document.getElementById(name[currentIndex])
    if (currentInput) {
      currentInput.blur()
    }
  }
  useEffect(() => {
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>, currentIndex: number) => {
      const { value } = event.target
      if (value.length === 1 && currentIndex < name.length - 1) {
        focusNextInput(currentIndex + 1)
      }
      if (value.length === 0 && currentIndex > 0) {
        focusNextInput(currentIndex - 1)
      }
      if (value.length === 1 && currentIndex === name.length - 1) {
        blurInput(currentIndex)
      }
      if (value.length === 0 && currentIndex === 0) {
        blurInput(currentIndex)
      }
    }
    name.forEach((fieldName, index) => {
      const inputElement = document.getElementById(fieldName)
      if (inputElement) {
        inputElement.addEventListener('input', (e: any) => handleInput(e, index))
      }
    })
    return () => {
      name.forEach((fieldName) => {
        const inputElement = document.getElementById(fieldName)
        if (inputElement) {
          inputElement.removeEventListener('input', (e: any) => handleInput(e, 0))
        }
      })
    }
  }, [name])
  const defaultProps = {
    inputProps: { maxLength: 1 },
    sx: {
      '.MuiOutlinedInput-notchedOutline': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      '.MuiOutlinedInput-input': {
        textAlign: 'center',
      },
    },
  }
  return (
    <div className='mt-3'>
      <p className=' mb-1'>Enter the OTP here</p>
      <div className='flex max-w-[350px] gap-2'>
        <Controller
          name={name[0]}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <TextField
                {...field}
                id={name[0]}
                inputProps={{ maxLength: 1 }}
                sx={{
                  // '.MuiOutlinedInput-notchedOutline': {
                  //   borderTopRightRadius: 0,
                  //   borderBottomRightRadius: 0,
                  // },
                  '.MuiOutlinedInput-input': {
                    textAlign: 'center',
                  },
                }}
                error={fieldState.invalid}
              />
            )
          }}
          rules={{ ...txtFieldValidation(true, 'PositiveNumbers') }}
        />
        <Controller
          name={name[1]}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <TextField id={name[1]} {...field} {...defaultProps} error={fieldState.invalid} />
            )
          }}
          rules={{ ...txtFieldValidation(true, 'PositiveNumbers') }}
        />
        <Controller
          name={name[2]}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <TextField id={name[2]} {...defaultProps} {...field} error={fieldState.invalid} />
            )
          }}
          rules={{ ...txtFieldValidation(true, 'PositiveNumbers') }}
        />
        <Controller
          name={name[3]}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <TextField id={name[3]} {...defaultProps} {...field} error={fieldState.invalid} />
            )
          }}
          rules={{ ...txtFieldValidation(true, 'PositiveNumbers') }}
        />
        <Controller
          name={name[4]}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <TextField id={name[4]} {...defaultProps} {...field} error={fieldState.invalid} />
            )
          }}
          rules={{ ...txtFieldValidation(true, 'PositiveNumbers') }}
        />
        <Controller
          name={name[5]}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <TextField
                {...field}
                inputProps={{ maxLength: 1 }}
                id={name[5]}
                sx={{
                  // '.MuiOutlinedInput-notchedOutline': {
                  //   borderTopLeftRadius: 0,
                  //   borderBottomLeftRadius: 0,
                  // },
                  '.MuiOutlinedInput-input': {
                    textAlign: 'center',
                  },
                }}
                error={fieldState.invalid}
              />
            )
          }}
          rules={{ ...txtFieldValidation(true, 'PositiveNumbers') }}
        />
      </div>
    </div>
  )
}

export default OtpInput
