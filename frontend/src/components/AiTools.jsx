import React from 'react'
import { AiToolsData } from '../assets/assets.js'
// import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AiTools = () => {

    const navigate = useNavigate()
    const { user } = useAuth()
    
    return (
        <div className='px-4 sm:px-20 xl:px-32 my-24 bg-[#1A1A1A]'>
            <div className='text-center'>
                <h2 className='text-white text-[42px] font-semibold'>
                    <span className='text-[#FFD700]'>AI</span> Tools
                </h2>
                <p className='text-gray-400 max-w-lg mx-auto'>
                    Everything You Need to Create Posts are Present Here 
                </p>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 justify-center'>
                {/* Generate Images Tool */}
                <div
                    className='rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,215,0,0.3)] cursor-pointer'
                    onClick={() => {
                        if (user) {
                            navigate('/ai/generate-image')
                        } else {
                            alert('Please log in to access this tool.')
                        }
                    }}
                >
                    <div className='p-8 rounded-lg bg-[#1A1A1A] shadow-2xl flex flex-col items-start min-h-[260px] h-full border border-[#333333] hover:border-[#FFD700] transition-colors'>
                        <div className='w-12 h-12 p-3 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500]'>
                            <svg className='w-6 h-6 text-[#0F0F0F]' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="9" cy="9" r="2"/>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                        </div>
                        <h3 className='mb-2 text-lg font-semibold text-[#FFD700]'>Generate Images</h3>
                        <p className='text-gray-400 text-sm'>Create stunning AI-generated images for your social media posts with advanced AI models.</p>
                    </div>
                </div>

                {/* Generate Videos Tool */}
                <div
                    className='rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,215,0,0.3)] cursor-pointer'
                    onClick={() => {
                        if (user) {
                            navigate('/ai/generate-videos')
                        } else {
                            alert('Please log in to access this tool.')
                        }
                    }}
                >
                    <div className='p-8 rounded-lg bg-[#1A1A1A] shadow-2xl flex flex-col items-start min-h-[260px] h-full border border-[#333333] hover:border-[#FFD700] transition-colors'>
                        <div className='w-12 h-12 p-3 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500]'>
                            <svg className='w-6 h-6 text-[#0F0F0F]' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polygon points="23 7 16 12 23 17 23 7"/>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                            </svg>
                        </div>
                        <h3 className='mb-2 text-lg font-semibold text-[#FFD700]'>Generate Videos</h3>
                        <p className='text-gray-400 text-sm'>Create engaging video content using AI technology for maximum social media impact.</p>
                    </div>
                </div>

                {/* Post on Instagram Tool */}
                <div
                    className='rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,215,0,0.3)] cursor-pointer'
                    onClick={() => {
                        if (user) {
                            navigate('/ai/post-insta')
                        } else {
                            alert('Please log in to access this tool.')
                        }
                    }}
                >
                    <div className='p-8 rounded-lg bg-[#1A1A1A] shadow-2xl flex flex-col items-start min-h-[260px] h-full border border-[#333333] hover:border-[#FFD700] transition-colors'>
                        <div className='w-12 h-12 p-3 rounded-xl flex items-center justify-center mb-4' style={{background: 'linear-gradient(135deg, #E1306C, #833AB4)'}}>
                            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                <path d="M12 9v4"/>
                                <path d="m12 17.02.01 0"/>
                            </svg>
                        </div>
                        <h3 className='mb-2 text-lg font-semibold text-[#FFD700]'>Post On Meta</h3>
                        <p className='text-gray-400 text-sm'>Schedule and automatically post your content to Instagram and Facebook platforms.</p>
                    </div>
                </div>

                {/* Post on X Tool */}
                <div
                    className='rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,215,0,0.3)] cursor-pointer'
                    onClick={() => {
                        if (user) {
                            navigate('/ai/post-x')
                        } else {
                            alert('Please log in to access this tool.')
                        }
                    }}
                >
                    <div className='p-8 rounded-lg bg-[#1A1A1A] shadow-2xl flex flex-col items-start min-h-[260px] h-full border border-[#333333] hover:border-[#FFD700] transition-colors flex item-center justify-center '>
                        <div className='w-12 h-12 p-3 rounded-xl flex items-center justify-center mb-4' style={{background: 'linear-gradient(135deg, #1DA1F2, #0D1117)'}}>
                            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                <path d="M12 9v4"/>
                                <path d="m12 17.02.01 0"/>
                            </svg>
                        </div>
                        <h3 className='mb-2 text-lg font-semibold text-[#FFD700]'>Post On X</h3>
                        <p className='text-gray-400 text-sm'>Automate your Twitter/X posting with intelligent scheduling and content optimization.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AiTools
