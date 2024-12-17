// import { theme } from '../context/ThemeProvider'
import { LoadingState } from '../types/common'
import { Backdrop, Dialog } from '@mui/material'
import CustomDialog from './Dialog-custom'
import Spinner from './spinner'
type Props = {
  loading: LoadingState['loading']
}

const Loader = ({ loading }: Props) => {
  if (loading.isLoading) {
    if (!loading.isPage) {
      return (
        <Backdrop
          sx={{
            color: '#000000',
            zIndex: (theme) => theme.zIndex.drawer + 1999999999999,
          }}
          open={loading.isLoading}
        >
          <CustomDialog
            open={true}
            handleClose={() => {}}
            action={{ isAction: false, component: null }}
            maxWidth={'xs'}
            header={{ isHeader: false, component: null }}
          >
            <Spinner />
          </CustomDialog>
        </Backdrop>
      )
    } else {
      return (
        <Dialog
          open={loading.isLoading}
          fullScreen
          sx={{
            marginTop: 10,
          }}
          PaperProps={{
            elevation: 0,
          }}
          hideBackdrop
        >
          <section className='h-screen overflow-hidden '>
            <div className='flex flex-col items-center justify-center h-full w-full gap-btw-container'>
              <Spinner />
              <div className='flex flex-col sm:flex-row items-center gap-btw-container mt-5'>
                <img src={loading.pageProps?.image} alt='loading' width={300} height={300} />
                <div className='max-w-xs'>
                  <p className='max-sm:text-center text-2xl text-darkBlue-main'>
                    {loading.pageProps?.pageTxt}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Dialog>
      )
    }
  } else {
    return null
  }
}

export default Loader
