import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
    const subtotal = getCartAmount();
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee;
    const deposit = Math.ceil(total * 0.2);
    const balance = total - deposit;

  return (
    <div className='w-full bg-sand/15 border border-stone/50 p-5 rounded-sm'>
      <div className='text-xl'>
        <Title text1={'ORDER'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2.5 mt-3 text-xs sm:text-sm text-charcoal'>
            <div className='flex justify-between'>
                <span className='text-charcoal/70'>Items Subtotal</span>
                <span>{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
                <span className='text-charcoal/70'>Countrywide Delivery (Kenya)</span>
                <span>{currency} {delivery_fee.toLocaleString()}</span>
            </div>
            <div className='border-t border-stone/50 pt-2 flex justify-between font-semibold'>
                <span>Total Order Value</span>
                <span>{currency} {total.toLocaleString()}</span>
            </div>
            
            {total > 0 && (
                <div className='border-t border-dashed border-stone/60 pt-3 mt-1 space-y-1.5'>
                    <div className='flex justify-between text-saddle font-bold bg-cream/90 p-2 border border-saddle/30 rounded-sm'>
                        <span>20% Deposit (Due Today)</span>
                        <span>{currency} {deposit.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between text-charcoal/60 text-[11px] px-1'>
                        <span>Balance Due on Delivery (80%)</span>
                        <span>{currency} {balance.toLocaleString()}</span>
                    </div>
                </div>
            )}
      </div>
    </div>
  )
}

export default CartTotal
