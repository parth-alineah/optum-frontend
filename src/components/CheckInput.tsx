import {
  Checkbox,
  FormControlLabelProps,
  FormHelperText,
  FormLabel,
  SxProps,
  Theme,
} from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { COMMON_MESSAGE } from '@/utils/commonMessages'

type Props = {
  name: string
  control: Control<any> | undefined
  label: FormControlLabelProps['label']
  handleToggle?: (check: boolean) => void
  sxProps?: SxProps<Theme>
  isDisabled?: boolean
  handleOnChange?: any
  required?: any
  checked?: any
  isCross?: boolean
}

const CheckInput = ({
  control,
  name,
  label,
  handleToggle,
  sxProps,
  isDisabled,
  handleOnChange,
  required,
  checked,
  isCross,
}: Props) => {
  return (
    <div className='flex items-center'>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          return (
            <div>
              <Checkbox
                {...field}
                onChange={(e, checked) => {
                  field.onChange(e) // Update the form state
                  if (handleToggle) {
                    handleToggle(checked)
                  }
                  if (handleOnChange) {
                    handleOnChange(checked)
                  }
                }}
                checked={isCross ? checked : checked ? checked : field.value ?? false}
                sx={{
                  maxWidth: 'max-content',
                }}
                disabled={isDisabled ?? false}
              />
              <FormHelperText>{fieldState.invalid ?? fieldState.error?.message}</FormHelperText>
            </div>
          )
        }}
        rules={required ? { validate: (val) => val || COMMON_MESSAGE.Check } : {}}
      />
      <FormLabel
        sx={{
          ...(sxProps ? sxProps : {}),
          marginBottom: 0,
        }}
      >
        {label}
      </FormLabel>
    </div>
  )
}

export default CheckInput
