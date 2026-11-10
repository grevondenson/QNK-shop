import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <header className='flex items-center py-3 px-[4%] justify-between border-b border-gray-200 bg-white shadow-sm'>
        <div className='flex items-center gap-3'>
            <img className='w-10 h-10 rounded-sm object-cover border border-amber-900/20' src={assets.logo} alt="QNK Noire Admin" />
            <div>
              <span className='font-serif block text-lg tracking-[0.08em] font-bold text-gray-800 leading-none'>QNK NOIRE</span>
              <span className='block text-[9px] tracking-[0.2em] text-[#8B6D53] font-semibold uppercase'>ADMIN PORTAL</span>
            </div>
        </div>
        <button 
          onClick={() => setToken('')} 
          className='bg-[#8B6D53] hover:bg-[#72573f] text-white px-5 py-2 sm:px-7 sm:py-2 rounded text-xs sm:text-sm font-medium tracking-wider transition-colors'
        >
          Logout
        </button>
    </header>
  )
}

export default Navbar
