import React from 'react';
import { motion } from 'framer-motion';

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400">Coming Soon...</h1>
        <p className="text-lg">We're working on this feature. Please check back later!</p>
      </motion.div>
    </div>
  );
}