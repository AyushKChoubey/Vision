import { House, Image, LogOut, SquarePen, Video } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/generate-image', label: 'Generate Images', Icon: Image },
  { to: '/ai/generate-videos', label: 'Generate Videos', Icon: Video },
  { to: '/ai/post-insta', label: 'Post On Meta', Icon: SquarePen },
  { to: '/ai/post-x', label: 'Post On X', Icon: SquarePen },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user, signOut } = useAuth()

  return (
    <div
      className={`w-60 bg-[#1A1A1A] border-r border-[#333333] flex flex-col justify-between items-center 
      max-sm:absolute top-14 bottom-0 z-40
      ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} 
      transition-transform duration-300 ease-in-out 
      overflow-hidden`}   // 👈 no scroll in sidebar
    >
      {/* User Profile Section */}
      <div className='my-7 w-full flex flex-col items-center'>
        <div className='relative mb-4'>
          <img
            src={user?.imageUrl}
            alt="User Avatar"
            className='w-16 h-16 rounded-full mx-auto border-4 border-[#FFD700] shadow-lg'
          />
          <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#1A1A1A]'></div>
        </div>
        <h1 className='text-center font-semibold text-[#FFD700] text-lg'>{user?.fullName}</h1>
        <p className='text-gray-400 text-sm'>Premium Member</p>

        {/* Navigation Items */}
        <div className='px-4 mt-8 text-sm font-medium w-full space-y-2'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] shadow-lg'
                    : 'text-gray-300 hover:bg-[#2A2A2A] hover:text-[#FFD700] hover:border-[#FFD700]/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.Icon className={`w-5 h-5 ${isActive ? 'text-[#0F0F0F]' : ''}`} />
                  <span className='font-medium'>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div className='mb-8 mt-30 w-full px-4'>
          <button
            onClick={signOut}
            className='w-full flex items-center justify-center gap-2 py-3 rounded-lg 
            bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] 
            font-bold shadow-lg hover:from-[#FFA500] hover:to-[#FFD700] transition'
          >
            <LogOut className='w-5 h-5' />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
