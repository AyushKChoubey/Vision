import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, Calendar, BarChart3, Image, Video, Share2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import apiService from '../services/api.js'

const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=100'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null) // null => loading, object => loaded
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  const getDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.users.getDashboard()
      
      if (response.status === 'success') {
        setDashboardData(response.data)
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Dashboard error:', error)
      setError(error.message)
      // Fallback to mock data on error
      setDashboardData({
        stats: { totalCreations: 0, totalPosts: 0, totalViews: 0, totalEngagement: 0 },
        recentCreations: [],
        recentPosts: [],
        usage: { images: { used: 0, limit: 10 }, videos: { used: 0, limit: 3 }, posts: { used: 0, limit: 20 } }
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
      case 'posted': return 'bg-green-900 text-green-300 border-green-700'
      case 'scheduled': return 'bg-yellow-900 text-yellow-300 border-yellow-700'
      case 'draft': return 'bg-gray-700 text-gray-300 border-gray-600'
      default: return 'bg-gray-700 text-gray-300 border-gray-600'
    }
  }, [])

  const goTo = (path) => navigate(path)

  const openCreation = (c) => {
    if (c.type === 'image') return goTo('/ai/generate-image')
    if (c.type === 'video') return goTo('/ai/generate-videos')
    return
  }

  if (loading) {
    return (
      <div className='h-full overflow-y-auto p-6 bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] relative'>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || { totalCreations: 0, totalPosts: 0, totalViews: 0, totalEngagement: 0 }
  const recentCreations = dashboardData?.recentCreations || []
  const usage = dashboardData?.usage || { images: { used: 0, limit: 10 }, videos: { used: 0, limit: 3 }, posts: { used: 0, limit: 20 } }

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
        <p className='text-gray-400'>Welcome back! Here&apos;s your content overview</p>
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
            {[...Array(4)].map((_, i) => (
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
            <p className='text-red-400 mb-2'>Failed to load creations</p>
            <button 
              onClick={getDashboardData}
              className='text-[#FFD700] hover:text-[#FFA500] text-sm underline'
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && recentCreations?.length === 0 && (
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
        {!loading && !error && recentCreations && recentCreations.length > 0 && (
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
              <Calendar className='w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform' />
              <span className='text-sm font-medium text-gray-300 group-hover:text-[#FFD700]'>Schedule</span>
            </button>

            <button
              className='p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors border border-[#333333] hover:border-[#FFD700] flex flex-col items-center gap-2 group'
              onClick={() => goTo('/ai/post-x')}
            >
              <BarChart3 className='w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform' />
              <span className='text-sm font-medium text-gray-300 group-hover:text-[#FFD700]'>Analytics</span>
            </button>
          </div>
        </div>
      </div>
       <style>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #1A1A1A;
        }
        div::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 6px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #FFA500;
        }
      `}</style>
    </div>
  )
}

export default Dashboard
