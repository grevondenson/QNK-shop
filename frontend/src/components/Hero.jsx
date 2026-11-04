import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <section className='flex flex-col overflow-hidden border border-stone bg-sand/30 sm:flex-row'>
      {/* Hero Left Side */}
      <div className='flex w-full items-center justify-center px-8 py-16 sm:w-1/2 sm:py-0 lg:px-16'>
            <div className='text-charcoal'>
                <div className='flex items-center gap-2'>
                    <p className='h-[2px] w-8 bg-saddle md:w-11'></p>
                    <p className='text-sm font-medium tracking-[0.2em] md:text-base'>QNK NOIRE BAGS</p>
                </div>
                <h1 className='prata-regular py-3 text-4xl leading-tight sm:text-5xl'>Effortlessly<br />Chic</h1>
                <p className='mb-7 max-w-xs text-sm leading-6 text-charcoal/75'>Curated bags and accessories for your everyday statement.</p>
                <div className='flex items-center gap-2'>
                    <p className='text-sm font-semibold tracking-[0.16em]'>SHOP THE COLLECTION</p>
                    <p className='h-[1px] w-8 bg-saddle md:w-11'></p>
                </div>
            </div>
      </div>
      {/* Hero Right Side */}
      <img className='h-72 w-full object-cover object-center sm:h-auto sm:w-1/2' src={assets.hero_img} alt="QNK Noire Bags featured collection" />
    </section>
  )
}

export default Hero
