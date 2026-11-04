import axios from 'axios'
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const emptyVariant = { sku: '', colour: '', material: '', dimensions: '', capacity: '', priceMinor: '', stockOnHand: 0 }

const Add = ({ token }) => {
  const [images, setImages] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('Tote Bags')
  const [subCategory, setSubCategory] = useState('Vegan Leather')
  const [bestseller, setBestseller] = useState(false)
  const [status, setStatus] = useState('draft')
  const [variants, setVariants] = useState([{ ...emptyVariant }])

  const updateVariant = (index, field, value) => {
    setVariants((current) => current.map((variant, variantIndex) => (
      variantIndex === index ? { ...variant, [field]: value } : variant
    )))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('slug', slug)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('materials', JSON.stringify([...new Set(variants.map((variant) => variant.material).filter(Boolean))]))
      formData.append('colours', JSON.stringify([...new Set(variants.map((variant) => variant.colour).filter(Boolean))]))
      formData.append('variants', JSON.stringify(variants.map((variant) => ({
        ...variant,
        priceMinor: Number(variant.priceMinor),
        stockOnHand: Number(variant.stockOnHand)
      }))))
      formData.append('bestseller', bestseller)
      formData.append('status', status)
      images.forEach((image, index) => formData.append(`image${index + 1}`, image))

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } })
      if (!response.data.success) {
        toast.error(response.data.message)
        return
      }
      toast.success(response.data.message)
      setName('')
      setDescription('')
      setSlug('')
      setImages([])
      setVariants([{ ...emptyVariant }])
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex w-full flex-col items-start gap-4'>
      <div>
        <p className='mb-2'>Product images</p>
        <div className='flex gap-2'>
          {[0, 1, 2, 3].map((index) => (
            <label htmlFor={`image${index + 1}`} key={index}>
              <img className='h-20 w-20 object-cover' src={images[index] ? URL.createObjectURL(images[index]) : assets.upload_area} alt='' />
              <input id={`image${index + 1}`} type='file' accept='image/*' hidden onChange={(event) => setImages((current) => { const next = [...current]; next[index] = event.target.files[0]; return next.filter(Boolean).slice(0, 4) })} />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <label className='mb-2 block' htmlFor='product-name'>Product name</label>
        <input id='product-name' required value={name} onChange={(event) => setName(event.target.value)} className='w-full max-w-[500px] px-3 py-2' placeholder='Noir Crescent Bag' />
      </div>
      <div className='w-full'>
        <label className='mb-2 block' htmlFor='product-slug'>Product slug</label>
        <input id='product-slug' value={slug} onChange={(event) => setSlug(event.target.value)} className='w-full max-w-[500px] px-3 py-2' placeholder='noir-crescent-bag' />
      </div>
      <div className='w-full'>
        <label className='mb-2 block' htmlFor='product-description'>Description</label>
        <textarea id='product-description' required value={description} onChange={(event) => setDescription(event.target.value)} className='w-full max-w-[500px] px-3 py-2' placeholder='Describe the bag, finish, and use.' />
      </div>

      <div className='flex w-full flex-col gap-3 sm:flex-row sm:gap-8'>
        <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)} className='mt-2 block px-3 py-2'>
          {['Tote Bags', 'Shoulder Bags', 'Crossbody', 'Mini Bags', 'Clutches', 'Accessories'].map((option) => <option key={option}>{option}</option>)}
        </select></label>
        <label>Material<select value={subCategory} onChange={(event) => setSubCategory(event.target.value)} className='mt-2 block px-3 py-2'>
          {['Vegan Leather', 'Pebble Grain', 'Canvas', 'Nylon', 'Woven'].map((option) => <option key={option}>{option}</option>)}
        </select></label>
        <label>Publication<select value={status} onChange={(event) => setStatus(event.target.value)} className='mt-2 block px-3 py-2'>
          <option value='draft'>Draft</option><option value='active'>Active</option>
        </select></label>
      </div>

      <div className='w-full'>
        <div className='mb-2 flex items-center justify-between'>
          <p>Bag variants and inventory</p>
          <button type='button' className='text-saddle' onClick={() => setVariants((current) => [...current, { ...emptyVariant }])}>+ Add variant</button>
        </div>
        <div className='flex flex-col gap-3'>
          {variants.map((variant, index) => (
            <div className='grid gap-2 border border-stone p-3 sm:grid-cols-4' key={index}>
              {[
                ['sku', 'SKU'], ['colour', 'Colour'], ['material', 'Material'], ['dimensions', 'Dimensions'], ['capacity', 'Capacity']
              ].map(([field, label]) => <input key={field} required={['sku', 'colour', 'material'].includes(field)} value={variant[field]} onChange={(event) => updateVariant(index, field, event.target.value)} className='px-2 py-2' placeholder={label} />)}
              <input required min='0' type='number' value={variant.priceMinor} onChange={(event) => updateVariant(index, 'priceMinor', event.target.value)} className='px-2 py-2' placeholder='Price in cents' />
              <input required min='0' type='number' value={variant.stockOnHand} onChange={(event) => updateVariant(index, 'stockOnHand', event.target.value)} className='px-2 py-2' placeholder='Stock on hand' />
              {variants.length > 1 && <button type='button' className='text-left text-red-700' onClick={() => setVariants((current) => current.filter((_, variantIndex) => variantIndex !== index))}>Remove variant</button>}
            </div>
          ))}
        </div>
      </div>

      <label className='flex gap-2'><input type='checkbox' checked={bestseller} onChange={() => setBestseller((current) => !current)} /> Feature as bestseller</label>
      <button type='submit' className='bg-saddle px-8 py-3 text-white'>Save product</button>
    </form>
  )
}

export default Add
