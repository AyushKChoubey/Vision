import React, { useState } from 'react'
import { Video, Play, Pause, Download, Share2, Copy, Sparkles, Wand2, Clock, Film } from 'lucide-react'
import apiService from '../services/api.js'

const GenerateVideos = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState(null)
  const [videoStyle, setVideoStyle] = useState('cinematic')
  const [videoDuration, setVideoDuration] = useState('5')
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)

  const dummyVideoThumbnails = [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200',
    'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=200',
    'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200'
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await apiService.creations.generateVideo(prompt, {
        style: videoStyle,
        duration: videoDuration,
        type: 'video'
      })

      if (response.status === 'success' && response.data.creation) {
        setGeneratedVideo(response.data.creation.fileUrl || response.data.creation.thumbnailUrl)
      } else {
        throw new Error(response.message || 'Failed to generate video')
      }
    } catch (error) {
      console.error('Video generation error:', error)
      setError(error.message)
      
      // Fallback to dummy thumbnail for demo purposes
      const randomThumbnail = dummyVideoThumbnails[Math.floor(Math.random() * dummyVideoThumbnails.length)]
      setGeneratedVideo(randomThumbnail)
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className='h-full overflow-y-auto bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] text-white relative'>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className='flex h-full'>
        {/* Left Panel - Controls */}
        <div className='w-96 bg-[#1A1A1A] border-r border-[#333333] p-6 overflow-y-auto'>
          <div className='space-y-6'>
            {/* Header */}
            <div className='text-center'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center'>
                <Video className='w-8 h-8 text-[#0F0F0F]' />
              </div>
              <h1 className='text-2xl font-bold text-[#FFD700] mb-2'>AI Video Generator</h1>
              <p className='text-gray-400 text-sm'>Create captivating videos with cutting-edge AI</p>
            </div>

            {/* Prompt Input */}
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-[#FFD700]'>
                Describe your video scene
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='A majestic eagle soaring over mountain peaks during golden hour with dramatic clouds...'
                className='w-full h-32 p-4 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent'
              />
              <p className='text-xs text-gray-500'>{prompt.length}/500 characters</p>
            </div>

            {/* Video Style */}
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-[#FFD700]'>
                Video Style
              </label>
              <div className='grid grid-cols-2 gap-2'>
                {['cinematic', 'documentary', 'artistic', 'commercial'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setVideoStyle(style)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      videoStyle === style
                        ? 'bg-[#FFD700] text-[#0F0F0F] border-[#FFD700]'
                        : 'bg-[#2A2A2A] text-gray-300 border-[#333333] hover:border-[#FFD700] hover:text-[#FFD700]'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-[#FFD700]'>
                Duration
              </label>
              <select
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                className='w-full p-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent'
              >
                <option value='3'>3 seconds</option>
                <option value='5'>5 seconds</option>
                <option value='10'>10 seconds</option>
                <option value='15'>15 seconds</option>
                <option value='30'>30 seconds</option>
              </select>
            </div>

            {/* Quality Settings */}
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-[#FFD700]'>
                Quality Settings
              </label>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-300'>Motion Intensity</span>
                  <input type='range' min='1' max='10' defaultValue='6' className='w-24 accent-[#FFD700]' />
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-300'>Visual Quality</span>
                  <input type='range' min='1' max='10' defaultValue='9' className='w-24 accent-[#FFD700]' />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-300 ${
                isGenerating
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] opacity-75 cursor-not-allowed'
                  : prompt.trim()
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] hover:scale-105 hover:shadow-[0_8px_30px_rgb(255,215,0,0.3)]'
                  : 'bg-[#2A2A2A] text-gray-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <div className='flex items-center justify-center gap-2'>
                  <Sparkles className='w-5 h-5 animate-spin' />
                  Creating Video...
                </div>
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  <Film className='w-5 h-5' />
                  Generate Video
                </div>
              )}
            </button>

            {/* Recent Generations */}
            <div className='space-y-3'>
              <h3 className='text-sm font-medium text-[#FFD700]'>Recent Videos</h3>
              <div className='grid grid-cols-2 gap-2'>
                {dummyVideoThumbnails.map((thumbnail, index) => (
                  <div key={index} className='relative aspect-video rounded-lg overflow-hidden border border-[#333333] hover:border-[#FFD700] transition cursor-pointer group'>
                    <img src={thumbnail} alt={`Video ${index + 1}`} className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Play className='w-6 h-6 text-[#FFD700]' />
                    </div>
                    <div className='absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded'>
                      {5 + index}s
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Generated Video */}
        <div className='flex-1 bg-[#0F0F0F] p-8 flex flex-col items-center justify-center'>
          {!generatedVideo && !isGenerating ? (
            <div className='text-center max-w-md'>
              <div className='w-32 h-32 mx-auto mb-6 rounded-full border-4 border-dashed border-[#FFD700] flex items-center justify-center'>
                <Video className='w-16 h-16 text-[#FFD700]' />
              </div>
              <h2 className='text-2xl font-semibold text-[#FFD700] mb-4'>Ready to Create</h2>
              <p className='text-gray-400'>Describe your vision and let AI create stunning video content</p>
            </div>
          ) : isGenerating ? (
            <div className='text-center'>
              <div className='w-96 h-64 mx-auto mb-6 rounded-2xl border-4 border-dashed border-[#FFD700] flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent animate-pulse'></div>
                <div className='text-center relative z-10'>
                  <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center'>
                    <Sparkles className='w-8 h-8 text-[#0F0F0F] animate-spin' />
                  </div>
                  <p className='text-[#FFD700] font-medium'>Generating your video...</p>
                  <p className='text-gray-400 text-sm mt-2'>AI is processing your request</p>
                  <div className='mt-4 flex items-center justify-center gap-2 text-sm text-gray-400'>
                    <Clock className='w-4 h-4' />
                    Estimated time: {videoDuration}s
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center max-w-4xl w-full'>
              <h2 className='text-2xl font-semibold text-[#FFD700] mb-6'>Generated Video</h2>
              <div className='relative group'>
                <div className='relative w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border-4 border-[#FFD700] bg-black'>
                  <img 
                    src={generatedVideo}
                    alt='Generated video thumbnail' 
                    className='w-full h-full object-cover'
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className='absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors'>
                    <button 
                      onClick={togglePlayback}
                      className='w-20 h-20 rounded-full bg-[#FFD700] text-[#0F0F0F] flex items-center justify-center hover:scale-110 transition-transform shadow-2xl'
                    >
                      {isPlaying ? <Pause className='w-10 h-10' /> : <Play className='w-10 h-10 ml-1' />}
                    </button>
                  </div>

                  {/* Video Info Bar */}
                  <div className='absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='flex items-center gap-2 text-white text-sm'>
                      <Clock className='w-4 h-4' />
                      {videoDuration}s
                    </div>
                    <div className='flex gap-2'>
                      <button className='p-2 bg-[#FFD700] text-[#0F0F0F] rounded hover:scale-110 transition-transform'>
                        <Download className='w-4 h-4' />
                      </button>
                      <button className='p-2 bg-[#FFD700] text-[#0F0F0F] rounded hover:scale-110 transition-transform'>
                        <Share2 className='w-4 h-4' />
                      </button>
                      <button className='p-2 bg-[#FFD700] text-[#0F0F0F] rounded hover:scale-110 transition-transform'>
                        <Copy className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Details */}
              <div className='mt-6 p-6 bg-[#1A1A1A] rounded-lg border border-[#333333] text-left'>
                <h3 className='text-[#FFD700] font-medium mb-4 flex items-center gap-2'>
                  <Film className='w-5 h-5' />
                  Generation Details
                </h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-400'>Style:</span>
                    <span className='text-white ml-2 capitalize'>{videoStyle}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Duration:</span>
                    <span className='text-white ml-2'>{videoDuration} seconds</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Resolution:</span>
                    <span className='text-white ml-2'>1920x1080 HD</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Model:</span>
                    <span className='text-white ml-2'>VisionCast Video AI</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Generation Time:</span>
                    <span className='text-white ml-2'>3.7s</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>File Size:</span>
                    <span className='text-white ml-2'>2.4 MB</span>
                  </div>
                </div>
                <div className='mt-4 pt-4 border-t border-[#333333]'>
                  <span className='text-gray-400'>Prompt:</span>
                  <p className='text-white text-sm mt-1 italic'>"{prompt}"</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 mt-6 justify-center'>
                <button 
                  onClick={() => {setGeneratedVideo(null); setPrompt(''); setIsPlaying(false)}}
                  className='px-6 py-3 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#333333] transition border border-[#333333] hover:border-[#FFD700]'
                >
                  Generate New
                </button>
                <button className='px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] rounded-lg hover:scale-105 transition-transform font-medium shadow-lg'>
                  Post to Social Media
                </button>
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

export default GenerateVideos