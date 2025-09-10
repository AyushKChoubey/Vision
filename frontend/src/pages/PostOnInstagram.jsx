import React, { useMemo, useState, useEffect } from 'react'
import { Instagram, Facebook, Calendar, Clock, Image, Video, Hash, Send, Eye, CheckCircle2 } from 'lucide-react'
import apiService from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const Pill = ({ children }) => (
  <span className="text-xs px-2 py-0.5 rounded-full bg-[#2A2A2A] border border-[#333333] text-gray-300">{children}</span>
)

const PostOnMetaSuite = () => {
  const { user } = useAuth()
  
  // Media state
  const [media, setMedia] = useState([])
  const [loadingMedia, setLoadingMedia] = useState(true)
  const [mediaError, setMediaError] = useState(null)

  // target toggles
  const [postToFacebook, setPostToFacebook] = useState(true)
  const [postToInstagram, setPostToInstagram] = useState(true)

  // account IDs
  const [facebookPageId, setFacebookPageId] = useState('')
  const [instagramBizId, setInstagramBizId] = useState('')

  // shared composer state
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [scheduledTime, setScheduledTime] = useState('')

  // ui
  const [isPosting, setIsPosting] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const mediaType = selectedMedia?.type || null

  // Load user's creations
  useEffect(() => {
    const loadCreations = async () => {
      try {
        setLoadingMedia(true)
        setMediaError(null)
        
        const response = await apiService.users.getCreations({ 
          status: 'completed',
          limit: 20
        })
        
        if (response.status === 'success') {
          setMedia(response.data.creations || [])
        } else {
          throw new Error(response.message || 'Failed to load creations')
        }
      } catch (error) {
        console.error('Failed to load creations:', error)
        setMediaError(error.message)
        
        // Fallback to dummy data for demo
        setMedia([
          { _id: 1, type: 'image', fileUrl: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=800', title: 'AI Cityscape', thumbnailUrl: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=200' },
          { _id: 2, type: 'image', fileUrl: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=800', title: 'Abstract Art', thumbnailUrl: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=200' },
          { _id: 3, type: 'video', fileUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', title: 'Motion Graphics', thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200' },
          { _id: 4, type: 'image', fileUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', title: 'Product Shot', thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200' },
        ])
      } finally {
        setLoadingMedia(false)
      }
    }

    if (user) {
      loadCreations()
    }
  }, [user])

  const canPost = useMemo(() => {
    const hasTargets = postToFacebook || postToInstagram
    return hasTargets && !!selectedMedia && caption.trim().length > 0 && !isPosting
  }, [postToFacebook, postToInstagram, selectedMedia, caption, isPosting])

  const handlePost = async () => {
    if (!canPost) return
    setIsPosting(true)

    try {
      // Create post through API
      const postData = {
        content: caption,
        hashtags: hashtags.split(' ').filter(tag => tag.trim()),
        creationId: selectedMedia._id,
        platforms: [
          ...(postToInstagram ? ['instagram'] : []),
          ...(postToFacebook ? ['facebook'] : [])
        ],
        scheduledAt: scheduledTime ? new Date(scheduledTime).toISOString() : null,
      }

      const response = await apiService.posts.create(postData)
      
      if (response.status === 'success') {
        alert(`${scheduledTime ? 'Scheduled' : 'Posted'} successfully!`)
        // Reset form
        setCaption('')
        setHashtags('')
        setSelectedMedia(null)
        setScheduledTime('')
      } else {
        throw new Error(response.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Post creation error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] text-white relative">
      {/* animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex h-full relative">
        {/* LEFT: Composer */}
        <div className="w-full lg:w-[28rem] bg-[#1A1A1A] border-r border-[#333333] p-6 overflow-y-auto">
          {/* header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1877F2] to-[#0e56bf] flex items-center justify-center">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E1306C] to-[#833AB4] flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#FFD700]">Meta Composer</h1>
            <p className="text-gray-400 text-sm">Create, schedule & preview for Facebook and Instagram</p>
          </div>

          {/* targets */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setPostToFacebook(v => !v)}
              className={`p-3 rounded-lg border transition-colors flex items-center justify-between ${
                postToFacebook ? 'border-[#FFD700] bg-[#2A2A2A]' : 'border-[#333333] bg-[#1A1A1A] hover:border-[#FFD700]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-[#1877F2]" />
                Facebook
              </span>
              {postToFacebook && <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />}
            </button>

            <button
              onClick={() => setPostToInstagram(v => !v)}
              className={`p-3 rounded-lg border transition-colors flex items-center justify-between ${
                postToInstagram ? 'border-[#FFD700] bg-[#2A2A2A]' : 'border-[#333333] bg-[#1A1A1A] hover:border-[#FFD700]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#E1306C]" />
                Instagram
              </span>
              {postToInstagram && <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />}
            </button>
          </div>

          {/* IDs */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[#FFD700] text-sm mb-1">Facebook Page ID</label>
              <input
                value={facebookPageId}
                onChange={e => setFacebookPageId(e.target.value)}
                placeholder="e.g. 123456789012345"
                className="w-full p-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Pill>Required for FB</Pill>
                <span>Connect your Page via Graph API in real app</span>
              </div>
            </div>

            <div>
              <label className="block text-[#FFD700] text-sm mb-1">Instagram Business Account ID</label>
              <input
                value={instagramBizId}
                onChange={e => setInstagramBizId(e.target.value)}
                placeholder="e.g. 1789xxxxxxxxx"
                className="w-full p-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Pill>Required for IG</Pill>
                <span>Use IG Content Publishing endpoints</span>
              </div>
            </div>
          </div>

          {/* media picker */}
          <div className="space-y-3 mb-6">
            <label className="block text-[#FFD700] font-medium">Select Media</label>
            
            {loadingMedia ? (
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-[#2A2A2A] animate-pulse"></div>
                ))}
              </div>
            ) : mediaError ? (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{mediaError}</p>
              </div>
            ) : media.length === 0 ? (
              <div className="p-4 bg-[#2A2A2A] border border-[#333333] rounded-lg text-center">
                <p className="text-gray-400 mb-2">No media found</p>
                <p className="text-gray-500 text-sm">Create some images or videos first</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {media.map(m => (
                  <button
                    key={m._id || m.id}
                    type="button"
                    onClick={() => setSelectedMedia(m)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedMedia?._id === m._id || selectedMedia?.id === m.id
                        ? 'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                        : 'border-[#333333] hover:border-[#FFD700]'
                    }`}
                  >
                    <img 
                      src={m.thumbnailUrl || m.fileUrl || m.url} 
                      alt={m.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 right-2 bg-black/50 p-1 rounded">
                      {m.type === 'image' ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs p-2">
                      {m.title}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {selectedMedia && (
              <div className="text-xs text-gray-400">
                Selected: <span className="text-gray-300">{selectedMedia.title}</span> <Pill>{selectedMedia.type}</Pill>
              </div>
            )}
          </div>

          {/* caption */}
          <div className="space-y-3 mb-6">
            <label className="block text-[#FFD700] font-medium">Caption</label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write your caption…"
              className="w-full h-28 p-4 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{caption.length}/2200</span>
              <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> use keywords for reach</span>
            </div>
          </div>

          {/* hashtags */}
          <div className="space-y-3 mb-6">
            <label className="block text-[#FFD700] font-medium flex items-center gap-2">
              <Hash className="w-4 h-4" /> Hashtags
            </label>
            <input
              value={hashtags}
              onChange={e => setHashtags(e.target.value)}
              placeholder="#marketing #ai #socialmedia"
              className="w-full p-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
            />
          </div>

          {/* schedule */}
          <div className="space-y-3 mb-6">
            <label className="block text-[#FFD700] font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" /> Schedule (optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              className="w-full p-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
            />
            <p className="text-xs text-gray-500">Leave blank to publish immediately</p>
          </div>

          {/* actions */}
          <div className="space-y-3">
            <button
              onClick={() => setShowPreview(v => !v)}
              className="w-full py-3 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#333333] transition border border-[#333333] hover:border-[#FFD700] flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> {showPreview ? 'Hide' : 'Show'} Preview
            </button>

            {/* CENTERED BUTTON */}
            <button
              onClick={handlePost}
              disabled={!canPost}
              className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-300 flex items-center justify-center ${
                isPosting
                  ? 'bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white opacity-75 cursor-not-allowed'
                  : canPost
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,215,0,0.3)]'
                  : 'bg-[#2A2A2A] text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPosting ? (
                <span className="flex items-center justify-center">Working…</span>
              ) : scheduledTime ? (
                <span className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" /> Schedule
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" /> Post Now
                </span>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Dual Preview */}
        <div className="flex-1 p-6 lg:p-8">
          {showPreview ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Facebook preview */}
              <div className="max-w-md w-full mx-auto">
                <div className="mb-3 flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                  <h3 className="text-lg font-semibold text-white">Facebook Preview</h3>
                </div>
                <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl overflow-hidden shadow-2xl">
                  {/* header */}
                  <div className="flex items-center gap-3 p-4 border-b border-[#333333]">
                    <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/40"></div>
                    <div className="flex-1">
                      <div className="font-medium">Your Page</div>
                      <div className="text-xs text-gray-400">{facebookPageId || 'Page ID not set'}</div>
                    </div>
                    <div className="text-xs text-gray-400">{scheduledTime ? 'Scheduled' : 'Publish now'}</div>
                  </div>

                  {/* media */}
                  <div className="relative bg-black">
                    {selectedMedia ? (
                      <>
                        <img 
                          src={selectedMedia.fileUrl || selectedMedia.thumbnailUrl || selectedMedia.url} 
                          alt="Media" 
                          className="w-full object-cover max-h-[420px]" 
                        />
                        {mediaType === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                              <Video className="w-6 h-6 text-white ml-0.5" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="aspect-video flex items-center justify-center text-gray-500">Select media…</div>
                    )}
                  </div>

                  {/* body */}
                  <div className="p-4 space-y-2">
                    <p className="text-white whitespace-pre-wrap">{caption || 'Your caption will appear here…'}</p>
                    {hashtags && (
                      <p className="text-[#FFD700]">
                        {hashtags.split(' ').filter(Boolean).map((t, i) => <span key={i} className="mr-1">{t.startsWith('#') ? t : `#${t}`}</span>)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Instagram preview */}
              <div className="max-w-md w-full mx-auto">
                <div className="mb-3 flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-[#E1306C]" />
                  <h3 className="text-lg font-semibold text-white">Instagram Preview</h3>
                </div>
                <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl overflow-hidden shadow-2xl">
                  {/* header */}
                  <div className="flex items-center gap-3 p-4 border-b border-[#333333]">
                    <div className="w-10 h-10 rounded-full border-2 border-[#FFD700]"></div>
                    <div className="flex-1">
                      <div className="font-medium">visioncast_ai</div>
                      <div className="text-xs text-gray-400">{instagramBizId || 'IG Business ID not set'}</div>
                    </div>
                    <div className="text-xs text-gray-400">{scheduledTime ? 'Scheduled' : 'Publish now'}</div>
                  </div>

                  {/* square media */}
                  <div className="relative aspect-square bg-black">
                    {selectedMedia ? (
                      <>
                        <img 
                          src={selectedMedia.fileUrl || selectedMedia.thumbnailUrl || selectedMedia.url} 
                          alt="Media" 
                          className="w-full h-full object-cover" 
                        />
                        {mediaType === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                              <Video className="w-6 h-6 text-white ml-0.5" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">Select media…</div>
                    )}
                  </div>

                  {/* body */}
                  <div className="p-4 space-y-2">
                    <p className="text-white whitespace-pre-wrap">{caption || 'Your caption will appear here…'}</p>
                    {hashtags && (
                      <p className="text-[#FFD700]">
                        {hashtags.split(' ').filter(Boolean).map((t, i) => <span key={i} className="mr-1 hover:underline cursor-pointer">{t.startsWith('#') ? t : `#${t}`}</span>)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500">Preview hidden</div>
          )}
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

export default PostOnMetaSuite
