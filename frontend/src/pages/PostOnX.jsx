import React, { useState } from 'react'
import { Twitter, Calendar, Clock, Image, Video, Hash, AtSign, Send, Eye, BarChart3 } from 'lucide-react'

const PostOnX = () => {
  const [tweetContent, setTweetContent] = useState('')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [scheduledTime, setScheduledTime] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [threadMode, setThreadMode] = useState(false)
  const [tweets, setTweets] = useState([''])

  const dummyMediaOptions = [
    { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=400', title: 'AI Tech Visual' },
    { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400', title: 'Modern Design' },
    { id: 3, type: 'video', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', title: 'Dynamic Content' },
    { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400', title: 'Brand Asset' }
  ]

  const handlePost = () => {
    setIsPosting(true)
    setTimeout(() => {
      setIsPosting(false)
      alert('Posted successfully to X!')
    }, 2000)
  }

  const addTweet = () => {
    setTweets([...tweets, ''])
  }

  const updateTweet = (index, content) => {
    const newTweets = [...tweets]
    newTweets[index] = content
    setTweets(newTweets)
  }

  return (
    <div className='h-full overflow-y-auto bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] text-white relative'>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className='flex h-full'>
        {/* Left Panel - Tweet Creation */}
        <div className='w-96 bg-[#1A1A1A] border-r border-[#333333] p-6 overflow-y-auto relative z-10'>
          {/* Header */}
          <div className='text-center mb-6'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#1DA1F2] to-[#0D1117] flex items-center justify-center'>
              <Twitter className='w-8 h-8 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-[#FFD700] mb-2'>Post to X</h1>
            <p className='text-gray-400 text-sm'>Create and schedule your X (Twitter) content</p>
          </div>

          {/* Thread Toggle */}
          <div className='mb-6'>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => setThreadMode(!threadMode)}
                className={`p-2 rounded-lg border transition-all ${
                  threadMode 
                    ? 'bg-[#FFD700] text-[#0F0F0F] border-[#FFD700]' 
                    : 'bg-[#2A2A2A] text-gray-300 border-[#333333] hover:border-[#FFD700]'
                }`}
              >
                Thread Mode
              </button>
              <span className='text-gray-400 text-sm'>Create multiple connected tweets</span>
            </div>
          </div>

          {/* Tweet Content */}
          <div className='space-y-4 mb-6'>
            <label className='block text-[#FFD700] font-medium'>
              {threadMode ? 'Thread Content' : 'Tweet Content'}
            </label>
            
            {threadMode ? (
              <div className='space-y-3'>
                {tweets.map((tweet, index) => (
                  <div key={index} className='relative'>
                    <textarea
                      value={tweet}
                      onChange={(e) => updateTweet(index, e.target.value)}
                      placeholder={`Tweet ${index + 1} content...`}
                      className='w-full h-24 p-4 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent'
                    />
                    <div className='absolute bottom-2 right-2 text-xs text-gray-500'>
                      {tweet.length}/280
                    </div>
                  </div>
                ))}
                <button
                  onClick={addTweet}
                  className='w-full py-2 border-2 border-dashed border-[#333333] rounded-lg text-gray-400 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors'
                >
                  + Add Tweet
                </button>
              </div>
            ) : (
              <div className='relative'>
                <textarea
                  value={tweetContent}
                  onChange={(e) => setTweetContent(e.target.value)}
                  placeholder='What\s happening'
                  className='w-full h-32 p-4 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent'
                />
                <div className='absolute bottom-2 right-2 text-xs text-gray-500'>
                  {tweetContent.length}/280
                </div>
              </div>
            )}
          </div>

          {/* Media Selection */}
          <div className='space-y-4 mb-6'>
            <h3 className='text-[#FFD700] font-medium'>Attach Media (Optional)</h3>
            <div className='grid grid-cols-2 gap-3'>
              {dummyMediaOptions.map((media) => (
                <div
                  key={media.id}
                  onClick={() => setSelectedMedia(selectedMedia?.id === media.id ? null : media)}
                  className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedMedia?.id === media.id 
                      ? 'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                      : 'border-[#333333] hover:border-[#FFD700]'
                  }`}
                >
                  <img src={media.url} alt={media.title} className='w-full h-full object-cover' />
                  <div className='absolute top-2 right-2'>
                    {media.type === 'image' ? 
                      <Image className='w-4 h-4 text-white' /> : 
                      <Video className='w-4 h-4 text-white' />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling */}
          <div className='space-y-3 mb-6'>
            <label className='block text-[#FFD700] font-medium flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              Schedule Tweet
            </label>
            <input
              type='datetime-local'
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className='w-full p-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent'
            />
          </div>

          {/* Tweet Settings */}
          <div className='space-y-4 mb-6'>
            <h3 className='text-[#FFD700] font-medium'>Tweet Settings</h3>
            <div className='space-y-3'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-[#FFD700] bg-[#2A2A2A] border-[#333333] rounded focus:ring-[#FFD700]' />
                <span className='text-gray-300 text-sm'>Allow replies</span>
              </label>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-[#FFD700] bg-[#2A2A2A] border-[#333333] rounded focus:ring-[#FFD700]' />
                <span className='text-gray-300 text-sm'>Enable retweets</span>
              </label>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-[#FFD700] bg-[#2A2A2A] border-[#333333] rounded focus:ring-[#FFD700]' />
                <span className='text-gray-300 text-sm'>Show engagement metrics</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3'>
            <button
              onClick={handlePost}
              disabled={(!tweetContent.trim() && tweets.every(t => !t.trim())) || isPosting}
              className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-300 ${
                isPosting
                  ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0D1117] text-white opacity-75 cursor-not-allowed'
                  : (tweetContent.trim() || tweets.some(t => t.trim()))
                  ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0D1117] text-white hover:scale-105 hover:shadow-[0_8px_30px_rgba(29,161,242,0.3)]'
                  : 'bg-[#2A2A2A] text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPosting ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Posting...
                </div>
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  <Send className='w-5 h-5' />
                  {scheduledTime ? 'Schedule Tweet' : (threadMode ? 'Post Thread' : 'Post Tweet')}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className='flex-1 bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] p-8 flex items-center justify-center relative z-10'>
          {!tweetContent.trim() && tweets.every(t => !t.trim()) ? (
            <div className='text-center max-w-md'>
              <div className='w-32 h-32 mx-auto mb-6 rounded-full border-4 border-dashed border-[#FFD700] flex items-center justify-center'>
                <Twitter className='w-16 h-16 text-[#FFD700]' />
              </div>
              <h2 className='text-2xl font-semibold text-[#FFD700] mb-4'>X Post Preview</h2>
              <p className='text-gray-400'>Start typing to see your tweet preview</p>
            </div>
          ) : (
            <div className='max-w-lg w-full space-y-4'>
              {/* Tweet Preview */}
              {threadMode ? (
                tweets.map((tweet, index) => (
                  tweet.trim() && (
                    <div key={index} className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 hover:border-[#FFD700] transition-colors'>
                      {/* Tweet Header */}
                      <div className='flex items-start gap-3 mb-4'>
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop" 
                          className='w-12 h-12 rounded-full border-2 border-[#FFD700]' 
                          alt="Profile"
                        />
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <h3 className='font-bold text-white'>VisionCast AI</h3>
                            <div className='w-5 h-5 bg-[#1DA1F2] rounded-full flex items-center justify-center'>
                              <svg className='w-3 h-3 text-white' fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                            </div>
                            <span className='text-gray-400 text-sm'>@visioncast_ai</span>
                            <span className='text-gray-500 text-sm'>·</span>
                            <span className='text-gray-500 text-sm'>now</span>
                          </div>
                          <div className='flex items-center gap-1 text-xs text-gray-500 mt-1'>
                            <span>Thread {index + 1}/{tweets.filter(t => t.trim()).length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tweet Content */}
                      <p className='text-white leading-relaxed mb-4'>{tweet}</p>

                      {/* Media if attached to first tweet */}
                      {index === 0 && selectedMedia && (
                        <div className='mb-4 rounded-xl overflow-hidden border border-[#333333]'>
                          <img 
                            src={selectedMedia.url} 
                            alt={selectedMedia.title}
                            className='w-full aspect-video object-cover'
                          />
                        </div>
                      )}

                      {/* Tweet Actions */}
                      <div className='flex items-center justify-between text-gray-400 text-sm'>
                        <button className='flex items-center gap-1 hover:text-[#1DA1F2] transition'>
                          <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Reply</span>
                        </button>
                        <button className='flex items-center gap-1 hover:text-green-400 transition'>
                          <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Retweet</span>
                        </button>
                        <button className='flex items-center gap-1 hover:text-red-400 transition'>
                          <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>Like</span>
                        </button>
                        <button className='flex items-center gap-1 hover:text-[#FFD700] transition'>
                          <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  )
                ))
              ) : (
                <div className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 hover:border-[#FFD700] transition-colors'>
                  {/* Single Tweet Preview */}
                  <div className='flex items-start gap-3 mb-4'>
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop" 
                      className='w-12 h-12 rounded-full border-2 border-[#FFD700]' 
                      alt="Profile"
                    />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        <h3 className='font-bold text-white'>VisionCast AI</h3>
                        <div className='w-5 h-5 bg-[#1DA1F2] rounded-full flex items-center justify-center'>
                          <svg className='w-3 h-3 text-white' fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <span className='text-gray-400 text-sm'>@visioncast_ai</span>
                        <span className='text-gray-500 text-sm'>·</span>
                        <span className='text-gray-500 text-sm'>now</span>
                      </div>
                    </div>
                  </div>

                  <p className='text-white leading-relaxed mb-4'>
                    {tweetContent || 'Your tweet content will appear here...'}
                  </p>

                  {/* Media Preview */}
                  {selectedMedia && (
                    <div className='mb-4 rounded-xl overflow-hidden border border-[#333333]'>
                      <img 
                        src={selectedMedia.url} 
                        alt={selectedMedia.title}
                        className='w-full aspect-video object-cover'
                      />
                    </div>
                  )}

                  {/* Tweet Actions */}
                  <div className='flex items-center justify-between text-gray-400 text-sm'>
                    <button className='flex items-center gap-1 hover:text-[#1DA1F2] transition'>
                      <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>24</span>
                    </button>
                    <button className='flex items-center gap-1 hover:text-green-400 transition'>
                      <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>12</span>
                    </button>
                    <button className='flex items-center gap-1 hover:text-red-400 transition'>
                      <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>89</span>
                    </button>
                    <button className='flex items-center gap-1 hover:text-[#FFD700] transition'>
                      <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Scheduling Info */}
                  {scheduledTime && (
                    <div className='mt-4 pt-4 border-t border-[#333333] flex items-center gap-2 text-xs text-gray-500'>
                      <Calendar className='w-4 h-4' />
                      Scheduled for {new Date(scheduledTime).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Preview */}
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 mt-6'>
                <h4 className='text-[#FFD700] font-medium mb-4 flex items-center gap-2'>
                  <BarChart3 className='w-5 h-5' />
                  Estimated Performance
                </h4>
                <div className='grid grid-cols-4 gap-4 text-center text-sm'>
                  <div>
                    <p className='text-2xl font-bold text-white'>1.2K</p>
                    <p className='text-gray-400'>Views</p>
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-white'>89</p>
                    <p className='text-gray-400'>Likes</p>
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-white'>24</p>
                    <p className='text-gray-400'>Retweets</p>
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-white'>12</p>
                    <p className='text-gray-400'>Replies</p>
                  </div>
                </div>
              </div>
            </div>
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

export default PostOnX