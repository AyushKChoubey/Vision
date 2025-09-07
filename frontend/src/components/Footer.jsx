import React from 'react'
import logo from '../assets/logo.svg';


const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12 w-full text-gray-400 bg-[#1A1A1A] border-t border-[#333333]">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-[#333333] pb-8">
        
        {/* Logo and Description */}
        <div className="md:max-w-96">
          <div className='flex items-center mb-6'>
            <svg width="35" height="28" viewBox="0 0 35 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-6 mr-2">
              <path d="M8.63281 0L15.8667 6.18025C16.2962 6.54716 16.5438 7.08559 16.5438 7.65266V12.3104L9.30979 6.13018C8.88033 5.76327 8.63281 5.22484 8.63281 4.65773V0Z" fill="#FFD700"/>
              <path d="M8.63281 27.9999L15.8667 21.8196C16.2962 21.4527 16.5438 20.9143 16.5438 20.3472V15.6895L9.30979 21.8697C8.88033 22.2366 8.63281 22.775 8.63281 23.3421V27.9999Z" fill="#FFD700"/>
              <path d="M0 6.5166L7.13558 12.5788C7.48152 12.8727 7.91958 13.0339 8.37228 13.0339H14.1268L7.00881 6.97314C6.66261 6.67835 6.22387 6.5166 5.77046 6.5166H0Z" fill="#FFD700"/>
              <path d="M0 21.4822L7.09169 15.4235C7.43826 15.1274 7.87793 14.9648 8.33245 14.9648H14.144L7.00839 21.027C6.66242 21.3209 6.22434 21.4822 5.77166 21.4822H0Z" fill="#FFD700"/>
              <path d="M26.3719 0L19.1379 6.18025C18.7085 6.54716 18.4609 7.08559 18.4609 7.65266V12.3104L25.6949 6.13018C26.1243 5.76327 26.3719 5.22484 26.3719 4.65773V0Z" fill="#FFD700"/>
              <path d="M26.3719 27.9999L19.1379 21.8196C18.7085 21.4527 18.4609 20.9143 18.4609 20.3472V15.6895L25.6949 21.8697C26.1243 22.2366 26.3719 22.775 26.3719 23.3421V27.9999Z" fill="#FFD700"/>
              <path d="M35.0019 6.5166L27.8663 12.5788C27.5204 12.8727 27.0822 13.0339 26.6296 13.0339H20.875L27.9931 6.97314C28.3392 6.67835 28.778 6.5166 29.2314 6.5166H35.0019Z" fill="#FFD700"/>
              <path d="M34.9994 21.4822L27.9077 15.4235C27.5612 15.1274 27.1214 14.9648 26.6669 14.9648H20.8555L27.991 21.027C28.337 21.3209 28.775 21.4822 29.2277 21.4822H34.9994Z" fill="#FFD700"/>
            </svg>
            <span className="text-[#FFD700] font-bold text-xl">VisionCast</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            We make social media effortless. Our platform helps you generate stunning images and videos with AI, craft engaging content, and schedule posts seamlessly across Instagram, Facebook, and X. Whether you're a business, creator, or marketer, we streamline your digital presence with smart automation and creative tools — so you can focus on growing while we handle the posting.
          </p>
          
          {/* Social Media Links */}
          <div className='flex gap-4 mt-6'>
            <a href="#" className='w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center border border-[#333333] hover:border-[#FFD700] hover:bg-[#FFD700] hover:text-[#0F0F0F] transition-all'>
              <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className='w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center border border-[#333333] hover:border-[#FFD700] hover:bg-[#FFD700] hover:text-[#0F0F0F] transition-all'>
              <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" className='w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center border border-[#333333] hover:border-[#FFD700] hover:bg-[#FFD700] hover:text-[#0F0F0F] transition-all'>
              <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="flex-1 flex items-start md:justify-end gap-12">
          {/* Company Links */}
          <div>
            <h2 className="font-semibold mb-5 text-[#FFD700]">Company</h2>
            <ul className="text-sm space-y-3">
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">Contact us</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">Privacy policy</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">Terms of service</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h2 className="font-semibold mb-5 text-[#FFD700]">Resources</h2>
            <ul className="text-sm space-y-3">
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#FFD700] transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h2 className="font-semibold text-[#FFD700] mb-5">Subscribe to our newsletter</h2>
            <div className="text-sm space-y-4">
              <p className='text-gray-400'>The latest news, articles, and resources, sent to your inbox weekly.</p>
              <div className="flex items-center gap-2">
                <input 
                  className="border border-[#333333] bg-[#2A2A2A] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none w-full max-w-64 h-10 rounded-lg px-3" 
                  type="email" 
                  placeholder="Enter your email"
                />
                <button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F0F] w-28 h-10 rounded-lg hover:scale-105 transition-transform font-medium shadow-lg">
                  Subscribe
                </button>
              </div>
              <p className='text-xs text-gray-500'>We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright */}
      <div className="pt-6 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs md:text-sm text-gray-500">
          Copyright 2025 © VisionCast. All Rights Reserved.
        </p>
        <div className='flex gap-6 text-xs text-gray-500'>
          <a href="#" className="hover:text-[#FFD700] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#FFD700] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#FFD700] transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
