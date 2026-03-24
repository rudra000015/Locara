'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import TextPortal from '@/components/ui/TextPortal';
import PopupCard from '@/components/ui/PopupCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import IntroBanner from '@/components/ui/IntroBanner';

function HomeContent() {
  const user = useStore(s => s.user);
  const role = useStore(s => s.role);
  const router = useRouter();
  
  const [showPortal, setShowPortal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [portalComplete, setPortalComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Navigate after portal animation completes and popup is closed
  useEffect(() => {
    if (portalComplete && !showPopup && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        router.push(role === 'owner' ? '/owner' : '/explorer');
      }, 500);
    }
  }, [portalComplete, showPopup, role, router, isTransitioning]);

  const handleLoginSuccess = () => {
    setShowPortal(true);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="relative min-h-screen">
        {/* 1. Login Page (no shutter) */}
        {!user && (
          <Suspense fallback={<LoadingSpinner message="Loading login..." />}>
            <AuthScreen onLoginSuccess={handleLoginSuccess} />
          </Suspense>
        )}
      </div>

      {/* 2. Text Portal triggers after successful login */}
      <TextPortal 
        show={showPortal} 
        onComplete={() => setPortalComplete(true)} 
      />

      {/* 3. Popup Card shows during text portal */}
      <PopupCard
        show={showPopup}
        title="Welcome!"
        message="You have successfully logged in. Get ready to explore the heritage shops!"
        userName={user?.name}
        userImage={user?.img}
        onClose={handlePopupClose}
      />

      <IntroBanner />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner message="Initializing Locara..." />}>
      <HomeContent />
    </Suspense>
  );
}