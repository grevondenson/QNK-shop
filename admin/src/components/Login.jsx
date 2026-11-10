import axios from 'axios'
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if (response.data.success) {
                setToken(response.data.token)
                toast.success('Welcome back, Admin')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[#FAF9F6] px-4'>
        <div className='bg-white border border-[#CDC9C1]/80 shadow-lg rounded-sm px-8 py-10 max-w-md w-full text-center'>
            
            {/* Brand Logo & Heading */}
            <div className='flex flex-col items-center mb-6'>
                <img 
                    src={assets.logo} 
                    alt="QNK Noire Bags" 
                    className='w-14 h-14 rounded-sm object-cover border border-[#D1BAA6]/60 shadow-sm mb-3' 
                />
                <h1 className='font-serif text-2xl tracking-[0.06em] text-[#4D4D4D] font-bold'>QNK NOIRE</h1>
                <p className='text-[10px] tracking-[0.24em] text-[#8B6D53] font-semibold uppercase mt-0.5'>STORE ADMINISTRATION</p>
                <p className='text-xs text-gray-500 mt-2'>Sign in to manage bag catalogue, inventory & orders</p>
            </div>

            <form onSubmit={onSubmitHandler} className='text-left'>
                <div className='mb-4'>
                    <label className='text-xs font-semibold text-[#4D4D4D] block mb-1.5 uppercase tracking-wider'>Admin Email</label>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        className='rounded-sm w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#8B6D53] focus:ring-1 focus:ring-[#8B6D53] outline-none text-sm transition-colors' 
                        type="email" 
                        placeholder='admin@qnknoire.com' 
                        required 
                    />
                </div>

                <div className='mb-6'>
                    <label className='text-xs font-semibold text-[#4D4D4D] block mb-1.5 uppercase tracking-wider'>Password</label>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        className='rounded-sm w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#8B6D53] focus:ring-1 focus:ring-[#8B6D53] outline-none text-sm transition-colors' 
                        type="password" 
                        placeholder='••••••••••••' 
                        required 
                    />
                </div>

                <button 
                    disabled={loading}
                    className='w-full py-3 px-4 rounded-sm text-white bg-[#8B6D53] hover:bg-[#72573f] text-xs font-semibold tracking-widest uppercase transition-colors shadow-sm disabled:opacity-50' 
                    type="submit"
                > 
                    {loading ? 'SIGNING IN...' : 'LOGIN TO DASHBOARD'} 
                </button>
            </form>

            <div className='mt-8 pt-6 border-t border-gray-100 text-[11px] text-gray-400'>
                QNK Noire Bags · Protected Management Portal
            </div>
        </div>
    </div>
  )
}

export default Login
