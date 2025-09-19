import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function EmailVerificationChecker({ user, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    if (user && !user.emailVerified) {
      intervalId = setInterval(async () => {
        await user.reload();
        if (auth.currentUser?.emailVerified) {
          clearInterval(intervalId);
          toast.success("Email successfully verified! You can now access your account.");
          navigate('/dashboard'); // Redirect to dashboard or home
        }
      }, 2000); // Check every 2 seconds
    } else if (user && user.emailVerified) {
      navigate('/dashboard');
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, navigate]);

  return children;
}