import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import UserButton from './UserButton'

const Navbar = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    
    return (
        <div className='fixed z-50 w-full backdrop-blur-sm bg-[#0F0F0F]/90 flex justify-between 
        items-center py-3 px-4 sm:px-20 xl:px-32 border-b border-[#333333]'>
            
            {/* Logo */}
            <div className='flex items-center cursor-pointer' onClick={() => navigate('/')}>
                <svg width="35" height="28" viewBox="0 0 35 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-6 mr-2">
                    <path d="M8.63281 0L15.8667 6.18025C16.2962 6.54716 16.5438 7.08559 16.5438 7.65266V12.3104L9.30979 6.13018C8.88033 5.76327 8.63281 5.22484 8.63281 4.65773V0Z" fill="#FFD700"/>
                    <path d="M8.63281 27.9999L15.8667 21.8196C16.2962 21.4527 16.5438 20.9143 16.5438 20.3472V15.6895L9.30979 21.8697C8.88033 22.2366 8.63281 22.775 8.63281 23.3421V27.9999Z" fill="#FFD700"/>
                    <path d="M0 6.5166L7.13558 12.5788C7.48152 12.8727 7.91958 13.0339 8.37228 13.0339H14.1268L7.00881 6.97314C6.66261 6.67835 6.22387 6.5166 5.77046 6.5166H0Z" fill="#FFD700"/>
                    <path d="M0 21.4822L7.09169 15.4235C7.43826 15.1274 7.87793 14.9648 8.33245 14.9648H14.144L7.00839 21.027C6.66242 21.3209 6.22434 21.4822 5.77166 21.4822H0Z" fill="#FFD700"/>
                    <path d="M26.3719 0L19.1379 6.18025C18.7085 6.54716 18.4609 7.08559 18.4609 7.65266V12.3104L25.6949 6.13018C26.1243 5.76327 26.3719 5.22484 26.3719 4.65773V0Z" fill="#FFD700"/>
                    <path d="M26.3719 27.9999L19.1379 21.8196C18.7085 21.4527 18.4609 20.9143 18.4609 20.3472V15.6895L25.6949 21.8697C26.1243 22.2366 26.3719 22.775 26.3719 23.3421V27.9999Z" fill="#FFD700"/>
                    <path d="M35.0019 6.5166L27.8663 12.5788C27.5204 12.8727 27.0822 13.0339 26.6296 13.0339H20.875L27.9931 6.97314C28.3392 6.67835 28.778 6.5166 29.2314 6.5166H35.0019Z" fill="#FFD700"/>
                    <path d="M34.9994 21.4822L27.9077 15.4235C27.5612 15.1274 27.1214 14.9648 26.6669 14.9648H20.8555L27.991 21.027C28.337 21.3209 28.775 21.4822 29.2277 21.4822H34.9994Z" fill="#FFD700"/>
                </svg>
                <span className="text-[#FFD700] font-bold text-xl">VisionCast</span>
            </div>

            {/* User Authentication */}
            {user ? (
                <UserButton />
            ) : (
                <button 
                    onClick={() => navigate('/auth')}
                    className="flex items-center gap-2 rounded-full text-sm cursor-pointer 
                    bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] px-8 py-2.5 
                    hover:scale-105 transition-all duration-300 font-medium shadow-lg
                    hover:shadow-[0_8px_30px_rgb(255,215,0,0.3)]"
                >
                    Login 
                    <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}

export default Navbar