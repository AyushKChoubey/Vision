import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const SignUpPage = ({ onToggleToSignIn, onSuccess }) => {
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!formData.firstName || !formData.email) {
                setError('Please fill in all required fields');
                return;
            }
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                setError('Please enter a valid email address');
                return;
            }
        }
        setCurrentStep(2);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
            if (result.success) {
                onSuccess?.();
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
            <style jsx="true">{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .slide-up { animation: slide-up 0.5s ease-out; }
        .gradient-text {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400/10 to-orange-400/5 rounded-full blur-3xl pulse-glow" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-yellow-400/5 rounded-full blur-3xl pulse-glow" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-2xl pulse-glow" style={{ animationDelay: '0.7s' }} />
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-lg mx-auto p-8">
                {/* Header */}
                <div className="text-center mb-8 slide-up">
                    <div className="flex items-center justify-center mb-6">
                        <Logo className="w-12 h-10 mr-3" />
                        <span className="gradient-text font-bold text-3xl">VisionCast</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Join VisionCast</h1>
                    <p className="text-gray-400 text-lg">Create your account and start your AI journey</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${currentStep >= 1 ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-gray-400'
                            }`}>1</div>
                        <div className={`w-12 h-1 rounded transition-all ${currentStep >= 2 ? 'bg-yellow-400' : 'bg-gray-700'
                            }`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${currentStep >= 2 ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-gray-400'
                            }`}>2</div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-yellow-400/20 shadow-2xl slide-up">

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 slide-up">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="space-y-6">

                        {currentStep === 1 && (
                            <div className="space-y-4 slide-up">
                                <h2 className="text-xl font-semibold text-white text-center mb-6">Personal Information</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name *"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 rounded-xl border border-yellow-400/30 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 rounded-xl border border-yellow-400/30 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
                                    />
                                </div>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address *"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 rounded-xl border border-yellow-400/30 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 transform"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4 slide-up">
                                <h2 className="text-xl font-semibold text-white text-center mb-6">Create Password</h2>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password (min. 6 characters) *"
                                        value={formData.password}
                                        onChange={handleInputChange}
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

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm Password *"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 pr-12 rounded-xl border border-yellow-400/30 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                                    >
                                        {showConfirmPassword ? (
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

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="flex-1 py-4 border border-yellow-400/30 text-yellow-400 font-semibold rounded-xl hover:bg-yellow-400/10 transition-all duration-300"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Toggle to Sign In */}
                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <button
                                onClick={onToggleToSignIn}
                                className="text-yellow-400 hover:text-orange-400 font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;