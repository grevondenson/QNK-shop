import React from 'react'
import { assets } from '../assets/assets'
import { brand } from '../brand'

const OurPolicy = () => {
  return (
    <section className='border-y border-stone/50 py-16 my-16 bg-sand/15'>
      <div className='max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center'>
        
        <div className='flex flex-col items-center p-5 rounded-sm bg-cream/70 border border-stone/40'>
          <div className='w-12 h-12 rounded-full bg-sand/40 flex items-center justify-center mb-4 text-saddle'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' />
            </svg>
          </div>
          <h3 className='font-display text-base font-semibold text-charcoal mb-1'>Countrywide Delivery</h3>
          <p className='text-xs text-charcoal/70 leading-relaxed'>
            Careful dispatch across Kenya. Transport fees are calculated transparently at checkout.
          </p>
        </div>

        <div className='flex flex-col items-center p-5 rounded-sm bg-cream/70 border border-stone/40'>
          <div className='w-12 h-12 rounded-full bg-sand/40 flex items-center justify-center mb-4 text-saddle'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h3 className='font-display text-base font-semibold text-charcoal mb-1'>20% Reservation</h3>
          <p className='text-xs text-charcoal/70 leading-relaxed'>
            Lock your favourite bag with a 20% down payment deposit. Settle the balance upon delivery.
          </p>
        </div>

        <div className='flex flex-col items-center p-5 rounded-sm bg-cream/70 border border-stone/40'>
          <div className='w-12 h-12 rounded-full bg-sand/40 flex items-center justify-center mb-4 text-saddle'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
            </svg>
          </div>
          <h3 className='font-display text-base font-semibold text-charcoal mb-1'>Effortlessly Chic</h3>
          <p className='text-xs text-charcoal/70 leading-relaxed'>
            Tactile vegan leather, pebble finishes, and timeless silhouettes chosen to be as unique as you are.
          </p>
        </div>

        <div className='flex flex-col items-center p-5 rounded-sm bg-cream/70 border border-stone/40'>
          <div className='w-12 h-12 rounded-full bg-sand/40 flex items-center justify-center mb-4 text-saddle'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
            </svg>
          </div>
          <h3 className='font-display text-base font-semibold text-charcoal mb-1'>Personal Support</h3>
          <p className='text-xs text-charcoal/70 leading-relaxed'>
            Reach our shop concierge directly at <span className='font-medium text-charcoal'>{brand.phone}</span>.
          </p>
        </div>

      </div>
    </section>
  )
}

export default OurPolicy
