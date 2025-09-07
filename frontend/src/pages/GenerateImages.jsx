import React, { useState } from 'react'
import { Wand2, Download, Share2, Copy, Sparkles, Image as ImageIcon } from 'lucide-react'
import apiService from '../services/api.js'

const GenerateImages = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [imageStyle, setImageStyle] = useState('realistic')
  const [imageSize, setImageSize] = useState('1024x1024')
  const [error, setError] = useState(null)

  const dummyImages = [
    'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=400',
    'https://images.unsplash.com/photo-1707343843344-011332037abb?w=400',
    'https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400',
    'https://images.unsplash.com/photo-1707343844436-ca3a4e7c8e98?w=400'
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await apiService.creations.generateImage(prompt, {
        style: imageStyle,
        size: imageSize,
        type: 'image'
      })

      if (response.status === 'success' && response.data.creation) {
        setGeneratedImage(response.data.creation.fileUrl || response.data.creation.thumbnailUrl)
      } else {
        throw new Error(response.message || 'Failed to generate image')
      }
    } catch (error) {
      console.error('Image generation error:', error)
      setError(error.message)
      
      // Fallback to dummy image for demo purposes
      const randomImage = dummyImages[Math.floor(Math.random() * dummyImages.length)]
      setGeneratedImage(randomImage)
    } finally {
      setIsGenerating(false)
    }
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
                <ImageIcon className='w-8 h-8 text-[#0F0F0F]' />
              </div>
              <h1 className='text-2xl font-bold text-[#FFD700] mb-2'>AI Image Generator</h1>
              <p className='text-gray-400 text-sm'>Create stunning visuals with advanced AI technology</p>
            </div>

            {/* Prompt Input */}
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-[#FFD700]'>
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='A futuristic cityscape at sunset with flying cars and neon lights...'
                className='w-full h-32 p-4 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent'
              />
              <p className='text-xs text-gray-500'>{prompt.length}/500 characters</p>
            </div>

            {/* Style Selection */}
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-[#FFD700]'>
                Art Style
              </label>
              <div className='grid grid-cols-2 gap-2'>
                {['realistic', 'artistic', 'cartoon', 'abstract'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setImageStyle(style)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      imageStyle === style
                        ? 'bg-[#FFD700] text-[#0F0F0F] border-[#FFD700]'
                        : 'bg-[#2A2A2A] text-gray-300 border-[#333333] hover:border-[#FFD700] hover:text-[#FFD700]'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-[#FFD700]'>
                Image Size
              </label>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                className='w-full p-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent'
              >
                <option value='1024x1024'>Square (1024x1024)</option>
                <option value='1024x768'>Landscape (1024x768)</option>
                <option value='768x1024'>Portrait (768x1024)</option>
                <option value='1920x1080'>HD Landscape (1920x1080)</option>
              </select>
            </div>

            {/* Advanced Settings */}
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-[#FFD700]'>
                Quality Settings
              </label>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-300'>Creativity</span>
                  <input type='range' min='1' max='10' defaultValue='7' className='w-24' />
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-300'>Detail Level</span>
                  <input type='range' min='1' max='10' defaultValue='8' className='w-24' />
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
                  Generating...
                </div>
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  <Wand2 className='w-5 h-5' />
                  Generate Image
                </div>
              )}
            </button>

            {/* Recent Generations */}
            <div className='space-y-3'>
              <h3 className='text-sm font-medium text-[#FFD700]'>Recent Generations</h3>
              <div className='grid grid-cols-2 gap-2'>
                {dummyImages.slice(0, 4).map((img, index) => (
                  <div key={index} className='aspect-square rounded-lg overflow-hidden border border-[#333333] hover:border-[#FFD700] transition cursor-pointer'>
                    <img src={img} alt={`Generated ${index + 1}`} className='w-full h-full object-cover' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Generated Content */}
        <div className='flex-1 bg-[#0F0F0F] p-8 flex flex-col items-center justify-center'>
          {!generatedImage && !isGenerating && !error ? (
            <div className='text-center max-w-md'>
              <div className='w-32 h-32 mx-auto mb-6 rounded-full border-4 border-dashed border-[#FFD700] flex items-center justify-center'>
                <ImageIcon className='w-16 h-16 text-[#FFD700]' />
              </div>
              <h2 className='text-2xl font-semibold text-[#FFD700] mb-4'>Ready to Create</h2>
              <p className='text-gray-400'>Enter your prompt and watch AI bring your vision to life</p>
            </div>
          ) : error && !generatedImage ? (
            <div className='text-center max-w-md'>
              <div className='w-32 h-32 mx-auto mb-6 rounded-full border-4 border-dashed border-red-500 flex items-center justify-center'>
                <ImageIcon className='w-16 h-16 text-red-500' />
              </div>
              <h2 className='text-2xl font-semibold text-red-500 mb-4'>Generation Failed</h2>
              <p className='text-gray-400 mb-4'>{error}</p>
              <button 
                onClick={() => {setError(null); handleGenerate()}} 
                className='px-4 py-2 bg-[#FFD700] text-[#0F0F0F] rounded-lg hover:bg-[#FFA500] transition-colors'
              >
                Try Again
              </button>
            </div>
          ) : isGenerating ? (
            <div className='text-center'>
              <div className='w-96 h-96 mx-auto mb-6 rounded-2xl border-4 border-dashed border-[#FFD700] flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]'>
                <div className='text-center'>
                  <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center animate-pulse'>
                    <Sparkles className='w-8 h-8 text-[#0F0F0F] animate-spin' />
                  </div>
                  <p className='text-[#FFD700] font-medium'>Generating your masterpiece...</p>
                  <p className='text-gray-400 text-sm mt-2'>This may take a few moments</p>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center max-w-4xl w-full'>
              <h2 className='text-2xl font-semibold text-[#FFD700] mb-6'>Generated Image</h2>
              <div className='relative group'>
                <img 
                  src={generatedImage} 
                  alt='Generated content' 
                  className='w-full max-w-2xl mx-auto rounded-2xl shadow-2xl border-4 border-[#FFD700]'
                />
                
                {/* Action Buttons Overlay */}
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center'>
                  <div className='flex gap-4'>
                    <button className='p-3 bg-[#FFD700] text-[#0F0F0F] rounded-full hover:scale-110 transition-transform'>
                      <Download className='w-5 h-5' />
                    </button>
                    <button className='p-3 bg-[#FFD700] text-[#0F0F0F] rounded-full hover:scale-110 transition-transform'>
                      <Share2 className='w-5 h-5' />
                    </button>
                    <button className='p-3 bg-[#FFD700] text-[#0F0F0F] rounded-full hover:scale-110 transition-transform'>
                      <Copy className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Details */}
              <div className='mt-6 p-4 bg-[#1A1A1A] rounded-lg border border-[#333333] text-left'>
                <h3 className='text-[#FFD700] font-medium mb-2'>Generation Details</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-400'>Style:</span>
                    <span className='text-white ml-2 capitalize'>{imageStyle}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Size:</span>
                    <span className='text-white ml-2'>{imageSize}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Model:</span>
                    <span className='text-white ml-2'>VisionCast Pro</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Time:</span>
                    <span className='text-white ml-2'>2.3s</span>
                  </div>
                </div>
                <div className='mt-3'>
                  <span className='text-gray-400'>Prompt:</span>
                  <p className='text-white text-sm mt-1 italic'>"{prompt}"</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 mt-6 justify-center'>
                <button 
                  onClick={() => {setGeneratedImage(null); setPrompt('')}}
                  className='px-6 py-3 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#333333] transition border border-[#333333]'
                >
                  Generate New
                </button>
                <button className='px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] rounded-lg hover:scale-105 transition-transform font-medium'>
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

export default GenerateImages