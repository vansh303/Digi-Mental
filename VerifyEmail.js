import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { auth, sendEmailVerification } from '../firebase';

export default function VerifyEmail() {
  const user = auth.currentUser;

  const resendVerificationEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        toast.success("Verification email resent! Please check your inbox.");
      } catch (error) {
        toast.error("Failed to resend verification email. Please try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          Verify Your Email
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          A verification link has been sent to your email address:
          <br />
          <strong className="text-blue-600 dark:text-blue-400">{user?.email}</strong>
        </p>
        <p className="mt-4 text-sm">
          Please click on the link in the email to activate your account.
        </p>
        <button
          onClick={resendVerificationEmail}
          className="mt-6 px-6 py-3 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:opacity-95 transition"
        >
          Resend Verification Email
        </button>
      </motion.div>
    </div>
  );
}