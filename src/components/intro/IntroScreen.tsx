'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Add an onFinish prop so Home knows when the intro is done
interface IntroProps {
  onFinish?: () => void;
}

export default function IntroScreen({ onFinish }: IntroProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // The timer now only runs when this component is mounted and visible
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onFinish) onFinish(); // Tell parent component it's over
      }, 5000); // Adjust duration of your intro video
      return () => clearTimeout(timer);
    }
  }, [isVisible, onFinish]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-40 bg-black flex items-center justify-center"
    >
      {/* Your Intro Video or Animation */}
      <video
        autoPlay
        muted
        className="w-full h-full object-cover"
        onLoadedData={() => setIsVideoLoaded(true)}
      >
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>
      
      {/* Optional Brand Overlay during Video */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      </div>
    </motion.div>
  );
}