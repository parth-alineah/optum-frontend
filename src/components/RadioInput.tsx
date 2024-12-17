import { theme } from '@/context/ThemeProvider'
import { Radios } from '@/types/common'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

type Props = {
  name: string
  control: Control<any> | undefined
  radios: Radios[]
  label: string
}

const RadioInput = ({ name, control, radios, label }: Props) => {
  return (
    <FormControl>
      <FormLabel sx={{ color: theme.palette.mBlack?.main, fontWeight: 600, fontSize: '14px' }}>
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup aria-labelledby='demo-radio-buttons-group-label' {...field} row>
            {radios.map((x) => {
              return (
                <FormControlLabel
                  value={x.value}
                  control={<Radio />}
                  label={x.name}
                  key={x.value}
                />
              )
            })}
          </RadioGroup>
        )}
      />
    </FormControl>
  )
}

export default RadioInput
