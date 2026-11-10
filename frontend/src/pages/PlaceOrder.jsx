import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { brand } from '../brand'

const PlaceOrder = () => {

    const { navigate, backendUrl, token, cartItems, setCartItems, products } = useContext(ShopContext);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: 'Nairobi',
        state: 'Nairobi County',
        zipcode: '00100',
        country: 'Kenya',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = products.find(product => product._id === items)
                        if (itemInfo?.variants?.some((variant) => variant._id === item)) {
                            orderItems.push({ productId: items, variantId: item, quantity: cartItems[items][item] })
                        }
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.error('Your shopping bag is empty')
                setLoading(false)
                return
            }

            const orderData = {
                address: formData,
                items: orderItems,
                phone: formData.phone
            }

            const reservation = await axios.post(`${backendUrl}/api/order/reserve`, orderData, { headers: { token } })
            if (!reservation.data.success) {
                toast.error(reservation.data.message)
                setLoading(false)
                return
            }

            const payment = await axios.post(`${backendUrl}/api/order/mpesa/initiate`, { orderId: reservation.data.orderId, phone: formData.phone }, { headers: { token } })
            if (!payment.data.success) {
                toast.error(payment.data.message)
                setLoading(false)
                return
            }

            toast.success('M-Pesa prompt sent! Complete the 20% reservation deposit on your phone.')
            setCartItems({})
            navigate('/orders')

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-8 pt-8 sm:pt-14 min-h-[80vh] border-t border-stone/50'>
            {/* ------------- Left Side: Delivery Details ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl mb-2'>
                    <Title text1={'KENYA'} text2={'DELIVERY DETAILS'} />
                </div>
                <p className='text-xs text-charcoal/70 mb-2'>Deliveries are conducted countrywide. Provide accurate location details for courier dispatch.</p>

                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none focus:border-saddle' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none focus:border-saddle' type="text" placeholder='Last name' />
                </div>

                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none focus:border-saddle' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none focus:border-saddle' type="text" placeholder='Delivery Address / Street / Building' />

                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none focus:border-saddle' type="text" placeholder='City / Town (e.g. Nairobi)' />
                    <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none focus:border-saddle' type="text" placeholder='County / Area' />
                </div>

                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none focus:border-saddle' type="text" placeholder='Postal Code (optional)' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none bg-stone/20' type="text" readOnly placeholder='Country' />
                </div>

                <div>
                    <label className='block text-xs font-semibold text-charcoal mb-1 uppercase tracking-wider'>M-Pesa Mobile Number</label>
                    <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-stone/80 rounded-sm py-2 px-3.5 w-full text-sm outline-none focus:border-saddle' type="tel" placeholder='e.g. 0712 345 678 or 2547...' />
                    <span className='text-[11px] text-charcoal/60 mt-1 block'>Used to receive the instant Safaricom M-Pesa STK payment prompt.</span>
                </div>
            </div>

            {/* ------------- Right Side: Order Summary & M-Pesa ------------------ */}
            <div className='w-full sm:max-w-[460px]'>

                <div>
                    <CartTotal />
                </div>

                <div className='mt-8 border border-stone/60 bg-white p-5 rounded-sm shadow-sm'>
                    <Title text1={'PAYMENT'} text2={'& RESERVATION'} />
                    
                    <div className='flex items-center gap-3 border border-emerald-600/30 bg-emerald-50/50 p-3.5 rounded-sm mt-3'>
                        <div className='w-3 h-3 rounded-full bg-emerald-600 animate-pulse'></div>
                        <div className='text-xs'>
                            <p className='font-bold text-emerald-900'>M-Pesa STK Push Active</p>
                            <p className='text-emerald-700 text-[11px] mt-0.5'>20% Deposit secures your bag reservation instantly.</p>
                        </div>
                    </div>

                    <div className='text-xs text-charcoal/75 space-y-1.5 mt-4 p-3 bg-sand/15 border border-stone/40 rounded-sm'>
                        <p className='font-semibold text-saddle'>How your reservation works:</p>
                        <p>1. Clicking "CONFIRM RESERVATION" sends a prompt to your Safaricom phone.</p>
                        <p>2. Enter your M-Pesa PIN to complete the 20% reservation deposit.</p>
                        <p>3. Your selected bag is held for you, and our team prepares dispatch.</p>
                        <p>4. The 80% balance is settled upon delivery.</p>
                    </div>

                    <div className='w-full mt-6'>
                        <button 
                            disabled={loading}
                            type='submit' 
                            className='w-full bg-saddle hover:bg-[#72573f] text-white py-3.5 text-xs font-semibold tracking-widest uppercase transition-colors shadow-sm disabled:opacity-50'
                        >
                            {loading ? 'INITIATING M-PESA PROMPT...' : 'CONFIRM RESERVATION (20% VIA M-PESA)'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
