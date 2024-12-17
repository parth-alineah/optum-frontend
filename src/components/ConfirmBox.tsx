import { Button, DialogTitle } from '@mui/material'
import CustomDialog from './Dialog-custom'
import { theme } from '@/context/ThemeProvider'

type Props = {
  setOpenPopUp: React.Dispatch<React.SetStateAction<boolean>>
  openPopUp: boolean
  handleYes: any
  content?: any
  final?: boolean
}

const ConfirmPopUp = ({ setOpenPopUp, openPopUp, handleYes, content, final }: Props) => {
  return (
    <CustomDialog
      action={{ component: null, isAction: false }}
      handleClose={() => {
        setOpenPopUp(false)
      }}
      open={openPopUp}
      header={{
        component: (
          <DialogTitle
            sx={{
              padding: '16px 24px 14px 24px',
            }}
          >
            <div className='flex justify-end items-baseline -mt-2 -mr-4'>
              <button
                onClick={() => {
                  setOpenPopUp(false)
                }}
              >
                {/* <SettingsIcon sx={{ fill: theme.palette.mDarkGray?.main }} /> */}
              </button>
            </div>
          </DialogTitle>
        ),
        isHeader: true,
      }}
      maxWidth='xl'
      dialogStyleProps={{
        minWidth: 450,
      }}
      type={undefined}
    >
      <div className='flex flex-col gap-4 items-center justify-center'>
        <p className='p-2 rounded-md text-lg font-normal'>
          {content ? content : 'Are you sure you want to perform this action?'}
        </p>
        <div className='flex justify-between gap-3 px-5'>
          <Button
            color='mWhite'
            sx={{
              minWidth: '120px',
              maxWidth: '120px',
            }}
            onClick={() => {
              setOpenPopUp(false)
            }}
          >
            {final ? ' No' : 'Cancel'}
          </Button>
          <Button
            color='mBlue'
            sx={{
              minWidth: '120px',
              maxWidth: '120px',
              color: theme.palette.mWhite.main,
            }}
            onClick={handleYes}
          >
            {final ? 'Yes' : 'Confirm'}
          </Button>
        </div>
      </div>
    </CustomDialog>
  )
}

export default ConfirmPopUp
