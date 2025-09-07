import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()
    
    return (
        <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full 
        justify-center bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A]
        min-h-screen'>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className='text-center mb-6 relative z-10'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl
                font-semibold mx-auto leading-[1.2] text-white'>
                    Generate content And Grow faster 
                    <br/>With<span className='text-[#FFD700]'> AI</span>
                </h1>
                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl mx-auto
                max-sm:text-xs text-gray-300'> 
                    Generate images and videos with AI, then schedule and auto-post to Social Media and more on dashboard.
                </p>
            </div>
            
            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs relative z-10'>
                <button 
                    onClick={() => navigate('/ai')} 
                    className='bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] px-10 py-3 rounded-lg
                    hover:scale-105 active:scale-95 transition-all duration-300 font-medium shadow-lg
                    hover:shadow-[0_8px_30px_rgb(255,215,0,0.3)]'
                >
                    Start Creating Now
                </button>
            </div>
        </div>
    )
}

export default Hero