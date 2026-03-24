'use client';

import React, { useState, useEffect } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import TextPortal from '@/components/ui/TextPortal';
import PopupCard from '@/components/ui/PopupCard';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import IntroBanner from '@/components/ui/IntroBanner';

export default function Home() {
  const user = useStore(s => s.user);
  const role = useStore(s => s.role);
  const router = useRouter();
  
  const [showPortal, setShowPortal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [portalComplete, setPortalComplete] = useState(false);

  // Navigate after portal animation completes and popup is closed
  useEffect(() => {
    if (portalComplete && !showPopup) {
      setTimeout(() => {
        router.push(role === 'owner' ? '/owner' : '/explorer');
      }, 500);
    }
  }, [portalComplete, showPopup, role, router]);

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
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
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