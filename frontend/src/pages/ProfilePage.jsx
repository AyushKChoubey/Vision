import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Save, ArrowLeft, User, Mail, Calendar, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.js';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setSaving(true);
        const result = await apiService.users.uploadAvatar(file);
        
        if (result.status === 'success' && result.data.user) {
          // Update the user context with new avatar
          updateProfile({ avatar: result.data.user.avatar });
        } else {
          throw new Error(result.message || 'Failed to upload avatar');
        }
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        setError(error.message || 'Failed to upload avatar');
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] relative z-10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/ai')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#FFD700] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black rounded-lg hover:from-[#FFC700] hover:to-[#FF9500] transition-all duration-300 font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black rounded-lg hover:from-[#FFC700] hover:to-[#FF9500] transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=FFD700&color=0F0F0F`}
                  alt={user?.fullName}
                  className="w-24 h-24 rounded-full border-4 border-[#FFD700] shadow-lg"
                />
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFC700] transition-colors"
                    >
                      <Camera className="w-4 h-4 text-black" />
                    </label>
                  </>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-1">{user?.fullName}</h2>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Verified Account</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Activity Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Images Created</span>
                  <span className="text-white font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Videos Created</span>
                  <span className="text-white font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Posts Published</span>
                  <span className="text-white font-medium">15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-[#FFD700] mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#333333] bg-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  ) : (
                    <p className="text-white bg-[#2A2A2A] px-4 py-3 rounded-lg border border-[#333333]">
                      {user?.firstName || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#333333] bg-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  ) : (
                    <p className="text-white bg-[#2A2A2A] px-4 py-3 rounded-lg border border-[#333333]">
                      {user?.lastName || 'Not set'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <p className="text-white bg-[#2A2A2A] px-4 py-3 rounded-lg border border-[#333333] opacity-75">
                    {user?.email}
                    <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 rounded-lg border border-[#333333] bg-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors resize-none"
                    />
                  ) : (
                    <p className="text-white bg-[#2A2A2A] px-4 py-3 rounded-lg border border-[#333333] min-h-[84px] flex items-start">
                      {formData.bio || 'No bio added yet'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 rounded-lg border border-[#333333] bg-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  ) : (
                    <p className="text-white bg-[#2A2A2A] px-4 py-3 rounded-lg border border-[#333333]">
                      {formData.website ? (
                        <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:text-[#FFC700] transition-colors">
                          {formData.website}
                        </a>
                      ) : (
                        'Not set'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="w-full px-4 py-3 rounded-lg border border-[#333333] bg-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  ) : (
                    <p className="text-white bg-[#2A2A2A] px-4 py-3 rounded-lg border border-[#333333]">
                      {formData.location || 'Not set'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
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
  );
};

export default ProfilePage;
