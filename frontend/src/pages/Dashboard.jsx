import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, Calendar, BarChart3, Image, Video, Share2 } from 'lucide-react'
import apiService from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=100'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  const getDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch dashboard data from API
      const response = await apiService.users.getDashboard()
      
      if (response.status === 'success') {
        setDashboardData(response.data)
      } else {
        throw new Error(response.message || 'Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Dashboard data error:', error)
      setError(error.message)
      
      // Fallback to mock data for demo
      setDashboardData({
        stats: {
          totalCreations: 12,
          totalPosts: 45,
          totalViews: 15420,
          totalEngagement: 3210
        },
        recentCreations: [
          {
            _id: '1',
            type: 'image',
            title: 'AI Generated Instagram Post',
            description: 'Futuristic cityscape with neon lights',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            thumbnailUrl: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=100'
          },
          {
            _id: '2',
            type: 'video',
            title: 'Marketing Video Content',
            description: 'Product showcase with dynamic animations',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            status: 'processing',
            thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100'
          },
          {
            _id: '3',
            type: 'image',
            title: 'Product Launch Image',
            description: 'Minimalist design with brand colors',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            thumbnailUrl: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=100'
          }
        ],
        recentPosts: [],
        usage: {
          images: { used: 7, limit: 10 },
          videos: { used: 2, limit: 3 },
          posts: { used: 15, limit: 20 }
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      getDashboardData()
    }
  }, [user])

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'completed': 
      case 'posted': return 'bg-green-900 text-green-300 border-green-700'
      case 'processing':
      case 'scheduled': return 'bg-yellow-900 text-yellow-300 border-yellow-700'
      case 'draft': return 'bg-gray-700 text-gray-300 border-gray-600'
      case 'failed': return 'bg-red-900 text-red-300 border-red-700'
      default: return 'bg-gray-700 text-gray-300 border-gray-600'
    }
  }, [])

  const stats = dashboardData?.stats || {
    totalCreations: 0,
    totalPosts: 0,
    totalViews: 0,
    totalEngagement: 0
  }

  const recentCreations = dashboardData?.recentCreations || []
  const usage = {
    images: { used: 0, limit: 10, ...dashboardData?.usage?.images }, 
    videos: { used: 0, limit: 3, ...dashboardData?.usage?.videos }, 
    posts: { used: 0, limit: 20, ...dashboardData?.usage?.posts }
  }

  const goTo = (path) => navigate(path)

  // Loading state
  if (loading) {
    return (
      <div className='h-full flex items-center justify-center bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4'></div>
          <p className='text-gray-400'>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='h-full flex items-center justify-center bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A]'>
        <div className='text-center p-6 bg-[#1A1A1A] border border-red-500 rounded-xl'>
          <p className='text-red-400 mb-4'>⚠ {error}</p>
          <button 
            onClick={() => getDashboardData()}
            className='bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFA500] transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const openCreation = (creation) => {
    if (creation.type === 'image') return goTo('/ai/generate-image')
    if (creation.type === 'video') return goTo('/ai/generate-videos')
    return
  }

  return (
    <div className='h-full overflow-y-auto p-6 bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] relative'>
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className='mb-8 relative'>
        <h1 className='text-3xl font-bold text-[#FFD700] mb-2'>Dashboard</h1>
        <p className='text-gray-400'>Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Here&apos;s your content overview</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative'>
        <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#FFD700] transition-colors'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-gray-400 text-sm mb-1'>Total Creations</p>
              <h2 className='text-2xl font-bold text-[#FFD700]'>{stats.totalCreations}</h2>
              <p className='text-green-400 text-xs mt-1'>+12% this week</p>
            </div>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center'>
              <Sparkles className='w-6 h-6 text-[#0F0F0F]' />
            </div>
          </div>
        </div>

        <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#FFD700] transition-colors'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-gray-400 text-sm mb-1'>Total Posts</p>
              <h2 className='text-2xl font-bold text-[#FFD700]'>{stats.totalPosts}</h2>
              <p className='text-green-400 text-xs mt-1'>+28% vs last month</p>
            </div>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center'>
              <TrendingUp className='w-6 h-6 text-[#0F0F0F]' />
            </div>
          </div>
        </div>

        <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#FFD700] transition-colors'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-gray-400 text-sm mb-1'>Total Views</p>
              <h2 className='text-2xl font-bold text-[#FFD700]'>{stats.totalViews?.toLocaleString() || '0'}</h2>
              <p className='text-blue-400 text-xs mt-1'>+25% growth</p>
            </div>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center'>
              <Calendar className='w-6 h-6 text-[#0F0F0F]' />
            </div>
          </div>
        </div>

        <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#FFD700] transition-colors'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-gray-400 text-sm mb-1'>Engagement</p>
              <h2 className='text-2xl font-bold text-[#FFD700]'>{stats.totalEngagement?.toLocaleString() || '0'}</h2>
              <p className='text-green-400 text-xs mt-1'>+2.1% improvement</p>
            </div>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center'>
              <BarChart3 className='w-6 h-6 text-[#0F0F0F]' />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Progress */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative'>
        <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-lg font-semibold text-[#FFD700]'>Image Generation</h3>
            <span className='text-sm text-gray-400'>{usage.images.used}/{usage.images.limit}</span>
          </div>
          <div className='w-full bg-[#2A2A2A] rounded-full h-3 mb-2'>
            <div 
              className='bg-gradient-to-r from-[#FFD700] to-[#FFA500] h-3 rounded-full transition-all duration-500'
              style={{ width: `${Math.min((usage.images.used / usage.images.limit) * 100, 100)}%` }}
            ></div>
          </div>
          <p className='text-xs text-gray-400'>{usage.images.limit - usage.images.used} remaining</p>
        </div>

        <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-lg font-semibold text-[#FFD700]'>Video Generation</h3>
            <span className='text-sm text-gray-400'>{usage.videos.used}/{usage.videos.limit}</span>
          </div>
          <div className='w-full bg-[#2A2A2A] rounded-full h-3 mb-2'>
            <div 
              className='bg-gradient-to-r from-[#FFD700] to-[#FFA500] h-3 rounded-full transition-all duration-500'
              style={{ width: `${Math.min((usage.videos.used / usage.videos.limit) * 100, 100)}%` }}
            ></div>
          </div>
          <p className='text-xs text-gray-400'>{usage.videos.limit - usage.videos.used} remaining</p>
        </div>

        <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-lg font-semibold text-[#FFD700]'>Post Publishing</h3>
            <span className='text-sm text-gray-400'>{usage.posts.used}/{usage.posts.limit}</span>
          </div>
          <div className='w-full bg-[#2A2A2A] rounded-full h-3 mb-2'>
            <div 
              className='bg-gradient-to-r from-[#FFD700] to-[#FFA500] h-3 rounded-full transition-all duration-500'
              style={{ width: `${Math.min((usage.posts.used / usage.posts.limit) * 100, 100)}%` }}
            ></div>
          </div>
          <p className='text-xs text-gray-400'>{usage.posts.limit - usage.posts.used} remaining</p>
        </div>
      </div>

      {/* Recent Creations */}
      <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 relative'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-semibold text-[#FFD700]'>Recent Creations</h3>
          <button
            className='text-[#FFD700] hover:text-[#FFA500] text-sm font-medium transition-colors'
            onClick={() => goTo('/ai/generate-image')}
          >
            View All
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='flex items-center gap-4 p-4 bg-[#2A2A2A] rounded-lg border border-[#333333] animate-pulse'>
                <div className='w-16 h-16 rounded-lg bg-[#3A3A3A]' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-48 bg-[#3A3A3A] rounded'/>
                  <div className='h-3 w-72 bg-[#3A3A3A] rounded'/>
                </div>
                <div className='h-6 w-20 bg-[#3A3A3A] rounded-full'/>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className='text-center py-8'>
            <p className='text-red-400 mb-2'>Failed to load dashboard data</p>
            <p className='text-gray-500 text-sm mb-4'>{error}</p>
            <button 
              onClick={getDashboardData}
              className='text-[#FFD700] hover:text-[#FFA500] text-sm underline'
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && recentCreations.length === 0 && (
          <div className='text-center py-8'>
            <p className='text-gray-400 mb-4'>No creations yet. Start by generating content!</p>
            <button
              onClick={() => goTo('/ai/generate-image')}
              className='px-4 py-2 bg-[#FFD700] text-[#0F0F0F] rounded-lg hover:bg-[#FFA500] transition-colors font-medium'
            >
              Create First Image
            </button>
          </div>
        )}

        {/* List */}
        {!loading && !error && recentCreations.length > 0 && (
          <div className='space-y-4'>
            {recentCreations.map((creation) => (
              <button
                key={creation._id || creation.id}
                className='w-full text-left flex items-center gap-4 p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors cursor-pointer border border-[#333333] hover:border-[#FFD700]'
                onClick={() => openCreation(creation)}
              >
                <div className='relative'>
                  <img
                    src={creation.thumbnailUrl || creation.thumbnail || FALLBACK_THUMB}
                    alt={creation.title}
                    className='w-16 h-16 rounded-lg object-cover border border-[#333333]'
                    onError={(e) => { e.currentTarget.src = FALLBACK_THUMB }}
                  />
                  <div className='absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center'>
                    {creation.type === 'image'
                      ? <Image className='w-3 h-3 text-[#0F0F0F]' />
                      : <Video className='w-3 h-3 text-[#0F0F0F]' />}
                  </div>
                </div>

                <div className='flex-1'>
                  <h4 className='font-medium text-white mb-1'>{creation.title}</h4>
                  <p className='text-gray-400 text-sm mb-2'>{creation.description || creation.prompt}</p>
                  <div className='flex items-center gap-4 text-xs'>
                    <span className='text-gray-500'>{new Date(creation.createdAt).toLocaleDateString()}</span>
                    {creation.platform && (
                      <>
                        <span className='text-gray-500'>•</span>
                        <span className='text-gray-400'>{creation.platform}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(creation.status)}`}>
                    {(creation.status || 'draft').charAt(0).toUpperCase() + (creation.status || 'draft').slice(1)}
                  </span>
                  <span className='p-2 text-gray-400 hover:text-[#FFD700] transition-colors'>
                    <Share2 className='w-4 h-4' />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className='mt-8 pt-6 border-t border-[#333333]'>
          <h4 className='text-lg font-medium text-[#FFD700] mb-4'>Quick Actions</h4>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <button
              className='p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors border border-[#333333] hover:border-[#FFD700] flex flex-col items-center gap-2 group'
              onClick={() => goTo('/ai/generate-image')}
            >
              <Image className='w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform' />
              <span className='text-sm font-medium text-gray-300 group-hover:text-[#FFD700]'>New Image</span>
            </button>

            <button
              className='p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors border border-[#333333] hover:border-[#FFD700] flex flex-col items-center gap-2 group'
              onClick={() => goTo('/ai/generate-videos')}
            >
              <Video className='w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform' />
              <span className='text-sm font-medium text-gray-300 group-hover:text-[#FFD700]'>New Video</span>
            </button>

            <button
              className='p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors border border-[#333333] hover:border-[#FFD700] flex flex-col items-center gap-2 group'
              onClick={() => goTo('/ai/post-insta')}
            >
              <Share2 className='w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform' />
              <span className='text-sm font-medium text-gray-300 group-hover:text-[#FFD700]'>Post to Instagram</span>
            </button>

            <button
              className='p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors border border-[#333333] hover:border-[#FFD700] flex flex-col items-center gap-2 group'
              onClick={() => goTo('/ai/post-x')}
            >
              <Share2 className='w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform' />
              <span className='text-sm font-medium text-gray-300 group-hover:text-[#FFD700]'>Post to X</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard