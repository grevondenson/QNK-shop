import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              variantId: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='border-t border-stone/50 pt-12'>

      <div className='text-2xl mb-4'>
        <Title text1={'YOUR'} text2={'SHOPPING BAG'} />
      </div>

      {cartData.length === 0 ? (
        <div className='py-20 text-center bg-sand/15 border border-stone/40 my-6 rounded-sm'>
          <p className='font-display text-xl text-charcoal'>Your shopping bag is currently empty.</p>
          <p className='text-xs text-charcoal/70 mt-2 mb-6'>Explore our curated collection of effortlessly chic bags and accessories.</p>
          <button 
            onClick={() => navigate('/collection')} 
            className='bg-charcoal text-cream hover:bg-saddle px-8 py-3 text-xs tracking-widest uppercase transition-colors'
          >
            DISCOVER COLLECTION
          </button>
        </div>
      ) : (
        <div>
          {
            cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;

              const variant = productData.variants?.find((v) => v._id === item.variantId);
              const price = variant ? (variant.priceMinor / 100) : productData.price;

              return (
                <div key={index} className='py-4 border-b border-stone/40 text-charcoal grid grid-cols-[4fr_1fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-4 sm:gap-6'>
                    <img className='w-16 sm:w-20 object-cover bg-sand/20 border border-stone/40 rounded-sm' src={productData.image[0]} alt={productData.name} />
                    <div className='space-y-1'>
                      <p className='text-sm sm:text-base font-medium'>{productData.name}</p>
                      <div className='flex flex-wrap items-center gap-2 text-xs text-charcoal/70'>
                        <span className='font-semibold text-saddle'>{currency}{price.toLocaleString()}</span>
                        {variant && (
                          <>
                            <span>·</span>
                            <span className='border border-stone/60 bg-sand/30 px-2 py-0.5 rounded text-[11px]'>{variant.colour}</span>
                            <span className='text-[11px] text-charcoal/60'>({variant.material})</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-center'>
                    <input 
                      onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.variantId, Number(e.target.value))} 
                      className='w-12 sm:w-16 border border-stone px-2 py-1 text-center text-sm rounded outline-none focus:border-saddle' 
                      type="number" 
                      min={1} 
                      value={item.quantity} 
                    />
                  </div>

                  <div className='flex justify-end'>
                    <button 
                      onClick={() => updateQuantity(item._id, item.variantId, 0)} 
                      className='p-1 hover:opacity-60 transition-opacity'
                      aria-label="Remove item"
                    >
                      <img className='w-4 sm:w-4.5 cursor-pointer' src={assets.bin_icon} alt="Remove item" />
                    </button>
                  </div>
                </div>
              )
            })
          }

          <div className='flex justify-end my-16'>
            <div className='w-full sm:w-[480px]'>
              <CartTotal />
              <div className='w-full text-end mt-6'>
                <button 
                  onClick={() => navigate('/place-order')} 
                  className='bg-charcoal text-cream hover:bg-saddle text-xs tracking-widest uppercase px-10 py-3.5 transition-colors font-medium shadow-sm w-full sm:w-auto'
                >
                  PROCEED TO RESERVATION CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Cart
