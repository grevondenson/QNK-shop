import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
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

  const removeProduct = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to remove this bag from the catalogue?')) return;
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h2 className='text-lg font-bold text-gray-800'>Bag Catalogue & Inventory</h2>
          <p className='text-xs text-gray-500'>Manage active bag collections, colours, materials, and stock levels.</p>
        </div>
        <button onClick={fetchList} className='text-xs border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50'>
          Refresh List
        </button>
      </div>

      <div className='flex flex-col gap-2'>
        {/* ------- List Table Title ---------- */}
        <div className='hidden md:grid grid-cols-[0.8fr_2.5fr_1.5fr_2.5fr_0.7fr] items-center py-2 px-3 border border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600'>
          <span>Image</span>
          <span>Name & Slug</span>
          <span>Category</span>
          <span>Variants (SKU · Price · Stock)</span>
          <span className='text-center'>Action</span>
        </div>

        {/* ------ Product List ------ */}
        {list.length === 0 ? (
          <div className='text-center py-12 text-sm text-gray-500 border border-dashed rounded'>
            {loading ? 'Loading catalogue...' : 'No bags in catalogue yet. Add your first bag collection!'}
          </div>
        ) : (
          list.map((item, index) => (
            <div className='grid grid-cols-1 md:grid-cols-[0.8fr_2.5fr_1.5fr_2.5fr_0.7fr] items-center gap-3 py-3 px-3 border border-gray-200 bg-white rounded-sm text-xs text-gray-700 shadow-sm' key={index}>
              <img className='w-14 h-14 object-cover rounded border' src={item.image[0]} alt={item.name} />
              <div>
                <p className='font-semibold text-sm text-gray-900'>{item.name}</p>
                <p className='text-gray-400 text-[11px]'>{item.slug || 'no-slug'}</p>
                <span className={`inline-block text-[10px] px-2 py-0.5 mt-1 rounded font-medium ${item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'}`}>
                  {item.status || 'draft'}
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-800'>{item.category}</p>
                <p className='text-gray-500'>{item.subCategory}</p>
              </div>
              <div className='space-y-1'>
                {item.variants && item.variants.length > 0 ? (
                  item.variants.map((variant) => {
                    const available = variant.stockOnHand - variant.reservedQuantity;
                    return (
                      <div key={variant._id} className='bg-gray-50 p-1.5 rounded border border-gray-100'>
                        <span className='font-mono font-medium text-gray-900'>{variant.sku}: </span>
                        <span>{variant.colour} ({variant.material}) · </span>
                        <span className='font-semibold text-[#8B6D53]'>{currency}{(variant.priceMinor / 100).toLocaleString()} · </span>
                        <span className={`font-semibold ${available > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          {available} in stock
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <p className='text-gray-400 italic'>Single pricing: {currency}{item.price}</p>
                )}
              </div>
              <div className='text-center'>
                <button 
                  onClick={() => removeProduct(item._id)} 
                  className='text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors'
                  title="Remove bag"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default List
