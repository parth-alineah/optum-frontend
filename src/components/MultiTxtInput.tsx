import { Autocomplete, Chip, SxProps, TextField, Theme } from '@mui/material'
import React from 'react'
import { Control, Controller, UseFormSetValue } from 'react-hook-form'

type Props = {
  entries: string[]
  name: string
  control: Control<any> | undefined
  setValue: UseFormSetValue<any>
  placeholder: string
  label: string
  isInsideTag: boolean
  sxProps?: SxProps<Theme>
}

const MultiTxtInput = ({
  entries,
  name,
  control,
  setValue,
  placeholder,
  label,
  isInsideTag,
  sxProps,
}: Props) => {
  const insideSxProps = {
    '.MuiOutlinedInput-root': {
      py: 1,
    },
  }
  return (
    <div className='flex flex-col gap-3 w-full'>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            multiple={true}
            sx={isInsideTag ? { ...insideSxProps, ...sxProps } : { ...sxProps }}
            freeSolo={true}
            options={[]}
            value={value}
            isOptionEqualToValue={(option, value) => option === value}
            onChange={(event, newValue) => onChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                fullWidth
                placeholder={placeholder}
                label={label}
                InputLabelProps={{ shrink: true }}
                multiline={isInsideTag ? true : false}
                minRows={isInsideTag ? 2 : 0}
              />
            )}
            {...(!isInsideTag && { renderTags: () => null })}
            clearIcon={false}
          />
        )}
      />
      {!isInsideTag && (
        <div className='min-h-[140px] max-h-[200px] border-2 flex flex-wrap gap-2 overflow-y-scroll scrollBar border-gray-main rounded-lg mb-3 p-2'>
          {entries.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() =>
                setValue(
                  name,
                  entries.filter((t) => t !== tag),
                )
              }
              variant='outlined'
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiTxtInput
