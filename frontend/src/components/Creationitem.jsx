import React from 'react'
import { Image, Video, Share2, Download, Eye, MoreHorizontal, Calendar, Clock } from 'lucide-react'

const CreationItem = ({ creation, onView, onShare, onDownload }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'posted': 
        return 'bg-green-900/50 text-green-300 border-green-700/50'
      case 'scheduled': 
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50'
      case 'draft': 
        return 'bg-gray-700/50 text-gray-300 border-gray-600/50'
      default: 
        return 'bg-gray-700/50 text-gray-300 border-gray-600/50'
    }
  }

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return (
          <div className='w-6 h-6 bg-gradient-to-br from-[#E1306C] to-[#833AB4] rounded-lg flex items-center justify-center'>
            <svg className='w-4 h-4 text-white' fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        )
      case 'x':
      case 'twitter':
        return (
          <div className='w-6 h-6 bg-black rounded-lg flex items-center justify-center'>
            <svg className='w-4 h-4 text-white' fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
        )
      case 'facebook':
        return (
          <div className='w-6 h-6 bg-[#1877F2] rounded-lg flex items-center justify-center'>
            <svg className='w-4 h-4 text-white' fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        )
      default:
        return (
          <div className='w-6 h-6 bg-[#FFD700] rounded-lg flex items-center justify-center'>
            <Share2 className='w-4 h-4 text-[#0F0F0F]' />
          </div>
        )
    }
  }

  return (
    <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#FFD700] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,215,0,0.1)] group'>
      <div className='flex items-start gap-4'>
        {/* Media Thumbnail */}
        <div className='relative flex-shrink-0'>
          <div className='w-20 h-20 rounded-lg overflow-hidden border border-[#333333] group-hover:border-[#FFD700] transition-colors'>
            <img 
              src={creation.thumbnail} 
              alt={creation.title}
              className='w-full h-full object-cover'
            />
          </div>
          
          {/* Media Type Badge */}
          <div className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg'>
            {creation.type === 'image' ? 
              <Image className='w-3 h-3 text-[#0F0F0F]' /> : 
              <Video className='w-3 h-3 text-[#0F0F0F]' />
            }
          </div>
        </div>

        {/* Content Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between mb-3'>
            <div>
              <h3 className='font-semibold text-white text-lg mb-1 group-hover:text-[#FFD700] transition-colors'>
                {creation.title}
              </h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                {creation.description}
              </p>
            </div>
            
            {/* Status Badge */}
            <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(creation.status)} flex-shrink-0 ml-3`}>
              {creation.status.charAt(0).toUpperCase() + creation.status.slice(1)}
            </span>
          </div>

          {/* Creation Details */}
          <div className='flex items-center gap-4 text-xs text-gray-500 mb-4'>
            <div className='flex items-center gap-1'>
              <Clock className='w-3 h-3' />
              {creation.createdAt}
            </div>
            <div className='flex items-center gap-1'>
              {getPlatformIcon(creation.platform)}
              <span className='ml-1'>{creation.platform}</span>
            </div>
            {creation.scheduledFor && (
              <div className='flex items-center gap-1'>
                <Calendar className='w-3 h-3' />
                <span>Scheduled</span>
              </div>
            )}
          </div>

          {/* Engagement Stats (if posted) */}
          {creation.status === 'posted' && creation.stats && (
            <div className='flex items-center gap-6 text-xs text-gray-400 mb-4 p-3 bg-[#2A2A2A] rounded-lg border border-[#333333]'>
              <div className='flex items-center gap-1'>
                <svg className='w-3 h-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{creation.stats?.likes || Math.floor(Math.random() * 1000)}K</span>
              </div>
              <div className='flex items-center gap-1'>
                <svg className='w-3 h-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{creation.stats?.comments || Math.floor(Math.random() * 100)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Share2 className='w-3 h-3' />
                <span>{creation.stats?.shares || Math.floor(Math.random() * 500)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex items-center gap-2'>
            <button 
              onClick={() => onView && onView(creation)}
              className='px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#333333] hover:text-[#FFD700] transition-all text-sm border border-[#333333] hover:border-[#FFD700] flex items-center gap-2'
            >
              <Eye className='w-4 h-4' />
              View
            </button>
            
            <button 
              onClick={() => onShare && onShare(creation)}
              className='px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#333333] hover:text-[#FFD700] transition-all text-sm border border-[#333333] hover:border-[#FFD700] flex items-center gap-2'
            >
              <Share2 className='w-4 h-4' />
              Share
            </button>
            
            <button 
              onClick={() => onDownload && onDownload(creation)}
              className='px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#333333] hover:text-[#FFD700] transition-all text-sm border border-[#333333] hover:border-[#FFD700] flex items-center gap-2'
            >
              <Download className='w-4 h-4' />
              Download
            </button>
            
            <button className='p-2 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#333333] hover:text-[#FFD700] transition-all border border-[#333333] hover:border-[#FFD700]'>
              <MoreHorizontal className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreationItem