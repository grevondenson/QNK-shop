import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { brand } from '../brand'

const Footer = () => {
  return (
    <footer className='border-t border-stone/60 pt-16 pb-8 text-charcoal'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 text-sm'>

        {/* Brand identity */}
        <div className='md:col-span-2 space-y-4'>
            <div className='flex items-center gap-3'>
              <img 
                src={assets.logo} 
                alt={`${brand.name} logo`} 
                className='w-11 h-11 rounded-sm object-cover border border-sand/40 shadow-sm'
              />
              <div className='leading-tight'>
                <span className='font-display block text-2xl tracking-[0.08em] font-medium'>QNK</span>
                <span className='block text-[9px] tracking-[0.24em] text-saddle font-semibold'>NOIRE BAGS</span>
              </div>
            </div>

            <p className='text-xs sm:text-sm text-charcoal/75 max-w-md leading-relaxed'>
              {brand.name} brings you thoughtfully selected bags and accessories for everyday expression. 
              Discover effortless silhouettes, considered details, and pieces {brand.statement.toLowerCase()}.
            </p>

            <div className='pt-2 flex items-center gap-4 text-xs tracking-wider text-saddle font-medium'>
              <span>EFFORTLESSLY CHIC</span>
              <span>·</span>
              <span>BAGS & ACCESSORIES</span>
            </div>
        </div>

        {/* Quick Links */}
        <div>
            <p className='font-display text-sm font-semibold tracking-wider text-charcoal uppercase mb-4'>Explore</p>
            <ul className='space-y-2.5 text-xs text-charcoal/80'>
                <li><Link to='/' className='hover:text-saddle transition-colors'>Home</Link></li>
                <li><Link to='/collection' className='hover:text-saddle transition-colors'>Collections</Link></li>
                <li><Link to='/about' className='hover:text-saddle transition-colors'>About Our Brand</Link></li>
                <li><Link to='/contact' className='hover:text-saddle transition-colors'>Contact & Inquiries</Link></li>
            </ul>
        </div>

        {/* Contact & Policy */}
        <div>
            <p className='font-display text-sm font-semibold tracking-wider text-charcoal uppercase mb-4'>Store Concierge</p>
            <ul className='space-y-2.5 text-xs text-charcoal/80'>
                <li className='flex items-center gap-2'>
                  <span className='text-saddle font-medium'>Tel:</span> {brand.phone}
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-saddle font-medium'>Email:</span> {brand.email}
                </li>
                <li className='pt-1 text-olive font-medium'>
                  {brand.delivery}
                </li>
                <li className='pt-1 text-saddle font-semibold'>
                  {brand.reservation}
                </li>
            </ul>
        </div>

      </div>

      <div className='border-t border-stone/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-charcoal/60 gap-3'>
          <p>© 2026 {brand.name}. All rights reserved.</p>
          <p className='tracking-wider'>KENYA · ONLINE SHOP</p>
      </div>
    </footer>
  )
}

export default Footer
