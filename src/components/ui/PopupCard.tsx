'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PopupCardProps {
  show: boolean;
  title?: string;
  message?: string;
  userName?: string;
  userImage?: string;
  onClose?: () => void;
}

export default function PopupCard({ show, title, message, userName, userImage, onClose }: PopupCardProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 z-[115] -translate-x-1/2 -translate-y-1/2 w-full max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#b87333]/10 to-[#8d5524]/10 rounded-full blur-3xl" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* User Avatar */}
                {userImage && (
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    src={userImage}
                    alt={userName || 'User'}
                    className="w-16 h-16 rounded-full border-4 border-[#b87333] mx-auto mb-4 object-cover shadow-lg"
                  />
                )}

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-black text-gray-800 mb-2"
                >
                  {title || 'Welcome!'}
                </motion.h2>

                {/* User Name */}
                {userName && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg font-bold bg-gradient-to-r from-[#8d5524] to-[#b87333] bg-clip-text text-transparent mb-3"
                  >
                    {userName}
                  </motion.p>
                )}

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed"
                >
                  {message || 'You have successfully logged in. Get ready to explore the heritage shops!'}
                </motion.p>

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  Continue
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
