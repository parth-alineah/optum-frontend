import { ReactNode } from 'react'
import { DialogContent, DialogProps, Dialog, Fade, SxProps, Theme } from '@mui/material'
import { ALIGN_DIALOG } from '../utils/constants'
import { AlignDialogProp } from '../types/common'
import { theme } from '../context/ThemeProvider'
interface Props {
  open: boolean
  handleClose: () => void
  align?: AlignDialogProp
  isFullScreen?: boolean
  maxWidth: DialogProps['maxWidth']
  disableClickAway?: boolean
  children: ReactNode
  header: { isHeader: boolean; component: ReactNode }
  action: { isAction: boolean; component: ReactNode }
  sxProps?: SxProps<Theme>
  dialogStyleProps?: SxProps<Theme>
  type?: any
}

const CustomDialog = ({
  open,
  handleClose,
  align,
  isFullScreen,
  maxWidth,
  disableClickAway,
  children,
  header,
  action,
  sxProps,
  dialogStyleProps,
  type,
}: Props) => {
  //Dialog Allignment
  const otherProps = { m: '1rem 0.5rem ' }
  const alignFnc = (alignType: string | undefined, fScreen: boolean | undefined) => {
    if (fScreen) {
      return { PaperProps: { sx: {} } }
    } else {
      switch (alignType) {
        //Add the alignment accordingly
        case ALIGN_DIALOG.TOP_LEFT:
          return {
            PaperProps: {
              sx: { position: 'fixed', top: 10, left: 10, ...otherProps },
            },
          }
          break
        case ALIGN_DIALOG.TOP_RIGHT:
          return {
            PaperProps: {
              sx: { position: 'fixed', top: 10, right: 10, m: '5rem 2rem 0.5rem 0.5rem' },
            },
          }
          break
        case ALIGN_DIALOG.BOTTOM_LEFT:
          return { PaperProps: { sx: { position: 'fixed', bottom: 10, left: 10, ...otherProps } } }
          break
        case ALIGN_DIALOG.BOTTOM_RIGHT:
          return { PaperProps: { sx: { position: 'fixed', bottom: 10, right: 10, ...otherProps } } }
          break
        default:
          return { PaperProps: { sx: {} } }
          break
      }
    }
  }
  const dialogProps: DialogProps | any = {
    ...alignFnc(align, isFullScreen),
    open: open,
    onClose: () => {
      if (!disableClickAway) {
        handleClose()
      }
    },
    // scroll: 'paper',
    maxWidth: maxWidth,
    fullScreen: isFullScreen,
  }
  return (
    // <Fade in={!open}>
    <Dialog
      {...dialogProps}
      sx={{
        '.MuiPaper-root ': {
          borderRadius: '7px',
          // minHeight:
          //   type === TABLE_STATES.ADD || type === TABLE_STATES.EDIT || type === TABLE_STATES.VIEW
          //     ? `calc(50vh + 30vh)`
          //     : '',
          // minWidth:
          //   type === TABLE_STATES.ADD || type === TABLE_STATES.EDIT || type === TABLE_STATES.VIEW
          //     ? `calc(50vw + 15vw)`
          //     : '',
          background: theme.palette.mWhite?.main,
          display: 'flex',
          flexDirection: 'column',
        },
        ...sxProps,
      }}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    >
      {header.isHeader && header.component}
      <DialogContent
        sx={{
          ...dialogStyleProps,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
        className='scrollBarContent'
      >
        {children}
      </DialogContent>

      {action.isAction && action.component}
    </Dialog>
    // </Fade>
  )
}

export default CustomDialog
