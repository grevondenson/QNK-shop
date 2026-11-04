import React from 'react'
import { brand } from '../brand'


const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <div className='mb-5 leading-none text-charcoal'>
                <span className='font-display block text-3xl tracking-[0.12em]'>QNK</span>
                <span className='block text-[10px] tracking-[0.22em] text-saddle'>NOIRE BAGS</span>
            </div>
            <p className='w-full md:w-2/3 text-gray-600'>
            {brand.name} brings you thoughtfully selected bags and accessories for everyday expression. Discover effortless silhouettes, considered details, and pieces {brand.statement.toLowerCase()}.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li><a href='/'>Home</a></li>
                <li><a href='/about'>About us</a></li>
                <li>{brand.delivery}</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>{brand.phone}</li>
                <li>{brand.email}</li>
                <li className='pt-2 text-saddle'>{brand.reservation}</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>© 2026 {brand.name}. All rights reserved.</p>
        </div>

    </div>
  )
}

export default Footer
