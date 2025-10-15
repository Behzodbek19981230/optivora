'use client'

// MUI Imports
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

const DialogCloseButton = styled(Button)<ButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  position: 'absolute',
  color: theme.palette.text.disabled,
  boxShadow: (theme as any).customShadows?.xs || theme.shadows[1],
  transform: 'translate(9px, -10px)',
  borderRadius: (theme as any).shape?.customBorderRadius?.sm || theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter
  }),
  width: 30,
  height: 30,
  minWidth: 0,
  padding: 0,
  '&:hover, &:active': {
    transform: 'translate(7px, -5px) !important',
    boxShadow: (theme as any).customShadows?.sm || theme.shadows[3],
    backgroundColor: theme.palette.background.paper
  },
  '& i, & svg': {
    fontSize: '1.25rem'
  }
}))

export default DialogCloseButton
