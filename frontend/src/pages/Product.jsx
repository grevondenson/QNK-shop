import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [variantId, setVariantId] = useState('')

  const fetchProductData = async () => {
    const item = products.find((p) => p._id === productId);
    if (item) {
      setProductData(item)
      setImage(item.image[0])
      setVariantId(item.variants?.[0]?._id || '')
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  const selectedVariant = productData?.variants?.find((v) => v._id === variantId);
  const displayPrice = selectedVariant ? (selectedVariant.priceMinor / 100) : productData.price;
  const isAvailable = selectedVariant ? (selectedVariant.stockOnHand - selectedVariant.reservedQuantity > 0) : true;

  return productData ? (
    <div className='border-t border-stone/50 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-16 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item, index) => (
                  <img 
                    onClick={() => setImage(item)} 
                    src={item} 
                    key={index} 
                    className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer object-cover aspect-square border ${image === item ? 'border-saddle shadow-sm' : 'border-stone/40'}`} 
                    alt={productData.name} 
                  />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto object-cover bg-sand/15 border border-stone/50 rounded-sm' src={image} alt={productData.name} />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-[11px] font-semibold tracking-widest uppercase text-saddle'>{productData.category}</span>
            <span className='text-stone'>·</span>
            <span className='text-[11px] text-charcoal/70 uppercase tracking-wider'>{productData.subCategory}</span>
          </div>

          <h1 className='font-display text-2xl sm:text-3xl text-charcoal font-medium'>{productData.name}</h1>
          
          <div className='flex items-center gap-1 mt-2.5'>
              <img src={assets.star_icon} alt="Star" className="w-3.5" />
              <img src={assets.star_icon} alt="Star" className="w-3.5" />
              <img src={assets.star_icon} alt="Star" className="w-3.5" />
              <img src={assets.star_icon} alt="Star" className="w-3.5" />
              <img src={assets.star_icon} alt="Star" className="w-3.5" />
              <p className='pl-2 text-xs text-charcoal/60'>(Effortlessly Chic)</p>
          </div>

          <div className='mt-5 flex items-baseline gap-3'>
            <p className='text-3xl font-medium text-charcoal'>{currency} {Number(displayPrice).toLocaleString()}</p>
            <span className='text-xs text-saddle bg-sand/30 border border-saddle/30 px-2 py-0.5 rounded'>
              20% Reservation: {currency} {Math.ceil(displayPrice * 0.2).toLocaleString()}
            </span>
          </div>

          <p className='mt-4 text-xs sm:text-sm text-charcoal/75 leading-relaxed md:w-4/5'>{productData.description}</p>
          
          {/* Variant Selector */}
          <div className='flex flex-col gap-3 my-7'>
            <label className='text-xs font-semibold uppercase tracking-wider text-charcoal'>Select Colour & Material</label>
            <div className='flex flex-wrap gap-2.5'>
              {productData.variants?.map((variant) => {
                const inStock = variant.stockOnHand - variant.reservedQuantity > 0;
                const isSelected = variant._id === variantId;
                return (
                  <button 
                    type='button' 
                    onClick={() => setVariantId(variant._id)} 
                    className={`border px-4 py-2.5 text-left rounded-sm transition-all text-xs ${
                      isSelected 
                        ? 'border-saddle bg-sand/35 ring-1 ring-saddle' 
                        : 'border-stone/60 bg-cream hover:bg-sand/20'
                    }`} 
                    key={variant._id}
                  >
                    <span className='block font-medium text-charcoal'>{variant.colour}</span>
                    <span className='text-[10px] text-charcoal/70'>
                      {variant.material} · {inStock ? 'In Stock' : 'Reserved'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <button 
              disabled={!variantId || !isAvailable} 
              onClick={() => addToCart(productData._id, variantId)} 
              className='bg-charcoal text-cream hover:bg-saddle px-10 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm'
            >
              {isAvailable ? 'ADD TO SHOPPING BAG' : 'OUT OF STOCK'}
            </button>
          </div>

          <hr className='mt-8 border-stone/50 sm:w-4/5' />

          <div className='text-xs text-charcoal/70 mt-5 space-y-1.5'>
              <p className='flex items-center gap-2'>
                <span className='text-saddle font-bold'>✓</span> 100% Authentic QNK Noire craftsmanship.
              </p>
              <p className='flex items-center gap-2'>
                <span className='text-saddle font-bold'>✓</span> Countrywide delivery across Kenya.
              </p>
              <p className='flex items-center gap-2'>
                <span className='text-saddle font-bold'>✓</span> 20% M-Pesa deposit confirms reservation instantly.
              </p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Care Section ------------- */}
      <div className='mt-20'>
        <div className='flex border-b border-stone/60'>
          <button className='border-b-2 border-saddle px-6 py-3 text-xs tracking-wider uppercase font-semibold text-charcoal'>
            Product Details & Materials
          </button>
          <button className='px-6 py-3 text-xs tracking-wider uppercase text-charcoal/60'>
            Reservation Policy
          </button>
        </div>
        <div className='flex flex-col gap-3 py-6 text-xs sm:text-sm text-charcoal/75 leading-relaxed'>
          <p>Designed for everyday movement, each QNK Noire bag balances considered details with effortless style.</p>
          <p>Wipe clean with a soft dry cloth. Store in its dust bag away from direct sunlight to preserve the supple grain finish.</p>
        </div>
      </div>

      {/* --------- Display related products ---------- */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
