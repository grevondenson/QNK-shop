import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        toast.success('Order status updated')
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-lg font-bold text-gray-800'>Customer Bag Reservations & Orders</h2>
          <p className='text-xs text-gray-500'>Manage 20% M-Pesa reservation deposits, dispatch readiness, and delivery tracking across Kenya.</p>
        </div>
        <button onClick={fetchAllOrders} className='text-xs border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50'>
          Refresh Orders
        </button>
      </div>

      <div className='space-y-4'>
        {orders.length === 0 ? (
          <div className='text-center py-12 text-sm text-gray-500 border border-dashed rounded'>
            {loading ? 'Loading orders...' : 'No orders or reservations recorded yet.'}
          </div>
        ) : (
          orders.map((order, index) => {
            const isPaid = order.paymentStatus === 'paid' || order.payment;
            return (
              <div className='grid grid-cols-1 lg:grid-cols-[0.5fr_2fr_1.2fr_1fr_1.2fr] gap-4 items-start border border-gray-200 bg-white p-5 rounded-sm text-xs text-gray-700 shadow-sm' key={index}>
                <img className='w-10 opacity-75' src={assets.parcel_icon} alt="Package" />
                
                {/* Items & Customer Address */}
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='font-mono font-bold text-gray-900'>{order.orderNumber || `ORD-${order._id.slice(-6)}`}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${isPaid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                      {order.paymentStatus || (order.payment ? 'paid' : 'pending')}
                    </span>
                  </div>

                  <div className='space-y-1 bg-gray-50 p-2.5 rounded border border-gray-100'>
                    {order.items.map((item, itemIndex) => (
                      <p className='py-0.5 text-gray-900 font-medium' key={itemIndex}>
                        • {item.title || item.name} × {item.quantity}
                        <span className='text-gray-500 font-normal'> ({item.colour || item.size}{item.material ? ` · ${item.material}` : ''})</span>
                      </p>
                    ))}
                  </div>

                  <div className='mt-3 space-y-0.5 text-gray-600'>
                    <p className='font-semibold text-gray-900'>{order.address?.firstName} {order.address?.lastName}</p>
                    <p>{order.address?.street}, {order.address?.city}</p>
                    <p>{order.address?.state}, {order.address?.country} {order.address?.zipcode}</p>
                    <p className='font-mono text-gray-900 pt-1'>Tel: {order.address?.phone || order.phone}</p>
                  </div>
                </div>

                {/* Reservation & Payment Details */}
                <div className='space-y-1.5'>
                  <p className='font-semibold text-gray-800'>Reservation Breakdown:</p>
                  <p>Method: <span className='font-medium text-gray-900'>{order.paymentMethod || 'M-Pesa STK'}</span></p>
                  <p>Total Value: <span className='font-bold text-gray-900'>{currency}{Number(order.amount).toLocaleString()}</span></p>
                  {order.depositMinor && (
                    <div className='bg-amber-50/70 border border-amber-200 p-2 rounded text-[11px] text-amber-900 mt-2'>
                      <p className='font-semibold'>20% Deposit: {currency}{(order.depositMinor / 100).toLocaleString()}</p>
                      <p className='text-amber-700'>Balance on delivery: {currency}{((order.amount * 100 - order.depositMinor) / 100).toLocaleString()}</p>
                    </div>
                  )}
                  <p className='text-[11px] text-gray-400 pt-1'>Placed: {new Date(order.date).toLocaleString()}</p>
                </div>

                {/* Total & Current Status */}
                <div>
                  <p className='text-gray-500 text-[11px] uppercase tracking-wider'>Status Indicator</p>
                  <p className='font-bold text-sm text-[#8B6D53] mt-1'>{order.status}</p>
                </div>

                {/* Status Selector */}
                <div>
                  <label className='block text-[11px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wider'>Update Order State</label>
                  <select 
                    onChange={(event) => statusHandler(event, order._id)} 
                    value={order.status} 
                    className='w-full p-2 border border-gray-300 rounded text-xs font-semibold bg-white outline-none focus:border-[#8B6D53]'
                  >
                    <option value="Reservation Pending">Reservation Pending</option>
                    <option value="Reservation Confirmed">Reservation Confirmed</option>
                    <option value="Preparing Dispatch">Preparing Dispatch</option>
                    <option value="Shipped">Shipped (Countrywide)</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Orders
