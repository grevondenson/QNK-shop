import React, { useState } from 'react'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
    const [email, setEmail] = useState('')

    const onSubmitHandler = (event) => {
        event.preventDefault()
        if (email) {
            toast.success('Thank you for joining the QNK Noire Circle.')
            setEmail('')
        }
    }

  return (
    <div className='my-16 p-8 sm:p-12 text-center bg-sand/20 border border-stone/60 max-w-4xl mx-auto rounded-sm'>
      <span className='text-[10px] uppercase tracking-[0.24em] text-saddle font-semibold'>Exclusive Drops & Reservations</span>
      <h2 className='font-display text-2xl sm:text-3xl text-charcoal mt-1'>Join the QNK Noire Circle</h2>
      <p className='text-xs sm:text-sm text-charcoal/70 mt-3 max-w-lg mx-auto leading-relaxed'>
        Be the first to explore limited handbag collections, styling notes, and reserved pre-order drops.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-2/3 flex items-center gap-0 mx-auto mt-6 border border-stone/70 bg-white shadow-sm overflow-hidden'>
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full sm:flex-1 px-4 py-3.5 text-xs sm:text-sm text-charcoal outline-none bg-transparent placeholder:text-stone' 
          type="email" 
          placeholder='Enter your email address' 
          required
        />
        <button type='submit' className='bg-charcoal text-cream hover:bg-saddle text-xs tracking-widest uppercase px-6 sm:px-8 py-3.5 transition-colors font-medium'>
          JOIN
        </button>
      </form>
    </div>
  )
}

export default NewsletterBox
