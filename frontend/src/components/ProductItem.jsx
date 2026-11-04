import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price}) => {
    
    const {currency} = useContext(ShopContext);

  return (
    <Link onClick={()=>scrollTo(0,0)} className='cursor-pointer text-charcoal' to={`/product/${id}`}>
      <div className='overflow-hidden bg-sand/20'>
        <img className='transition duration-500 ease-in-out hover:scale-105' src={image[0]} alt={name} />
      </div>
      <p className='pb-1 pt-3 text-sm'>{name}</p>
      <p className='text-sm font-medium text-saddle'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
