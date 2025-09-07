import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const SignInPage = ({ onToggleToSignUp, onSuccess }) => {
  const { signIn } = useAuth();
  const [isSplitView, setIsSplitView] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputFocus = () => {
    setIsSplitView(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        setIsSplitView(false);
        onSuccess?.();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <style jsx="true">{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-30px) rotate(180deg) scale(1.1);
            opacity: 1;
          }
        }
        .float-1 { animation: float 8s ease-in-out infinite; animation-delay: 0s; }
        .float-2 { animation: float 8s ease-in-out infinite; animation-delay: 2s; }
        .float-3 { animation: float 8s ease-in-out infinite; animation-delay: 4s; }
        .float-4 { animation: float 8s ease-in-out infinite; animation-delay: 1s; }
        .gradient-text {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className={`flex min-h-screen relative transition-all duration-700 ease-out ${isSplitView ? 'split-view' : ''}`}>
        
        {/* Left Panel */}
        <div className={`flex items-center justify-center relative z-10 transition-all duration-700 ease-out ${
          isSplitView 
            ? 'w-1/2 bg-black' 
            : 'w-full bg-gradient-to-br from-black to-gray-800'
        }`}>
          
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/5 float-1 transition-all duration-700 ease-out ${
              isSplitView ? 'top-[20%] left-[15%]' : 'top-[15%] left-[8%]'
            }`} />
            <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/5 float-2 transition-all duration-700 ease-out ${
              isSplitView ? 'top-[60%] left-[60%]' : 'top-[65%] left-[75%]'
            }`} />
            <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/5 float-3 transition-all duration-700 ease-out ${
              isSplitView ? 'top-[80%] left-[25%]' : 'top-[85%] left-[15%]'
            }`} />
            <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/5 float-4 transition-all duration-700 ease-out ${
              isSplitView ? 'top-[10%] right-[25%]' : 'top-[5%] right-[15%]'
            }`} />
          </div>

          {/* Login Container */}
          <div className="relative z-20 bg-black/95 backdrop-blur-xl rounded-3xl p-12 w-full max-w-md border-2 border-yellow-400/30 shadow-2xl shadow-black/50">
            
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Logo className="w-12 h-10 mr-3" />
              </div>
              <h1 className="text-5xl font-bold mb-2 gradient-text tracking-wide">VisionCast</h1>
              <p className="text-gray-400 text-lg">Sign in to continue</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="w-full px-4 py-4 rounded-xl border border-yellow-400/30 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="w-full px-4 py-4 pr-12 rounded-xl border border-yellow-400/30 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-b border-gray-700"></div>
              <span className="px-4 text-gray-500 text-sm">or continue with</span>
              <div className="flex-1 border-b border-gray-700"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3">
              {['Google', 'Apple', 'Facebook'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleSocialLogin(provider)}
                  className="py-3 px-4 border border-yellow-400/30 rounded-xl bg-white/5 text-yellow-400 hover:bg-yellow-400/10 hover:-translate-y-1 hover:border-yellow-400 transition-all duration-300 transform font-medium"
                >
                  {provider}
                </button>
              ))}
            </div>

            {/* Extra Links */}
            <div className="text-center mt-6 text-sm text-gray-400">
              <a href="#" className="text-yellow-400 hover:text-orange-400 transition-colors">
                Forgot Password?
              </a>
              <span className="mx-2">•</span>
              <button 
                onClick={onToggleToSignUp}
                className="text-yellow-400 hover:text-orange-400 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className={`fixed top-0 right-0 w-1/2 h-screen bg-black border-l-2 border-yellow-400/30 overflow-hidden transition-transform duration-700 ease-out ${
          isSplitView ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="text-white p-16 max-w-2xl">
            <h2 className="text-4xl font-bold mb-6 gradient-text">VisionCast in Action</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover how VisionCast transforms your workflow with smart predictions, 
              real-time analytics, and seamless integration.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: "⚡",
                  title: "Real-Time Insights",
                  description: "Get instant analytics and predictions that keep you ahead of the curve."
                },
                {
                  icon: "🔒",
                  title: "Secure Access",
                  description: "Advanced encryption keeps your data safe while maintaining lightning speed."
                },
                {
                  icon: "🎨",
                  title: "Customizable",
                  description: "Tailor dashboards and reports to fit your exact business needs."
                },
                {
                  icon: "🤝",
                  title: "Collaboration",
                  description: "Work with your team in real-time, anywhere, on any device."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-yellow-400/20 rounded-2xl p-6 hover:-translate-y-2 hover:border-yellow-400 hover:bg-white/10 transition-all duration-300 transform group"
                >
                  <h3 className="text-yellow-400 text-lg font-semibold mb-3 group-hover:text-yellow-300 transition-colors">
                    <span className="mr-2">{feature.icon}</span>
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;