import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full border-2 border-[#FFD700] hover:border-[#FFA500] transition-colors"
      >
        <img
          src={user.imageUrl}
          alt={user.fullName}
          className="w-8 h-8 rounded-full"
        />
        <svg className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[99]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#333333] rounded-xl shadow-xl z-[100]">
          {/* User Info */}
          <div className="p-4 border-b border-[#333333]">
            <div className="flex items-center space-x-3">
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-12 h-12 rounded-full border-2 border-[#FFD700]"
              />
              <div>
                <p className="text-white font-semibold">{user.fullName}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-[#2A2A2A] transition-colors"
              onClick={() => handleNavigation('/ai/profile')}
            >
              <svg className="w-5 h-5 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </button>
            
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-[#2A2A2A] transition-colors"
              onClick={() => handleNavigation('/ai/settings')}
            >
              <svg className="w-5 h-5 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
            
            <hr className="border-[#333333] my-2" />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-[#2A2A2A] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[#333333]">
            <p className="text-xs text-gray-500 text-center">VisionCast v1.0</p>
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserButton;