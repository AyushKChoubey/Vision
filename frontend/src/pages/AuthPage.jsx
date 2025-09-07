import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/ai');
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate('/ai');
  };

  return (
    <div>
      {isSignIn ? (
        <SignInPage 
          onToggleToSignUp={() => setIsSignIn(false)}
          onSuccess={handleAuthSuccess}
        />
      ) : (
        <SignUpPage 
          onToggleToSignIn={() => setIsSignIn(true)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default AuthPage;