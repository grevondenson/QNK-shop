import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { brand } from '../brand'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>{brand.name} is a Kenyan bags and accessories shop created for considered everyday style.</p>
              <p>We curate distinctive silhouettes, tactile materials, and useful details for the way you move through your day.</p>
              <b className='text-gray-800'>{brand.tagline}</b>
              <p>{brand.statement}. From discovery to delivery, our experience is designed to feel personal, calm, and effortless.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Thoughtful selection:</b>
            <p className=' text-gray-600'>Every bag is chosen for its finish, function, and lasting place in your wardrobe.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Kenya-wide delivery:</b>
            <p className=' text-gray-600'>Shop from wherever you are in Kenya with clear delivery information at checkout.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Reserved for you:</b>
            <p className=' text-gray-600'>A 20% payment reserves your selected piece while we prepare it for you.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
