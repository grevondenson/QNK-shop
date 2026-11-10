import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { brand } from '../brand'

const Orders = () => {

  const { backendUrl, token, currency, navigate } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(false)

  const loadOrderData = async () => {
    try {
      if (!token) return;
      setLoading(true);

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              orderNumber: order.orderNumber,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              depositMinor: order.depositMinor,
              amount: order.amount
            })
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t border-stone/50 pt-12'>

        <div className='text-2xl mb-4'>
            <Title text1={'MY'} text2={'RESERVATIONS & ORDERS'}/>
        </div>

        {!token ? (
          <div className='py-16 text-center bg-sand/15 border border-stone/40 rounded-sm my-6'>
            <p className='font-display text-lg text-charcoal'>Sign in to track your bag reservations.</p>
            <p className='text-xs text-charcoal/70 mt-1 mb-5'>View your active M-Pesa reservation deposits and dispatch status.</p>
            <button onClick={() => navigate('/login')} className='bg-charcoal text-cream hover:bg-saddle px-8 py-3 text-xs tracking-widest uppercase transition-colors'>
              SIGN IN
            </button>
          </div>
        ) : orderData.length === 0 ? (
          <div className='py-16 text-center bg-sand/15 border border-stone/40 rounded-sm my-6'>
            <p className='font-display text-lg text-charcoal'>No order history yet.</p>
            <p className='text-xs text-charcoal/70 mt-1 mb-5'>Discover our effortless silhouettes and secure your favorite piece.</p>
            <button onClick={() => navigate('/collection')} className='bg-charcoal text-cream hover:bg-saddle px-8 py-3 text-xs tracking-widest uppercase transition-colors'>
              BROWSE COLLECTION
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
              {
                orderData.map((item, index) => {
                  const price = item.unitPriceMinor ? item.unitPriceMinor / 100 : item.price;
                  const isConfirmed = item.status?.toLowerCase().includes('confirmed') || item.payment;
                  return (
                    <div key={index} className='p-5 border border-stone/50 bg-white rounded-sm text-charcoal flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm'>
                        <div className='flex items-start gap-5 text-sm'>
                            {item.image?.[0] && (
                              <img className='w-16 sm:w-20 object-cover aspect-square bg-sand/20 border border-stone/40 rounded-sm' src={item.image[0]} alt={item.title || item.name} />
                            )}
                            <div className='space-y-1'>
                              <div className='flex items-center gap-2'>
                                <p className='text-sm sm:text-base font-medium'>{item.title || item.name}</p>
                                {item.orderNumber && (
                                  <span className='text-[10px] font-mono bg-sand/30 text-saddle px-2 py-0.5 rounded'>
                                    {item.orderNumber}
                                  </span>
                                )}
                              </div>
                              <div className='flex flex-wrap items-center gap-3 text-xs text-charcoal/75'>
                                <span className='font-semibold text-saddle'>{currency}{price.toLocaleString()}</span>
                                <span>·</span>
                                <span>Qty: {item.quantity}</span>
                                {item.colour && (
                                  <>
                                    <span>·</span>
                                    <span className='border border-stone/60 bg-sand/20 px-2 py-0.5 rounded text-[11px]'>{item.colour}</span>
                                  </>
                                )}
                                {item.material && (
                                  <span className='text-charcoal/60'>({item.material})</span>
                                )}
                              </div>
                              <p className='text-[11px] text-charcoal/60 pt-1'>
                                Reserved on: <span className='font-medium text-charcoal'>{new Date(item.date).toLocaleDateString()}</span>
                              </p>
                              <p className='text-[11px] text-charcoal/60'>
                                Payment: <span className='font-medium text-emerald-800'>{item.paymentMethod || 'M-Pesa'}</span>
                              </p>
                            </div>
                        </div>

                        <div className='md:w-1/2 flex items-center justify-between gap-4 border-t md:border-t-0 pt-3 md:pt-0'>
                            <div className='flex items-center gap-2'>
                                <span className={`w-2.5 h-2.5 rounded-full ${isConfirmed ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`}></span>
                                <span className='text-xs sm:text-sm font-medium tracking-wide'>{item.status}</span>
                            </div>
                            <button onClick={loadOrderData} className='border border-stone px-4 py-2 text-xs font-semibold tracking-wider uppercase hover:bg-sand/20 transition-colors rounded-sm'>
                              REFRESH STATUS
                            </button>
                        </div>
                    </div>
                  )
                })
              }
          </div>
        )}
    </div>
  )
}

export default Orders
