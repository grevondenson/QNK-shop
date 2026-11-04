import React from 'react'

const Title = ({text1,text2}) => {
  return (
    <div className='mb-3 inline-flex items-center gap-2'>
      <p className='text-sm tracking-[0.16em] text-charcoal/60'>{text1} <span className='font-medium text-charcoal'>{text2}</span></p>
      <p className='h-[1px] w-8 bg-saddle sm:w-12 sm:h-[2px]'></p>
    </div>
  )
}

export default Title
