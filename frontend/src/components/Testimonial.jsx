import React from 'react'
import { Star } from 'lucide-react'

const Testimonial = () => {
    const dummyTestimonialData = [
        {
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
            name: 'John Doe',
            title: 'Marketing Director, TechCorp',
            content: 'VisionCast has revolutionized our content workflow. The AI quality is outstanding, and it saves us hours of work every week.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
            name: 'Jane Smith',
            title: 'Content Creator, CreativeFlow',
            content: 'The AI generation quality is incredible. Our engagement rates have increased by 300% since using VisionCast.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
            name: 'Karen',
            title: 'Social Media Manager, BrandWorks',
            content: 'VisionCast automation features have transformed our social media strategy. The scheduling tools are game-changing.',
            rating: 4,
        }
      
    ]

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${
                    index < rating 
                        ? 'fill-[#FFD700] text-[#FFD700]' 
                        : 'fill-[#333333] text-[#333333]'
                }`}
            />
        ))
    }

    return (
        <div className='px-4 sm:px-20 xl:px-32 py-24 bg-[#1A1A1A]'>
            {/* Header */}
            <div className='text-center mb-16'>
                <h2 className='text-white text-[42px] font-semibold mb-4'>
                    Loved by <span className='text-[#FFD700]'>Creators</span>
                </h2>
                <p className='text-gray-400 max-w-lg mx-auto text-lg'>
                    Don't just take our word for it. Here's what our users are saying about VisionCast.
                </p>
            </div>

            {/* Testimonials Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-7xl mx-auto'>
                {dummyTestimonialData.map((testimonial, index) => (
                    <div 
                        key={index} 
                        className='p-8 rounded-xl bg-[#2A2A2A] border border-[#333333] hover:border-[#FFD700] 
                        hover:-translate-y-2 transition-all duration-300 cursor-pointer
                        hover:shadow-[0_20px_40px_rgba(255,215,0,0.2)] group'
                    >
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mb-6">
                            {renderStars(testimonial.rating)}
                        </div>
                        
                        {/* Testimonial Content */}
                        <p className='text-gray-300 text-sm leading-relaxed mb-6 italic'>
                            "{testimonial.content}"
                        </p>
                        
                        {/* Divider */}
                        <hr className='mb-6 border-[#333333] group-hover:border-[#FFD700]/30 transition-colors' />
                        
                        {/* User Info */}
                        <div className='flex items-center gap-4'>
                            <div className='relative'>
                                <img 
                                    src={testimonial.image} 
                                    className='w-14 h-14 object-cover rounded-full border-2 border-[#FFD700]' 
                                    alt={testimonial.name} 
                                />
                                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2A2A2A]'></div>
                            </div>
                            <div className='text-sm'>
                                <h3 className='font-semibold text-[#FFD700] mb-1'>{testimonial.name}</h3>
                                <p className='text-gray-400 text-xs leading-relaxed'>{testimonial.title}</p>
                            </div>
                        </div>

                        {/* Quote decoration */}
                        <div className='absolute top-4 right-4 text-[#FFD700]/20 text-4xl font-serif group-hover:text-[#FFD700]/40 transition-colors'>
                            "
                        </div>
                    </div>
                ))}
            </div>

           
        </div>
    )
}

export default Testimonial