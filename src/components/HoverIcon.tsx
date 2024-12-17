import React from 'react'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

const IconWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '0.5rem',
  marginTop: '1.25rem',
  cursor: 'pointer',
  '&:hover svg': {
    color: 'blue',
  },
})

const HoverIcon = ({ title }) => {
  return (
    <Tooltip title={title} arrow>
      <IconWrapper>
        <VisibilityRoundedIcon />
      </IconWrapper>
    </Tooltip>
  )
}

export default HoverIcon
