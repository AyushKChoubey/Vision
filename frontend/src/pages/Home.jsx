import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'

import Footer from '../components/Footer'
import Plan from '../components/Plan'

const Home = () => {
  return (
    <div className='bg-[#1A1A1A] min-h-screen'>
      <Navbar />
      <Hero />
      <AiTools />
      <Testimonial />
      <Plan/>
      <Footer />
      
      
    </div>
    
  )
}

export default Home
