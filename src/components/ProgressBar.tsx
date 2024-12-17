import React from 'react'

type props = {
  progress: number
}

const ProgressBar = ({ progress }: props) => {
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className='relative w-full h-1 bg-lightGray-main rounded-full'>
      <div
        className='absolute top-0 left-0 h-full bg-blue-main rounded-full transition-all duration-300'
        style={{ width: `${clampedProgress}%` }}
      />
      <div className='absolute bottom-1 flex w-full justify-between text-xs font-semibold '>
        <span className='relative'>0%</span>
        <span className='relative'>25%</span>
        <span className='relative'>50%</span>
        <span className='relative'>75%</span>
        <span className='relative'>100%</span>
      </div>
    </div>
  )
}

export default ProgressBar
