import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { brand } from '../brand'

const Navbar = () => {

    const [visible, setVisible] = useState(false);

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

  return (
    <header className='sticky top-0 z-40 bg-cream/95 backdrop-blur-sm'>
    <div className='flex items-center justify-between border-b border-stone/60 py-4 font-medium'>
      
      <Link to='/' className='flex items-center gap-3 text-charcoal group' aria-label={`${brand.name} home`}>
        <img 
          src={assets.logo} 
          alt={`${brand.name} logo`} 
          className='w-10 h-10 sm:w-11 sm:h-11 rounded-sm object-cover border border-sand/40 shadow-sm transition-transform duration-300 group-hover:scale-105' 
        />
        <div className='leading-tight'>
          <span className='font-display block text-xl sm:text-2xl tracking-[0.1em] font-medium'>QNK</span>
          <span className='block text-[8px] sm:text-[9px] tracking-[0.24em] text-saddle font-semibold'>NOIRE BAGS</span>
        </div>
      </Link>

      <ul className='hidden sm:flex gap-7 text-xs tracking-[0.15em] text-charcoal/80 font-medium'>
        
        <NavLink to='/' className='flex flex-col items-center gap-1 hover:text-saddle transition-colors'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-saddle hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1 hover:text-saddle transition-colors'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-saddle hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1 hover:text-saddle transition-colors'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-saddle hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1 hover:text-saddle transition-colors'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-saddle hidden' />
        </NavLink>

      </ul>

      <div className='flex items-center gap-6'>
            <button 
              onClick={() => { setShowSearch(true); navigate('/collection') }} 
              className='p-1 hover:opacity-75 transition-opacity' 
              aria-label='Search bags'
            >
              <img src={assets.search_icon} className='w-5 cursor-pointer' alt='Search' />
            </button>
            
            <div className='group relative'>
                <button 
                  onClick={() => token ? null : navigate('/login')} 
                  className='p-1 hover:opacity-75 transition-opacity' 
                  aria-label='Account'
                >
                  <img className='w-5 cursor-pointer' src={assets.profile_icon} alt='Account' />
                </button>
                {/* Dropdown Menu */}
                {token && 
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                    <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-white text-charcoal border border-stone/50 shadow-md rounded text-sm'>
                        <p className='cursor-pointer hover:text-saddle font-medium'>My Profile</p>
                        <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-saddle'>My Orders</p>
                        <p onClick={logout} className='cursor-pointer hover:text-saddle border-t border-stone/40 pt-1'>Logout</p>
                    </div>
                </div>}
            </div> 

            <Link to='/cart' className='relative p-1 hover:opacity-75 transition-opacity' aria-label='Shopping cart'>
                <img src={assets.cart_icon} className='w-5 min-w-5' alt='Cart' />
                <p className='absolute right-[-4px] bottom-[-4px] w-4 text-center leading-4 bg-saddle text-white aspect-square rounded-full text-[9px] font-medium'>{getCartCount()}</p>
            </Link> 

            <button onClick={() => setVisible(true)} className='p-1 sm:hidden' aria-label='Open menu'>
              <img src={assets.menu_icon} className='w-5 cursor-pointer' alt='Menu' /> 
            </button>
      </div>

        {/* Sidebar menu for small screens */}
        <div className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-cream border-l border-stone transition-all duration-300 ${visible ? 'w-64 shadow-2xl' : 'w-0'}`}>
                <div className='flex flex-col text-charcoal'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-3 p-4 cursor-pointer border-b border-stone/50'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt='Close' />
                        <p className='text-xs font-semibold tracking-wider'>CLOSE</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b border-stone/30 text-sm tracking-wider hover:bg-sand/20' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b border-stone/30 text-sm tracking-wider hover:bg-sand/20' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b border-stone/30 text-sm tracking-wider hover:bg-sand/20' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b border-stone/30 text-sm tracking-wider hover:bg-sand/20' to='/contact'>CONTACT</NavLink>
                    <div className='p-6 mt-8 text-xs text-charcoal/70 space-y-2'>
                      <p className='font-semibold text-saddle'>{brand.name}</p>
                      <p>{brand.delivery}</p>
                      <p>{brand.phone}</p>
                    </div>
                </div>
        </div>

    </div>
    <div className='hidden border-b border-stone/50 py-1.5 text-center text-[10px] tracking-[0.22em] text-charcoal/75 sm:block bg-sand/15'>
      {brand.tagline.toUpperCase()} &nbsp;·&nbsp; {brand.statement.toUpperCase()} &nbsp;·&nbsp; {brand.delivery.toUpperCase()}
    </div>
    </header>
  )
}

export default Navbar
