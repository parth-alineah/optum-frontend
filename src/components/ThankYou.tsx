import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { theme } from '@/context/ThemeProvider'

interface Props {}

const ThankYou = ({}: Props) => {
  return (
    <section>
      <div className='flex h-screen items-center justify-center'>
        <div>
          <div className='flex flex-col items-center space-y-2'>
            <div>
              <TaskAltIcon
                sx={{ height: '80px', width: '80px', color: theme.palette.mGreen.main }}
              />
            </div>
            <h1 className='text-4xl font-bold pt-4'>Thank You !</h1>
            <p className='font-normal'>
              Thank you for taking the time to fill out the form. Your input is greatly appreciated!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ThankYou
