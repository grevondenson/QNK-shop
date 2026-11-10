import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { brand } from '../brand'

const Hero = () => {
  return (
    <section className='flex flex-col overflow-hidden border border-stone/70 bg-gradient-to-br from-sand/25 via-cream to-sand/40 sm:flex-row rounded-sm my-4 shadow-sm'>
      {/* Hero Left Side */}
      <div className='flex w-full items-center justify-center px-8 py-14 sm:w-1/2 sm:py-20 lg:px-16'>
            <div className='text-charcoal max-w-md'>
                <div className='flex items-center gap-2.5 mb-3'>
                    <span className='h-[1.5px] w-9 bg-saddle'></span>
                    <span className='text-xs sm:text-sm font-medium tracking-[0.24em] text-saddle uppercase'>{brand.shortName} BAGS</span>
                </div>
                
                <h1 className='font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-charcoal tracking-tight'>
                  Effortlessly<br />
                  <span className='italic font-normal text-saddle'>Chic</span>
                </h1>
                
                <p className='mt-4 mb-2 text-xs uppercase tracking-[0.2em] text-olive font-semibold'>
                  {brand.statement}
                </p>
                
                <p className='mb-8 text-sm leading-relaxed text-charcoal/80'>
                  Curated handbags, totes, and accessories designed for considered everyday style. Reserve your piece with a 20% deposit.
                </p>
                
                <div className='flex items-center gap-4'>
                    <Link 
                      to='/collection' 
                      className='inline-flex items-center gap-3 bg-charcoal text-cream hover:bg-saddle px-7 py-3.5 text-xs tracking-[0.2em] font-medium transition-all duration-300 shadow-sm'
                    >
                      <span>EXPLORE COLLECTION</span>
                      <span className='text-base leading-none'>→</span>
                    </Link>
                </div>
            </div>
      </div>

      {/* Hero Right Side */}
      <div className='relative w-full sm:w-1/2 overflow-hidden bg-sand/30 flex items-center justify-center'>
        <img 
          className='h-72 w-full object-cover object-center sm:h-[480px] lg:h-[540px] transition-transform duration-700 hover:scale-105' 
          src={assets.hero_img} 
          alt="QNK Noire Bags curated collection" 
        />
        <div className='absolute bottom-4 right-4 bg-cream/90 backdrop-blur-sm border border-stone/60 px-4 py-2 text-[11px] tracking-widest text-charcoal uppercase'>
          Kenya · Countrywide Delivery
        </div>
      </div>
    </section>
  )
}

export default Hero
